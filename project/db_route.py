import json, os, hashlib, pymysql,sys
from flask import request
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, orm, MetaData, Table, Column, String, Integer, ForeignKey
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

try:
  runtime = sys.argv[1]
except:
  runtime = 'deploy'

class DB_Route:

  def __init__(self, app):

    pw = ':hr33'
    if(runtime == 'local'):
      pw = ''

    engine = create_engine('mysql+pymysql://root%s@127.0.0.1:3306/one_db' % pw, convert_unicode=True)
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
      username = data_string['username']
      search_result = session.query(User).filter_by(username=username).all()
      if search_result:
        return str.encode('User already exists.')
      else:
        new_salt = os.urandom(16)
        password = data_string['password']
        hash = hashlib.sha224()
        password = str.encode(password)
        password += new_salt
        hash.update(password)
        user_pass_hash = hash.digest()
        newUser = User(username=username, password=user_pass_hash, salt=new_salt)
        session.add(newUser)
        session.commit()
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
        user_password = search_result[0].password
        password = data_string['password']
        user_pass_hash = scrypt.encrypt(user_salt, user_password, maxtime=0.001)
        if search_result:
          return str.encode('Succesful login.')
        else:
          return str.encode('Incorrect login.')
      else:
        print('User does not exist.')
        return str.encode(username + ' user does not exist. Please create a user account.')
  
  
  
