import json, os, hashlib, pymysql
from db_route import *
from flask import request
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, orm, MetaData, Table, Column, String, Integer, ForeignKey
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

class DB_Route:

  def __init__(self, app):
     
    engine = create_engine('mysql+pymysql://root:hr33@127.0.0.1:3306/one_db', convert_unicode=True)
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


    #Sign Up
    @app.route('/signup', methods=['POST'])
    def signup():
      data_string = json.loads(request.data.decode('utf-8', 'strict').replace("'", "\""))
      print('this is dat_str',data_string)
      username = data_string['username']
      print(username)
      search_result = session.query(User).filter_by(username=username).all()
      print(search_result)
     # if search_result[0].username == username:
      if search_result:
        print('SO JAUNTY')
        print(search_result)
        return str.encode('User already exists.')
      else:
        print('A little JAUNTY')
        new_salt = os.urandom(16)
        print('new_salt', new_salt, type(new_salt))
        password = data_string['password']
        print('password', password, type(password))
        #NEED TO ADD ENCRYPTION HERE
        hash = hashlib.sha224()
        print(hash, 'hash before update')
        password = str.encode(password)
        password += new_salt
        hash.update(password)
        print(hash, 'hash AFTER  update')
        user_pass_hash = hash.digest()
        print('user_pass_hash', user_pass_hash)
        newUser = User(username=username, password=user_pass_hash, salt=new_salt)
        print('newUser', newUser)
        session.add(newUser)
        session.commit()
        print('SO JAUNTY FO REALZZZ')
        return str.encode('User added.')
  
    #Authenticate on login
    @app.route('/login', methods=['POST'])
    def authenticate():
      data_string = json.loads(request.data.decode('utf-8', 'strict').replace("'", "\""))
      username = data_string['username']
      search_result = session.query(User).filter_by(username=username).all()
       # if search_result[0].username == username:
      if search_result:
        user_salt = search_result[0].salt   
        print(type(user_salt))
        user_password = search_result[0].password
        print(type(user_password))
        password = data_string['password']
        print(type(password))
        user_pass_hash = scrypt.encrypt(user_salt, user_password, maxtime=0.001)
        if search_result:
          print(user_password)
          print(scrypt.decrypt(user_password, password, maxtime=.001) == password)
          return str.encode('Succesful login.')
        else:
          return str.encode('Incorrect login.')
      else:
        print('User does not exist.')
        return str.encode(username + ' user does not exist. Please create a user account.')
  
  
  
