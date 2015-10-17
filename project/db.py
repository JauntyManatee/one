from flask import Flask
import psycopg2
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Table, Column, String, Integer, ForeignKey
from sqlalchemy import create_engine
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

conn.execute(users.insert(), [
  {"username": "code", "emailAddress":"code@code.com", "password":"code&beats", "token": "code"}
])

from sqlalchemy.sql import select
s = select([users])
result = s.execute()
print(result)

for row in result:
 print row
