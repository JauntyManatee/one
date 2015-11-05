import json, os, requests, hashlib, pymysql, sys, bcrypt, base64
from flask import request, session
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, orm, MetaData, Table, Column, String, Integer, ForeignKey
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

#Session
from base64 import b64encode
from os import urandom

class DB_Route:

  def __init__(self, app):

    # pw = ':hr33'
    # if(os.environ['runtime'] == 'local'):
    #   pw = ''
    db_url = os.environ['DB_URL']
    engine = create_engine(db_url, convert_unicode=True)
    Session = sessionmaker(bind=engine)
    self.session = Session()
    conn = engine.connect() 
    metadata = MetaData(engine)
    Base = declarative_base()
   # login_manager = LoginManager()

    class User(Base):
      __tablename__ = 'users'
      userID = Column(Integer, primary_key=True)
      username = Column(String(60))
      password = Column(String(300))
      salt = Column(String(60))
      authToken = Column(String(200))
      twitterToken = Column(String(200))
      twitterSecret = Column(String(200))
      instagramToken = Column(String(200))
      soundcloudToken = Column(String(200))
      redditToken = Column(String(200))

      def __repr__(self):
        return "<User(username='%s', password='%s', salt='%s', authToken='%s', twitterToken='%s', twitterSecret='%s', instagramToken='%s', soundcloudToken='%s', redditToken='%s')>" % (self.username, self.password, self.salt, self.authToken, self.twitterToken, self.twitterSecret, self.instagramToken, self.soundcloudToken, self.redditToken)

    self.User = User;
    self.User.__table__
    Table('users', MetaData(bind=None),
      Column('userID', Integer, primary_key=True, nullable=False),
      Column('username', String(60), nullable=False),
      Column('password', String(300), nullable=False),
      Column('salt', String(60), nullable=False),
      Column('authToken', String(60), nullable=False),
      Column('twitterToken', String(60), nullable=True),
      Column('twitterSecret', String(60), nullable=True),
      Column('instagramToken', String(60), nullable=True),
      Column('soundcloudToken', String(60), nullable=True),
      Column('redditToken', String(60), nullable=True), schema=None)

    Base.metadata.create_all(engine)

    #Sign Up
    @app.route('/signup', methods=['POST'])
    def signup():
      data_string = json.loads(request.data.decode('utf-8', 'strict').replace("'", "\""))
      username = data_string['username']
      search_result = self.session.query(self.User).filter_by(username=username).all()
      if search_result:
        return str.encode('User already exists.')
      else:
        bin_new_salt = bcrypt.gensalt(4)
        new_salt = bin_new_salt.decode('utf-8')
        password = data_string['password']
        auth_token = base64.b64encode(os.urandom(16)).decode('utf-8')
        password = str.encode(password)
        user_pass_hash = bcrypt.hashpw(password, bin_new_salt)
        newUser = self.User(username=username, password=user_pass_hash, salt=new_salt, authToken=auth_token)
        self.session.add(newUser)
        self.session.commit()
        session['id'] = auth_token
        response = json.dumps({'auth_token': auth_token})
        return response
  
    #Authenticate on login
    @app.route('/login', methods=['POST'])
    def authenticate():
      session.clear()
      data_string = json.loads(request.data.decode('utf-8', 'strict').replace("'", "\""))
      username = data_string['username']
      search_result = self.session.query(self.User).filter_by(username=username).all()
      if search_result:
        user_salt = str.encode(search_result[0].salt) 
        user_password = search_result[0].password 
        login_password = str.encode(data_string['password']) 
        bin_login_hash_pass = bcrypt.hashpw(login_password, user_salt)
        login_hash_pass = bin_login_hash_pass.decode('utf-8')

        if login_hash_pass == user_password:
          auth_token = base64.b64encode(os.urandom(16)).decode('utf-8')
          theUser = self.session.query(self.User).filter_by(username=username).first()
          theUser.authToken = auth_token
          self.session.commit()
          response = json.dumps({'auth_token': auth_token})
          session['id'] = auth_token
          print('Logged in')
          return response
        else:
          print('Incorrect username or pass.')
          return str.encode('Incorrect username or password.')
      else:
        print('User does not exist.')
        return str.encode('Incorrect username or password.')
  
    #Authenticate on logout
    @app.route('/logout', methods=['POST'])
    def logout():
      data_string = json.loads(request.data.decode('utf-8', 'strict').replace("'", "\""))
      theUser = self.session.query(self.User).filter_by(authToken=session['id']).first()
      theUser.authToken = ''
      session.pop('id', None)
      session.pop('igToken', None)
      session.pop('soundcloudToken', None)
      session.pop('twitterToken', None)
      session.pop('twitterSecret', None)
      self.session.commit()
      return str.encode('Logged out.')

