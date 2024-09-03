import sqlite3

from sqlalchemy import Column, String, UniqueConstraint, Integer, Float, DateTime
from app.models.db import BaseDatabase, database
from datetime import datetime
import datetime


class SP(BaseDatabase):
    __tablename__ = "sp"
    lotno = Column(String)
    kind = Column(String)
    manSet = Column(String)
    processDaySet = Column(String)
    length = Column(Integer)
    spNo = Column(Integer)
    pgNo = Column(String)
    time = Column(Integer)
    ODave = Column(Float)
    ODmin = Column(Float)
    pos = Column(String)
    face = Column(String)
    memo = Column(String)
    manRe = Column(String)
    processDayRe = Column(String)
    startX = Column(Float)
    maxValue = Column(Float)
    minValue = Column(Float)
    short = Column(Float)
    collection = Column(Float)
    MMs = Column(Float)
    number = Column(Integer)
    ground1 = Column(Float)
    coordinate1 = Column(Float)
    od1 = Column(Float)
    ground2 = Column(Float)
    coordinate2 = Column(Float)
    od2 = Column(Float)
    ground3 = Column(Float)
    coordinate3 = Column(Float)
    od3 = Column(Float)
    ground4 = Column(Float)
    coordinate4 = Column(Float)
    od4 = Column(Float)
    ground5 = Column(Float)
    coordinate5 = Column(Float)
    od5 = Column(Float)
    ground6 = Column(Float)
    coordinate6 = Column(Float)
    od6 = Column(Float)
    ground7 = Column(Float)
    coordinate7 = Column(Float)
    od7 = Column(Float)
    ground8 = Column(Float)
    coordinate8 = Column(Float)
    od8 = Column(Float)
    ground9 = Column(Float)
    coordinate9 = Column(Float)
    od9 = Column(Float)
    ground10 = Column(Float)
    coordinate10 = Column(Float)
    od10 = Column(Float)

    # リクエストフォームDB書き込み
    @staticmethod
    def get_or_create(data_list):
        session = database.connect_db()
        table_name = SP()
        del_id = ''
        for k, v in data_list.items():
            if k == "spNo":
                del_id = v
            v = None if v == '' else v
            setattr(table_name, k, v)
        # 一時保存データをクリア
        data = session.query(SP).filter(SP.id == del_id).first()
        for k, v in data_list.items():
            v = None
            setattr(data, k, v)
        session.add(table_name)
        session.commit()
        session.close()

    # tempdataDB書き込み
    @staticmethod
    def temp_data(sp_no, temp_data):
        session = database.connect_db()
        table_name = SP()
        data = session.query(SP).filter(SP.id == sp_no).first()
        for k, v in temp_data.items():
            if str(getattr(data, k)) != v:
                v = None if v == '' else v
                setattr(data, k, v)
        session.commit()
        session.close()

    # DB_read
    @staticmethod
    def read_data():
        num = 50
        session = database.connect_db()
        c_list = SP.__table__.c.keys()
        db_data = session.query(SP).order_by(SP.id.desc()).limit(num).all()
        data = []
        for target in db_data:
            record = {}
            for column in c_list:
                if getattr(target, column) is not None:
                    record[column] = getattr(target, column)
            data.append(record)
        session.close()
        return c_list, data

    # DB_read(temp)
    @staticmethod
    def temp_read_data(sp_no):
        session = database.connect_db()
        c_list = SP.__table__.c.keys()
        db_data = session.query(SP).filter(SP.id == sp_no).first()
        data = []
        for column in c_list:
            data.append(getattr(db_data, column))
        session.close()
        return c_list, data

    # DB_read(one)
    @staticmethod
    def read_data_one(id_no):
        session = database.connect_db()
        c_list = SP.__table__.c.keys()
        db_data = session.query(SP).filter(SP.id == id_no).first()
        data1 = []
        data2 = []
        for column in c_list:
            if "coordinate" in column and getattr(db_data, column) is None:
                break
            elif "coordinate" in column:
                data1.append(getattr(db_data, column))
            elif "od" in column:
                data2.append(getattr(db_data, column))
        session.close()
        return data1, data2
