from flask import Flask, render_template, redirect
import oauth2 as oauth
import urlparse, webbrowser, flask, sys, os
from db import engine

app = Flask(__name__)      

@app.route('/')
def home():
  return render_template('index.html')

if __name__ == '__main__':
  app.run(debug=True)

#not sure if we need this anymore...
#@app.route('/<path:path>')
#def seeStaticFile(path):
#	return app.send_static_file(path);
from auth import *

consumer_key = TWITTER_API_KEY
consumer_secret = TWITTER_API_SECRET

request_token_url = 'https://api.twitter.com/oauth/request_token'
access_token_url = 'https://api.twitter.com/oauth/access_token'
authorize_url = 'https://api.twitter.com/oauth/authorize'

# This Route will redirect user for Twitter Verification, then redirect when Authorized
@app.route('/buttholez')
def getTweets():
  global request_token
  global consumer
  consumer = oauth.Consumer(consumer_key, consumer_secret)
  client = oauth.Client(consumer)
  resp, content = client.request(request_token_url, "GET")
  if resp['status'] != '200':
      raise Exception("Invalid response %s." % resp['status'])

  request_token = dict(urlparse.parse_qsl(content))
  
  print "Request Token:"
  print "    - oauth_token        = %s" % request_token['oauth_token']
  print "    - oauth_token_secret = %s" % request_token['oauth_token_secret']
  print 
  
  Rurl = "%s?oauth_token=%s" % (authorize_url, request_token['oauth_token'])

  return redirect(Rurl)

#This will grab the oauth token and make a request to access_token_url to let Twitter know all is well
@app.route('/authorized')
def getToken():
  global access_token
  print flask.request.args
  token = oauth.Token(request_token['oauth_token'],
      request_token['oauth_token_secret'])
  token.set_verifier(flask.request.args.get('oauth_verifier'))
  client = oauth.Client(consumer, token)

  resp, content2 = client.request(access_token_url, "POST")
  access_token = dict(urlparse.parse_qsl(content2))
  return redirect('http://localhost:5000/#/feed')

# After Authorized...redirect to tweetsfeed which will make a call
# to grab the users TimeLine (from APIfactory)
@app.route('/tweetsfeed')
def theTweets():
  def oauth_req(url, key, secret, http_method="GET", post_body="", http_headers=None):
      consumer = oauth.Consumer(key=consumer_key, secret=consumer_secret)
      token = oauth.Token(key=key, secret=secret)
      client = oauth.Client(consumer, token)
      resp, content = client.request( url, method=http_method, body=post_body, headers=http_headers )
      return content
   
  home_timeline = oauth_req( 'https://api.twitter.com/1.1/statuses/home_timeline.json', access_token['oauth_token'], access_token['oauth_token_secret'])
  return home_timeline
