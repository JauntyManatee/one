import json, os, hashlib, pymysql,sys
from flask import request
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, orm, MetaData, Table, Column, String, Integer, ForeignKey, Binary
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

class DB_Route:

  def __init__(self, app):

    # pw = ':hr33'
    # if(os.environ['runtime'] == 'local'):
    #   pw = ''
    db_url = os.environ['DB_URL']
    engine = create_engine(db_url, convert_unicode=True)
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
#        new_salt = os.urandom(16)
        new_salt = 'So Jaunty'
        print(type(new_salt), 'new_salt', new_salt)
        password = data_string['password']
        hash = hashlib.sha256()
        binary_new_salt = str.encode(new_salt)
        password = str.encode(password)
        password += binary_new_salt
        print(type(password), 'password after salt added before hashing.', password)
        hash.update(password)
        user_pass_hash = hash.hexdigest()
        print('user_pass_hash', user_pass_hash)
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
      if search_result:
        user_salt = str.encode(search_result[0].salt) #bytes 
        print(type(user_salt), 'user_salt', user_salt)
        user_password = search_result[0].password #string
        print(type(user_password), 'user_password', user_password)
        login_password = str.encode(data_string['password']) #bytes
        login_password += user_salt
        hash = hashlib.sha256(login_password)
        login_password = hash.hexdigest()
        print(type(login_password), 'login_password after hashing', login_password)
        print(type(login_password), type(user_password))

        if login_password == user_password:
          print('Logged in')
          return str.encode('Succesful login.')
        else:
          print('Incorrect username or pass.')
          return str.encode('Incorrect username or password.')
      else:
        print('User does not exist.')
        return str.encode('Incorrect username or password.')
  
  
  
