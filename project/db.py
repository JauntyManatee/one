from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import pymysql
from sqlalchemy import MetaData, Table, Column, String, Integer, ForeignKey
from sqlalchemy import create_engine, orm
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='hr33', db='one_db')
print(conn)
"""
engine = create_engine('mysql+pymsql://127.0.0.1:3306/one_db', convert_unicode=True)
Session = sessionmaker(bind=engine)
session = Session()
conn = engine.connect() 
metadata = MetaData(engine)
Base = declarative_base()

class User(Base):
  __tablename__ = 'users'
  userID = Column(Integer, primary_key=True)
  username = Column(String(60))
  password = Column(String(300))
  salt = Column(String(60))

  def __repr__(self):
    return "<User(username='%s', password='%s', salt='%s')>" % (self.username, self.password, self.salt)


User.__table__
Table('users', MetaData(bind=None),
    Column('userID', Integer, primary_key=True, nullable=False),
    Column('username', String(60), nullable=False),
    Column('password', String(300), nullable=False),
    Column('salt', String(60), nullable=False), schema=None)

Base.metadata.create_all(engine)
"""

