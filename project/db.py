from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
##from flask.ext.heroku import Heroku #Probably for deployment.
from sqlalchemy import MetaData, Table, Column, String, Integer, ForeignKey
#from sqlalchemy.orm import relationship, backref
#from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
app = Flask(__name__, static_folder='../client')      
#heroku = Heroku(app) #for deployment
#engine = create_engine('postgresql://test:test@localhost:5432/postgres')
engine = create_engine('postgresql://localhost:5432/one_db')
conn = engine.connect() 
metadata = MetaData(engine)

users = Table('users', metadata,
    Column('userID', Integer, primary_key=True),
    Column('username', String(16), nullable=False),
    Column('emailAddress', String(60), nullable=False),
    Column('password', String(20), nullable=False),
    Column('token', String(16), nullable=False)
)

#sites = Table('sites', metadata,
#    Column('site_id', Integer, primary_key=True),
#    Column('user_id', None, ForeignKey('users.user_id')),
#    Column('site_name', String(16), nullable=False),
#    Column('token', String(16), nullable=False),
#    Column('password', String(20), nullable=False)
#)

metadata.create_all()

#conn.execute(users.insert(), [
#  {"username": "nvora", "emailAddress":"j@hooplife.com", "password":"madj", "token": "code"},
#  {"username": "code", "emailAddress":"code@code.com", "password":"code&beats", "token": "code"}
#])
#
#from sqlalchemy.sql import select
#s = select([users])
#result = s.execute()
#print(result)
#
#for row in result:
# print row
