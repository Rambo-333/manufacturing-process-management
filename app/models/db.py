from datetime import  datetime, timezone, timedelta

from sqlalchemy import  Column, DateTime, Integer, String, UniqueConstraint, create_engine
from sqlalchemy.ext.declarative import  declarative_base
from sqlalchemy.orm import  sessionmaker

import settings


class DataBase(object):
    def __init__(self) -> None:
        self.engine = create_engine(f"sqlite:///{settings.DB_NAME}")
        self.connect_db()

    def connect_db(self) -> sessionmaker:
        Base.metadata.create_all(self.engine)
        session = sessionmaker(self.engine)
        return session()

Base = declarative_base()
database = DataBase()


class BaseDatabase(Base):
    __abstract__ = True
    id = Column(Integer,primary_key=True,nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone(timedelta(hours=+9))))
    updated_at = Column(DateTime, default=datetime.now(timezone(timedelta(hours=+9))), onupdate=datetime.now(timezone(timedelta(hours=+9))))




