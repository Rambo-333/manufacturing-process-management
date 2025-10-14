# 環境変数ベースの設定ファイル
# 本番環境では .env ファイルで値を上書きしてください

import os
from pathlib import Path

# ベースディレクトリ
BASE_DIR = Path(__file__).resolve().parent

# 環境変数から読み込み、デフォルト値を設定
# 本番環境では .env ファイルで上書き

# ログ設定
LOG_FILE = os.environ.get('LOG_FILE', str(BASE_DIR / 'app.log'))
LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
LOG_FORMAT = os.environ.get('LOG_FORMAT',
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# データベース設定
DB_NAME = os.environ.get('DATABASE_URL', str(BASE_DIR / 'app.db'))

# セキュリティ
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# セッション設定
SESSION_LIFETIME = int(os.environ.get('SESSION_LIFETIME', 3600))  # 1時間（秒）

# ファイルアップロード制限
MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB

# デバッグモード（本番環境では必ず False に設定）
DEBUG = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 'yes')

# サーバー設定
HOST = os.environ.get('HOST', 'localhost')
PORT = int(os.environ.get('PORT', 5000))

# アプリケーション設定
APP_NAME = 'ManufacturingApp'
