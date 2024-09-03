import sqlite3

from sqlalchemy import Column, String, UniqueConstraint, Integer, Float, DateTime
from app.models.db import BaseDatabase, database
from datetime import datetime
import datetime


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

    # リクエストフォームDB書き込み
    @staticmethod
    def get_or_create(data_list):
        print(data_list)
        session = database.connect_db()
        table_name = VIS()
        row = bool(session.query(VIS).filter(VIS.lotno == data_list['lotno']).first())
        # データがある場合は上書きする
        if row:
            data = session.query(VIS).filter(VIS.lotno == data_list['lotno']).first()
            for k, v in data_list.items():
                if k != 'image':
                    setattr(data, k, v)
        else:
            for k, v in data_list.items():
                if k != 'image':
                    setattr(table_name, k, v)
            session.add(table_name)
        session.commit()
        session.close()

    # DB_read_one
    @staticmethod
    def read_data_one(lotno):
        session = database.connect_db()
        c_list = VIS.__table__.c.keys()
        dbdata = session.query(VIS).filter(VIS.lotno == lotno).first()
        if dbdata is None:
            data = []
        else:
            data = ["" for j in range(len(c_list))]
            for j, list_name in enumerate(c_list):
                if j != 1 and j != 2:
                    if getattr(dbdata, list_name) is not None:
                        data[j] = getattr(dbdata, list_name)
        session.close()
        return c_list, data

    # DB_read
    @staticmethod
    def read_data():
        num = 50
        session = database.connect_db()
        # c_list = ['id', 'processDay1', 'man1', 'processDay2', 'man2', 'lotno', 'kind', 'weight', 'length', 'loss',
        #                 'memo']
        c_list = VIS.__table__.c.keys()
        dbdata = session.query(VIS).order_by(VIS.id.desc()).limit(num).all()
        data = []
        for target in dbdata:
            record = {}
            for column in c_list:
                if getattr(target, column) is not None:
                    record[column] = getattr(target, column)
            data.append(record)
        session.close()
        return c_list, data
