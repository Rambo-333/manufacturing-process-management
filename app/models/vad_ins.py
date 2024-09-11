import sqlite3

from sqlalchemy import Column, String, UniqueConstraint, Integer, Float, DateTime
from app.models.db import BaseDatabase, database
from datetime import datetime
import datetime


class vad_INS(BaseDatabase):
    __tablename__ = "vad_ins"
    processDay = Column(String)
    man = Column(String)
    lotno = Column(String)
    UniqueConstraint(lotno)
    kind = Column(String)
    length = Column(Integer)
    weight = Column(Float)
    Min_OD = Column(Float)
    Max_OD = Column(Float)
    memo = Column(String)

    # リクエストフォームDB書き込み
    @staticmethod
    def get_or_create(data_list):
        session = database.connect_db()
        table_name = vad_INS()
        # データがある場合は上書きする
        row = bool(session.query(vad_INS).filter(vad_INS.lotno == data_list['lotno']).first())
        if row:
            data = session.query(vad_INS).filter(vad_INS.lotno == data_list['lotno']).first()
            for k, v in data_list.items():
                if str(getattr(data, k)) != v:
                    setattr(data, k, v)
        else:
            for k, v in data_list.items():
                setattr(table_name, k, v)
            session.add(table_name)
        session.commit()
        session.close()

    # DB_read
    @staticmethod
    def read_data():
        num = 50
        session = database.connect_db()
        c_list = vad_INS.__table__.c.keys()
        dbdata = session.query(vad_INS).order_by(vad_INS.id.desc()).limit(num).all()
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
    @staticmethod
    def read_data_one(lotno):
        session = database.connect_db()
        c_list = vad_INS.__table__.c.keys()
        dbdata = session.query(vad_INS).filter(vad_INS.lotno == lotno).first()
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
