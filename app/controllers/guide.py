# 標準ライブラリのインポート
import base64
import json
import re
import logging
from pathlib import Path

# 外部ライブラリや自作モジュールのインポート
from flask import Flask, redirect, render_template, request, url_for, jsonify, make_response
from flask_wtf.csrf import CSRFProtect
from app.models.vi import VIS
import settings

# ロギング設定
logging.basicConfig(
    filename=settings.LOG_FILE,
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__, template_folder='../../templates', static_folder='../../static')

# アプリケーション設定
app.config['SECRET_KEY'] = settings.SECRET_KEY
app.config['MAX_CONTENT_LENGTH'] = settings.MAX_CONTENT_LENGTH
app.config['PERMANENT_SESSION_LIFETIME'] = settings.SESSION_LIFETIME

# CSRF保護の有効化
csrf = CSRFProtect(app)

#----------------------------------------------------------------------
class WebServer(object):
    def start(self, debug=False):
        app.run(debug=True, host='0.0.0.0', port=5050)


# class WebServer(object):
#     def start():
#         app.run()

#----------------------------------------------------------------------

# Webサーバーを起動
server = WebServer()


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/vi", methods=['GET', 'POST'])
def vi():
    """
    Visual Inspection ページのメインルート

    【エラーハンドリング】
    - ValueError: バリデーションエラー（ユーザーに詳細を返す）
    - Exception: 予期しないエラー（詳細は隠す）
    """
    try:
        if request.method == 'POST':
            # 画像アップロード処理
            if 'image' in request.form:
                handle_post_request(request.form)

            # データ保存
            data_list = request.form
            VIS.get_or_create(data_list)
            logger.info(f"Data saved successfully for lotno: {data_list.get('lotno', 'N/A')}")
            return render_template('vi.html')

        elif request.method == 'GET' and request.args.get('input'):
            # データ取得API
            nocheck = request.args.get('input')
            if nocheck == 'showData':
                c_list, data = VIS.read_data()
            else:
                c_list, data = VIS.read_data_one(nocheck)
            return jsonify({'result1': c_list, 'result2': data})

        # 通常のGETリクエスト
        return render_template('vi.html')

    except ValueError as e:
        # バリデーションエラー（ユーザーのミス）
        logger.warning(f"Validation error in /vi: {e}")
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        # 予期しないエラー（内部エラー）
        logger.error(f"Unexpected error in /vi: {e}", exc_info=True)
        return jsonify({"error": "An internal error occurred"}), 500

def handle_post_request(form_data):
    """
    画像アップロード処理（セキュリティ対策実装済み）

    【セキュリティ対策】
    1. ファイル名のサニタイズ(英数字と-_のみ許可)
    2. パストラバーサル防止
    3. ファイルサイズ制限(10MB)
    4. エラーハンドリング
    """
    try:
        # 画像データの取得
        image_data_url = form_data['image']
        lot_number = form_data['lotno']

        # 1. ロット番号の検証(英数字、ハイフン、アンダースコアのみ)
        if not re.match(r'^[a-zA-Z0-9_-]+$', lot_number):
            logger.warning(f"Invalid lot number format: {lot_number}")
            raise ValueError("Lot number must contain only alphanumeric characters, hyphens, and underscores")

        # 2. 長さ制限(50文字まで)
        if len(lot_number) > 50:
            logger.warning(f"Lot number too long: {len(lot_number)} characters")
            raise ValueError("Lot number must be 50 characters or less")

        # 3. 画像データのデコード
        _header, encoded = image_data_url.split(",", 1)
        data = base64.b64decode(encoded)

        # 4. ファイルサイズチェック(10MB制限)
        if len(data) > 10 * 1024 * 1024:
            logger.warning(f"File too large: {len(data)} bytes")
            raise ValueError("Image file size exceeds 10MB limit")

        # 5. 安全なファイルパスの構築
        save_dir_path = Path(__file__).parent.parent.parent / 'visImage'
        safe_filename = Path(lot_number).name + '.jpg'  # パストラバーサル防止
        save_path = save_dir_path / safe_filename

        # 6. ディレクトリ外への書き込み防止(二重チェック)
        if not save_path.resolve().is_relative_to(save_dir_path.resolve()):
            logger.error(f"Path traversal attempt detected: {lot_number}")
            raise ValueError("Invalid file path")

        # 7. ディレクトリが存在しない場合は作成
        save_dir_path.mkdir(parents=True, exist_ok=True)

        # 8. ファイル保存
        with open(save_path, 'wb') as f:
            f.write(data)

        logger.info(f"Image saved successfully: {safe_filename}")

    except ValueError as e:
        # バリデーションエラー
        logger.warning(f"Validation error: {e}")
        raise
    except Exception as e:
        # 予期しないエラー
        logger.error(f"Unexpected error in handle_post_request: {e}")
        raise


def _get_workers_from_file(filename):
    """
    ワーカーリストの読み込み（共通関数）

    Args:
        filename: ワーカーリストファイル名

    Returns:
        list: ワーカーリスト（エラー時は空リスト）

    【エラーハンドリング】
    - ファイルが存在しない場合は警告ログ + 空リスト返却
    - 読み込みエラー時はエラーログ + 空リスト返却
    """
    try:
        filepath = Path(filename)

        # ファイル存在チェック
        if not filepath.exists():
            logger.warning(f"Workers file not found: {filename}")
            return []

        # ファイル読み込み
        with open(filepath, 'r', encoding='utf-8') as f:
            workers = [line.strip() for line in f if line.strip()]

        logger.info(f"Loaded {len(workers)} workers from {filename}")
        return workers

    except Exception as e:
        logger.error(f"Error reading workers file {filename}: {e}", exc_info=True)
        return []


@app.route("/get_workers", methods=['GET'])
def get_workers():
    """
    製造担当者リストを取得するAPI

    【エラーハンドリング】
    - ファイル読み込みエラーは500エラーを返す
    - キャッシュを無効化
    """
    try:
        workers = _get_workers_from_file('workers.txt')
        response = make_response(jsonify(workers))
        response.headers['Cache-Control'] = 'no-store, must-revalidate'
        return response

    except Exception as e:
        logger.error(f"Error in get_workers: {e}", exc_info=True)
        return jsonify({"error": "Failed to load workers"}), 500


@app.route("/get_workers2", methods=['GET'])
def get_workers2():
    """
    QA担当者リストを取得するAPI

    【エラーハンドリング】
    - ファイル読み込みエラーは500エラーを返す
    - キャッシュを無効化
    """
    try:
        workers = _get_workers_from_file('workers2.txt')
        response = make_response(jsonify(workers))
        response.headers['Cache-Control'] = 'no-store, must-revalidate'
        return response

    except Exception as e:
        logger.error(f"Error in get_workers2: {e}", exc_info=True)
        return jsonify({"error": "Failed to load QA workers"}), 500
