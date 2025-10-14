"""
CSRF保護の動作確認スクリプト
"""
import sys
sys.path.insert(0, '.')

from app.controllers.guide import app

def test_csrf_protection():
    """CSRF保護が正しく動作するかテスト"""

    with app.test_client() as client:
        print("=" * 60)
        print("CSRF保護の動作テスト")
        print("=" * 60)

        # テスト1: GETリクエスト（CSRF不要）
        print("\n[テスト1] GET /vi (CSRF保護の影響なし)")
        response = client.get('/vi')
        print(f"ステータスコード: {response.status_code}")
        print(f"結果: {'✅ 成功' if response.status_code == 200 else '❌ 失敗'}")

        # テスト2: CSRFトークンなしでPOST（失敗するべき）
        print("\n[テスト2] POST /vi (CSRFトークンなし - 拒否されるべき)")
        response = client.post('/vi', data={
            'lotno': 'TEST001',
            'processDay1': '2025-01-01T10:00',
            'man1': 'テスト作業者'
        })
        print(f"ステータスコード: {response.status_code}")
        print(f"結果: {'✅ 正しく拒否' if response.status_code == 400 else '❌ 拒否されていない（脆弱）'}")

        # テスト3: CSRFトークン付きでPOST（成功するべき）
        print("\n[テスト3] POST /vi (CSRFトークン付き - 成功するべき)")
        # まずGETでページを取得してCSRFトークンを取得
        response = client.get('/vi')

        # セッションからCSRFトークンを取得
        with client.session_transaction() as sess:
            csrf_token = sess.get('csrf_token')

        if csrf_token:
            response = client.post('/vi', data={
                'csrf_token': csrf_token,
                'lotno': 'TEST001',
                'processDay1': '2025-01-01T10:00',
                'man1': 'テスト作業者'
            })
            print(f"ステータスコード: {response.status_code}")
            print(f"結果: {'✅ 成功' if response.status_code == 200 else '❌ 失敗'}")
        else:
            print("❌ CSRFトークンが生成されていません")

        print("\n" + "=" * 60)
        print("テスト完了")
        print("=" * 60)

if __name__ == '__main__':
    test_csrf_protection()
