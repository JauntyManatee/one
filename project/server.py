from flask import Flask, render_template, redirect, request
import oauth2 as oauth
#removed urlparse due to conflict w/py3, 
#http://askubuntu.com/questions/511650/cannot-install-python-module-urlparse
import webbrowser, flask, sys, os, json
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
# from db import engine


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


@app.route('/favtweet', methods=['GET','POST'])
def favTweet():
  request_data = json.loads(request.data.decode('utf-8'))
  tweet_id = str(request_data['id'])
  fav_url = 'https://api.twitter.com/1.1/favorites/create.json?id=' + tweet_id
  
  def oauth_req(url, key, secret, http_method="POST"):
      consumer = oauth.Consumer(key=consumer_key, secret=consumer_secret)
      token = oauth.Token(key=key, secret=secret)
      client = oauth.Client(consumer, token)
      resp, content = client.request( url, method=http_method)
      return content
   
  return oauth_req( fav_url, access_token[b'oauth_token'], access_token[b'oauth_token_secret'])

@app.route('/retweet', methods=['GET','POST'])
def reTweet():
  request_data = json.loads(request.data.decode('utf-8'))
  tweet_id = str(request_data['id'])
  fav_url = 'https://api.twitter.com/1.1/statuses/retweet/' + tweet_id + '.json' 
  
  def oauth_req(url, key, secret, http_method="POST"):
      consumer = oauth.Consumer(key=consumer_key, secret=consumer_secret)
      token = oauth.Token(key=key, secret=secret)
      client = oauth.Client(consumer, token)
      resp, content = client.request( url, method=http_method)
      return content
   
  return oauth_req( fav_url, access_token[b'oauth_token'], access_token[b'oauth_token_secret'])




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
  token = get_token(REDDIT_CODE)
  return 'check your console for the token BRO!! \ncode: %s' % (REDDIT_CODE)

@app.route('/reddit/token')
def printToken():
  return REDDIT_TOKEN

#pulls JSON object of feed your choice
#paths inclue hot(homefeed),confidence, top, new, controversial, old, random, qa, blank
@app.route('/reddit/rss/<feed>')
def rssFeed(feed='hot'):
  response = requests.get('https://www.reddit.com/' + feed + '.json')
  return response.text

#Grab user preferences
@app.route('/reddit/me')
def redditMe():
  headers = {"Authorization": "bearer 14565753-zWTUe_uzkCeRRMkW4tP56kkvG78", "User-Agent": REDDIT_USER_AGENT}
  response = requests.get("https://oauth.reddit.com/api/v1/me", headers=headers)
  return response.text

#path include 'prefs, trophies'
@app.route('/reddit/me/<path>')
def redditMeExtras(path=''):
  headers = {"Authorization": "bearer 14565753-zWTUe_uzkCeRRMkW4tP56kkvG78", "User-Agent": REDDIT_USER_AGENT}
  response = requests.get("https://oauth.reddit.com/api/v1/me/"+path, headers=headers)
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
  global REDDIT_TOKEN
  headers = {'User-Agent' : 'Chrome-Python:ONE/1.0.1 by /u/huligan27'}
  post_data = {
    "grant_type" : "authorization_code",
    "code" : code,
    "redirect_uri" : REDDIT_REDIRECT_URI
  }
  response = requests.post('https://www.reddit.com/api/v1/access_token', 
    headers=headers, auth=(os.environ['REDDIT_CLIENT_ID'], os.environ['REDDIT_CLIENT_SECRET']), data=post_data)

  token_json = response.json();
  REDDIT_TOKEN = token_json['access_token']
  print(token_json)
  return token_json


