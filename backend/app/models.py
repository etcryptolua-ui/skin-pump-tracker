from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class Skin(Base):
    __tablename__ = 'skins'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Snapshot(Base):
    __tablename__ = 'snapshots'
    id = Column(Integer, primary_key=True)
    skin_name = Column(String, index=True)
    price = Column(Float)
    stock = Column(Integer)
    meta = Column(JSON)
    ts = Column(DateTime, default=datetime.datetime.utcnow)

class Alert(Base):
    __tablename__ = 'alerts'
    id = Column(Integer, primary_key=True)
    skin_name = Column(String, index=True)
    level = Column(String)
    message = Column(String)
    ts = Column(DateTime, default=datetime.datetime.utcnow)
