from flask import Flask, render_template, redirect, request
import oauth2 as oauth

#removed urlparse due to conflict w/py3, 
#http://askubuntu.com/questions/511650/cannot-install-python-module-urllib.parse
import webbrowser, flask, sys, os

import requests
import requests.auth
from auth import *
#added below for reddit
import urllib3
import urllib.parse
from uuid import uuid4
import threading
from functools import wraps
#added above for reddit

#added below for db
from db import *
import scrypt
import json

app = Flask(__name__)

@app.route('/')
def home():
  return render_template('index.html')

consumer_key = os.environ['TWITTER_API_KEY']
consumer_secret = os.environ['TWITTER_API_SECRET']

request_token_url = 'https://api.twitter.com/oauth/request_token'
access_token_url = 'https://api.twitter.com/oauth/access_token'
authorize_url = 'https://api.twitter.com/oauth/authorize'

# This Route will redirect user for Twitter Verification, then redirect when Authorized
@app.route('/activate')
def getTweets():
  global request_token
  global consumer
  consumer = oauth.Consumer(consumer_key, consumer_secret)
  client = oauth.Client(consumer)
  resp, content = client.request(request_token_url, "GET")
  if resp['status'] != '200':
    raise Exception("Invalid response %s." % resp['status'])

  request_token = dict(urllib.parse.parse_qsl(content))
  print("Request Token:")
  print("    - oauth_token        = %s" % request_token[b'oauth_token'].decode('utf-8'))
  print("    - oauth_token_secret = %s" % request_token[b'oauth_token_secret'].decode('utf-8')) 
  
  Rurl = "%s?oauth_token=%s" % (authorize_url, request_token[b'oauth_token'].decode('utf-8'))

  return redirect(Rurl)

#This will grab the oauth token and make a request to access_token_url to let Twitter know all is well
@app.route('/authorized')
def getToken():
  global access_token
  token = oauth.Token(request_token[b'oauth_token'].decode('utf-8'),
      request_token[b'oauth_token_secret'].decode('utf-8'))
  token.set_verifier(request.args.get('oauth_verifier'))
  client = oauth.Client(consumer, token)
  
  resp, content2 = client.request(access_token_url, "POST")
  access_token = dict(urllib.parse.parse_qsl(content2))
  print(access_token)
  return redirect('http://localhost:5000/#/feed')

# After Authorized...redirect to tweetsfeed which will make a call
# to grab the users TimeLine (from APIfactory)
@app.route('/tweetsfeed')
def theTweets():
  def oauth_req(url, key, secret, http_method="GET"):
    consumer = oauth.Consumer(key=consumer_key, secret=consumer_secret)
    token = oauth.Token(key=key, secret=secret)
    client = oauth.Client(consumer, token)
    resp, content = client.request( url, method=http_method)
    return content
     
  home_timeline = oauth_req( 'https://api.twitter.com/1.1/statuses/home_timeline.json', access_token[b'oauth_token'], access_token[b'oauth_token_secret'])
  return home_timeline


####################DATABASE#############################

#Sign Up
@app.route('/signup', methods=['POST'])
def signup():
  data_string = json.loads(request.data.decode('utf-8', 'strict').replace("'", "\""))
  username = data_string['username']
  search_result = session.query(User).filter_by(username=username).all()
 # if search_result[0].username == username:
  if search_result:
    print(search_result)
    return str.encode('User already exists.')
  else:
    new_salt = os.urandom(4)
    password = data_string['password']
    user_pass_hash = scrypt.encrypt(new_salt, password, maxtime=0.001)
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




####################REDDIT#############################

#need (imported above)
#import urllib.parse
#from uuid import uuid4
#import threading
#from functools import wraps
#from flask import request
#import requests

REDDIT_REDIRECT_URI = 'http://localhost:5000/redditLand'
REDDIT_STATE = str(uuid4())
REDDIT_USER_AGENT = 'Chrome-Python:ONE/1.0.1 by /u/huligan27'

@app.route('/redditAuth')
def redditAuth():
  params = {
    "client_id": os.environ['REDDIT_CLIENT_ID'],
    "response_type": "code",
    "state": REDDIT_STATE,
    "redirect_uri": REDDIT_REDIRECT_URI,
    "duration": "temporary",
    "scope": "identity"
  }
  url = "https://www.reddit.com/api/v1/authorize?" + urllib.parse.urlencode(params)
  return '<a href="%s">Authenticate with reddit</a>' % url

@app.route('/redditLand')
def redditLand():
  params = request.args
  REDDIT_CODE = params.get('code')
  REDDIT_TOKEN = get_token(REDDIT_CODE)
  return 'check your console for the token BRO!! \ncode: %s | token: %s' % (REDDIT_CODE, REDDIT_TOKEN)

@app.route('/reddit/me')
def redditMe():
  headers = {'Authorization': 'bearer 14565753-IY2dR-aOU0Ol2EweaqoQThsrhuk', 'User-Agent': REDDIT_USER_AGENT}
  response = requests.get('https://www.oauth.reddit.com/api/v1/me',headers=headers)
  return response.text

@app.route('/reddit/rss/<feed>')
def rssFeed(feed='hot'):
  response = requests.get('https://www.reddit.com/'+feed+'.json')
  return response.text

#similar to js setTimeout()
def delay(delay=0.):
  def wrap(f):
    @wraps(f)
    def delayed(*args, **kwargs):
      timer = threading.Timer(delay, f, args=args, kwargs=kwargs)
      timer.start()
    return delayed
  return wrap

#add @delay tag to delay arg seconds
@delay(1.0)
def get_token(code):
  headers = {'User-Agent' : 'Chrome-Python:ONE/1.0.1 by /u/huligan27'}
  post_data = {
    "grant_type" : "authorization_code",
    "code" : code,
    "redirect_uri" : REDDIT_REDIRECT_URI
  }
  response = requests.post('https://www.reddit.com/api/v1/access_token', 
    headers=headers, auth=(os.environ['REDDIT_CLIENT_ID'], os.environ['REDDIT_CLIENT_SECRET']), data=post_data)

  token_json = response.json();
  print(token_json)
  return token_json
