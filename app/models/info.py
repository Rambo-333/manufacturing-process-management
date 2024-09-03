from sqlalchemy import Column, String, UniqueConstraint,Integer,Float,DateTime

from app.models.db import BaseDatabase


class Cutnew(BaseDatabase):
    __tablename__ = "info"
    process = Column(String)
    processday = Column(DateTime)
    lotno = Column(String)
    UniqueConstraint(lotno)
    kind = Column(String)
    man = Column(String)
    length = Column(Integer)
    weight = Column(Float)
    uplen = Column(Integer)
    btmlen = Column(Integer)