"""
データベース検証スクリプト
app_sample.db の内容を確認します
"""
import sqlite3

DB_NAME = 'app_sample.db'

conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

# テーブル一覧
print("=== Tables ===")
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
for table in tables:
    print(f"- {table[0]}")

print("\n=== vis Table Schema ===")
cursor.execute("PRAGMA table_info(vis);")
columns = cursor.fetchall()
for col in columns:
    print(f"Column {col[0]}: {col[1]} ({col[2]})")

print("\n=== Record Count ===")
cursor.execute("SELECT COUNT(*) FROM vis;")
count = cursor.fetchone()[0]
print(f"Total records: {count}")

print("\n=== Sample Data ===")
cursor.execute("SELECT id, lotno, kind, man1, man2, length, weight FROM vis LIMIT 5;")
records = cursor.fetchall()
print("ID | LotNo | Kind | Worker | QA | Length | Weight")
print("-" * 70)
for record in records:
    print(f"{record[0]} | {record[1]} | {record[2]} | {record[3]} | {record[4]} | {record[5]} | {record[6]}")

conn.close()
