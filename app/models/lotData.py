import sqlite3

from sqlalchemy import Column, String, UniqueConstraint, Integer, Float, DateTime
from app.models.db import BaseDatabase, database
from datetime import datetime
import datetime


class LotData(BaseDatabase):
    __tablename__ = "lotData"
    processDay = Column(String)
    lotno = Column(String)
    UniqueConstraint(lotno)
    kind = Column(String)
    length = Column(Integer)
    weight = Column(Float)
    VADODTop = Column(Integer)
    processPlace = Column(String)
