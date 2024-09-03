import sqlite3

from sqlalchemy import Column, String, UniqueConstraint, Integer, Float, DateTime
from app.models.db import BaseDatabase, database
from datetime import datetime
import datetime


class AddCut(BaseDatabase):
    __tablename__ = "addcut"
    processDay = Column(String)
    man = Column(String)
    lotno = Column(String)
    kind = Column(String)
    cutList = Column(String)
    memo = Column(String)

    length = Column(Integer)
    weight = Column(Float)
    Top_len = Column(Integer)
    Top_OD = Column(Float)
    Btm_OD = Column(Float)
    Min_OD = Column(Float)
    Max_OD = Column(Float)

    length1 = Column(Integer)
    weight1 = Column(Float)
    Top_len1 = Column(Integer)
    length2 = Column(Integer)
    weight2 = Column(Float)
    Top_len2 = Column(Integer)
    length3 = Column(Integer)
    weight3 = Column(Float)
    Top_len3 = Column(Integer)
    length4 = Column(Integer)
    weight4 = Column(Float)
    Top_len4 = Column(Integer)
    length5 = Column(Integer)
    weight5 = Column(Float)
    Top_len5 = Column(Integer)
    length6 = Column(Integer)
    weight6 = Column(Float)
    Top_len6 = Column(Integer)
    length7 = Column(Integer)
    weight7 = Column(Float)
    Top_len7 = Column(Integer)
    length8 = Column(Integer)
    weight8 = Column(Float)
    Top_len8 = Column(Integer)
    length9 = Column(Integer)
    weight9 = Column(Float)
    Top_len9 = Column(Integer)

    # リクエストフォームDB書き込み
    @staticmethod
    def get_or_create(data_list):
        session = database.connect_db()
        table_name = AddCut()
        row = bool(session.query(AddCut).filter(AddCut.id == data_list['addUpdateDate']).first())
        if row:
            data = session.query(AddCut).filter(AddCut.id == data_list['addUpdateDate']).first()
            for k, v in data_list.items():
                if k != 'addUpdateDate':
                    if str(getattr(data, k)) != v:
                        v = None if v == '' else v
                        setattr(data, k, v)
        else:
            for k, v in data_list.items():
                if v != '' and k != 'addUpdateDate':
                    setattr(table_name, k, v)
            session.add(table_name)
        session.commit()
        session.close()

    # DB_read
    @staticmethod
    def read_data():
        num = 50
        session = database.connect_db()
        c_list = AddCut.__table__.c.keys()
        dbdata = session.query(AddCut).order_by(AddCut.id.desc()).limit(num).all()
        data = []
        for target in dbdata:
            record = {}
            for column in c_list:
                record[column] = getattr(target, column)
                # if getattr(target, column) is not None:
                #     record[column] = getattr(target, column)
            data.append(record)
        session.close()
        return c_list, data

    # DB_read_one
    @staticmethod
    def read_data_one(lotid):
        session = database.connect_db()
        c_list = AddCut.__table__.c.keys()
        dbdata = session.query(AddCut).filter(AddCut.id == lotid).first()
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
