"""
サンプルデータベース作成スクリプト
app_sample.db を作成し、サンプルデータを挿入します
"""
import sqlite3
from datetime import datetime, timedelta

# データベースファイル名
DB_NAME = 'app_sample.db'

# データベース接続
conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

# visテーブルを作成
cursor.execute('''
CREATE TABLE IF NOT EXISTS vis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processDay1 TEXT,
    man1 TEXT,
    processDay2 TEXT,
    man2 TEXT,
    lotno TEXT UNIQUE,
    kind TEXT,
    weight REAL,
    length INTEGER,
    loss INTEGER,
    memo TEXT,
    shape TEXT,
    shapeHand TEXT,
    shapeCount TEXT,
    lengthRangeNo INTEGER
)
''')

# サンプルデータ
sample_data = [
    {
        'processDay1': '2024-01-15T09:30',
        'man1': 'Worker-A',
        'processDay2': '2024-01-15T14:00',
        'man2': 'QA-Inspector-A',
        'lotno': 'LOT-2024-001',
        'kind': 'Glass Tube Type-A',
        'weight': 12.5,
        'length': 1200,
        'loss': 15,
        'memo': 'Minor bubbles detected in middle section',
        'shape': '[{"x":150,"y":200,"shapes":1},{"x":300,"y":250,"shapes":2}]',
        'shapeHand': '[]',
        'shapeCount': '[2,1,0,0,0,0,0,0,0,0,0,0,0,0,0]',
        'lengthRangeNo': 1
    },
    {
        'processDay1': '2024-01-16T10:15',
        'man1': 'Worker-B',
        'processDay2': '2024-01-16T15:30',
        'man2': 'QA-Inspector-A',
        'lotno': 'LOT-2024-002',
        'kind': 'Glass Tube Type-B',
        'weight': 15.8,
        'length': 1500,
        'loss': 25,
        'memo': 'Scratch found near edge',
        'shape': '[{"x":200,"y":180,"shapes":9},{"x":450,"y":220,"shapes":1}]',
        'shapeHand': '[]',
        'shapeCount': '[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0]',
        'lengthRangeNo': 2
    },
    {
        'processDay1': '2024-01-17T08:45',
        'man1': 'Worker-C',
        'processDay2': '2024-01-17T13:20',
        'man2': 'QA-Inspector-B',
        'lotno': 'LOT-2024-003',
        'kind': 'Glass Tube Type-A',
        'weight': 11.3,
        'length': 1100,
        'loss': 10,
        'memo': 'Good quality, passed inspection',
        'shape': '[{"x":180,"y":195,"shapes":1}]',
        'shapeHand': '[]',
        'shapeCount': '[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',
        'lengthRangeNo': 1
    },
    {
        'processDay1': '2024-01-18T11:00',
        'man1': 'Worker-D',
        'processDay2': '',
        'man2': '',
        'lotno': 'LOT-2024-004',
        'kind': 'Glass Tube Type-C',
        'weight': 18.2,
        'length': 1800,
        'loss': 30,
        'memo': 'Awaiting QA inspection',
        'shape': '[{"x":220,"y":210,"shapes":3},{"x":400,"y":240,"shapes":1},{"x":600,"y":200,"shapes":2}]',
        'shapeHand': '[]',
        'shapeCount': '[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]',
        'lengthRangeNo': 3
    },
    {
        'processDay1': '2024-01-19T09:00',
        'man1': 'Worker-E',
        'processDay2': '2024-01-19T16:00',
        'man2': 'QA-Inspector-B',
        'lotno': 'LOT-2024-005',
        'kind': 'Glass Tube Type-B',
        'weight': 14.7,
        'length': 1450,
        'loss': 20,
        'memo': 'Multiple defects - chipping and inclusion',
        'shape': '[{"x":250,"y":190,"shapes":11},{"x":380,"y":230,"shapes":8}]',
        'shapeHand': '[{"x":500,"y":200,"type":"touchstart","line":0},{"x":510,"y":205,"type":"touchmove","line":0},{"x":520,"y":210,"type":"touchend","line":0}]',
        'shapeCount': '[0,0,0,0,0,0,0,1,0,0,1,0,0,0,0]',
        'lengthRangeNo': 2
    }
]

# データを挿入
for data in sample_data:
    cursor.execute('''
        INSERT INTO vis (
            processDay1, man1, processDay2, man2, lotno, kind,
            weight, length, loss, memo, shape, shapeHand,
            shapeCount, lengthRangeNo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['processDay1'], data['man1'], data['processDay2'], data['man2'],
        data['lotno'], data['kind'], data['weight'], data['length'],
        data['loss'], data['memo'], data['shape'], data['shapeHand'],
        data['shapeCount'], data['lengthRangeNo']
    ))

# コミットして閉じる
conn.commit()
conn.close()

print(f"OK: {DB_NAME} created successfully")
print(f"OK: {len(sample_data)} sample records inserted")
