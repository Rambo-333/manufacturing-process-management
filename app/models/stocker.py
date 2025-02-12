import sqlite3

from sqlalchemy import Column, String, UniqueConstraint, Integer, Float, DateTime
from app.models.db import BaseDatabase, database
from datetime import datetime
import datetime


class Stocker(BaseDatabase):
    __tablename__ = "stocker"
    for i in range(1,22):
        locals()[f'lotno_{i}'] = Column(String)
        locals()[f'kind_{i}'] = Column(String)
        locals()[f'OD_1_{i}'] = Column(Float)
        locals()[f'OD_1_{i}'] = Column(Float)


    # リクエストフォームDB書き込み
    # @staticmethod
    # def get_or_create(data_list):
    #     session = database.connect_db()
    #     table_name = NewCut()
    #     # データがある場合は上書きする
    #     row = bool(session.query(NewCut).filter(NewCut.lotno == data_list['lotno']).first())
    #     if row:
    #         data = session.query(NewCut).filter(NewCut.lotno == data_list['lotno']).first()
    #         for k, v in data_list.items():
    #             if str(getattr(data, k)) != v:
    #                 setattr(data, k, v)
    #     else:
    #         for k, v in data_list.items():
    #             setattr(table_name, k, v)
    #         session.add(table_name)
    #     session.commit()
    #     session.close()

    # DB_read
    @staticmethod
    def read_data():
        session = database.connect_db()
        c_list = Stocker.__table__.c.keys()
        dbdata = session.query(Stocker).order_by(Stocker.id.desc()).all()
        data = []
        for target in dbdata:
            record = {}
            for column in c_list:
                if getattr(target, column) is not None:
                    record[column] = getattr(target, column)
            data.append(record)
        session.close()
        return c_list, data

    # DB_read_one
    # @staticmethod
    # def read_data_one(lotno):
    #     session = database.connect_db()
    #     c_list = NewCut.__table__.c.keys()
    #     dbdata = session.query(NewCut).filter(NewCut.lotno == lotno).first()
    #     if dbdata is None:
    #         data = []
    #     else:
    #         data = ["" for j in range(len(c_list))]
    #         for j, list_name in enumerate(c_list):
    #             if j != 1 and j != 2:
    #                 if getattr(dbdata, list_name) is not None:
    #                     data[j] = getattr(dbdata, list_name)
    #     session.close()
    #     return c_list, data
