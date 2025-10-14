import logging
from contextlib import contextmanager
from sqlalchemy import Column, String, UniqueConstraint, Integer, Float, DateTime
from sqlalchemy.exc import SQLAlchemyError
from app.models.db import BaseDatabase, database
from datetime import datetime

# ロガー設定
logger = logging.getLogger(__name__)

# 定数定義
SKIP_COLUMNS = {1, 2}  # created_at, updated_at のインデックス
MAX_RECORDS = 50  # 最大取得レコード数

# カラムの順序を固定（JavaScript側の期待する順序と一致させる）
COLUMN_ORDER = [
    'id', 'created_at', 'updated_at',
    'processDay1', 'man1', 'processDay2', 'man2',
    'lotno', 'kind', 'weight', 'length', 'loss', 'memo',
    'shape', 'shapeHand', 'shapeCount', 'lengthRangeNo'
]


@contextmanager
def get_db_session():
    """
    データベースセッションのコンテキストマネージャー

    【機能】
    - セッションの自動生成
    - 成功時の自動コミット
    - エラー時の自動ロールバック
    - 確実なセッションクローズ

    Yields:
        session: データベースセッション
    """
    session = database.connect_db()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


class VIS(BaseDatabase):
    __tablename__ = "vis"
    processDay1 = Column(String)
    man1 = Column(String)
    processDay2 = Column(String)
    man2 = Column(String)
    lotno = Column(String)
    UniqueConstraint(lotno)
    kind = Column(String)
    weight = Column(Float)
    length = Column(Integer)
    loss = Column(Integer)
    memo = Column(String)
    shape = Column(String)
    shapeHand = Column(String)
    shapeCount = Column(String)
    lengthRangeNo = Column(Integer)

    # 許可されたフィールド（セキュリティ対策）
    ALLOWED_FIELDS = {
        'processDay1', 'man1', 'processDay2', 'man2', 'lotno',
        'kind', 'weight', 'length', 'loss', 'memo',
        'shape', 'shapeHand', 'shapeCount', 'lengthRangeNo'
    }

    # リクエストフォームDB書き込み
    @classmethod
    def get_or_create(cls, data_list):
        """
        データベースへの保存または更新（context manager使用）

        Args:
            data_list: フォームデータ

        Raises:
            ValueError: バリデーションエラー
            SQLAlchemyError: データベースエラー

        【改善点】
        - context managerで確実なリソース管理
        - ALLOWED_FIELDSホワイトリストでセキュリティ向上
        - デバッグログに変更
        """
        logger.debug(f"Data list: {data_list}")

        # ロット番号の存在チェック
        lotno = data_list.get('lotno')
        if not lotno:
            raise ValueError("Lot number is required")

        try:
            with get_db_session() as session:
                # 既存データの確認
                data = session.query(cls).filter(cls.lotno == lotno).first()

                if data:
                    # 既存レコードの更新
                    logger.info(f"Updating existing data for lotno: {lotno}")
                    for k, v in data_list.items():
                        if k in cls.ALLOWED_FIELDS:
                            setattr(data, k, v)
                else:
                    # 新規レコードの作成
                    logger.info(f"Creating new data for lotno: {lotno}")
                    data = cls()
                    for k, v in data_list.items():
                        if k in cls.ALLOWED_FIELDS:
                            setattr(data, k, v)
                    session.add(data)

                logger.info(f"Data saved successfully for lotno: {lotno}")

        except ValueError as e:
            logger.warning(f"Validation error in get_or_create: {e}")
            raise

        except SQLAlchemyError as e:
            logger.error(f"Database error in get_or_create: {e}", exc_info=True)
            raise Exception("Database error occurred")

        except Exception as e:
            logger.error(f"Unexpected error in get_or_create: {e}", exc_info=True)
            raise

    # DB_read_one
    @classmethod
    def read_data_one(cls, lotno):
        """
        単一ロット番号のデータ取得（context manager使用）

        Args:
            lotno: ロット番号

        Returns:
            tuple: (カラムリスト, データリスト)

        【改善点】
        - context managerで確実なリソース管理
        - COLUMN_ORDER定数で順序を固定
        """
        logger.debug(f"Reading data for lotno: {lotno}")

        try:
            with get_db_session() as session:
                dbdata = session.query(cls).filter(cls.lotno == lotno).first()

                if dbdata is None:
                    logger.info(f"No data found for lotno: {lotno}")
                    data = []
                else:
                    # COLUMN_ORDERに従ってデータを取得
                    data = ["" for _ in range(len(COLUMN_ORDER))]
                    for j, col_name in enumerate(COLUMN_ORDER):
                        if j not in SKIP_COLUMNS:  # created_at, updated_atをスキップ
                            value = getattr(dbdata, col_name, None)
                            if value is not None:
                                data[j] = value
                    logger.info(f"Data found for lotno: {lotno}")
                    logger.debug(f"Columns: {COLUMN_ORDER}")
                    logger.debug(f"Data: {data}")

                return COLUMN_ORDER, data

        except SQLAlchemyError as e:
            logger.error(f"Database error in read_data_one: {e}", exc_info=True)
            raise Exception("Database error occurred")

        except Exception as e:
            logger.error(f"Unexpected error in read_data_one: {e}", exc_info=True)
            raise

    # DB_read
    @classmethod
    def read_data(cls):
        """
        全データ取得（最新N件）（context manager使用）

        Returns:
            tuple: (カラムリスト, データリスト)

        【改善点】
        - context managerで確実なリソース管理
        - MAX_RECORDS定数を使用
        - COLUMN_ORDER定数で順序を固定
        """
        logger.debug(f"Reading all data (limit: {MAX_RECORDS})")

        try:
            with get_db_session() as session:
                dbdata = session.query(cls).order_by(cls.id.desc()).limit(MAX_RECORDS).all()

                data = []
                for target in dbdata:
                    record = {}
                    # COLUMN_ORDERに従ってデータを取得
                    for column in COLUMN_ORDER:
                        value = getattr(target, column, None)
                        if value is not None:
                            record[column] = value
                    data.append(record)

                logger.info(f"Retrieved {len(data)} records")
                return COLUMN_ORDER, data

        except SQLAlchemyError as e:
            logger.error(f"Database error in read_data: {e}", exc_info=True)
            raise Exception("Database error occurred")

        except Exception as e:
            logger.error(f"Unexpected error in read_data: {e}", exc_info=True)
            raise
