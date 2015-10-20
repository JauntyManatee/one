import os, urllib.parse, requests, flask
import oauth2 as oauth

from flask import request, redirect

class Twitter:

  def __init__(self, app):

    consumer_key = os.environ['TWITTER_API_KEY']
    consumer_secret = os.environ['TWITTER_API_SECRET']

    request_token_url = 'https://api.twitter.com/oauth/request_token'
    access_token_url = 'https://api.twitter.com/oauth/access_token'
    authorize_url = 'https://api.twitter.com/oauth/authorize'

    def oauth_req(url, key, secret, http_method):
      consumer = oauth.Consumer(key=consumer_key, secret=consumer_secret)
      token = oauth.Token(key=key, secret=secret)
      client = oauth.Client(consumer, token)
      resp, content = client.request( url, method=http_method)
      return content
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
      return redirect('http://localhost:5000/#/feed')

    # After Authorized...redirect to tweetsfeed which will make a call
    # to grab the users TimeLine (from APIfactory)
    @app.route('/tweetsfeed')
    def theTweets():         
      home_timeline = oauth_req( 'https://api.twitter.com/1.1/statuses/home_timeline.json', access_token[b'oauth_token'], access_token[b'oauth_token_secret'], 'GET')
      return home_timeline

    @app.route('/favtweet', methods=['GET','POST'])
    def favTweet():
      request_data = json.loads(request.data.decode('utf-8'))
      tweet_id = str(request_data['id'])
      fav_url = 'https://api.twitter.com/1.1/favorites/create.json?id=' + tweet_id       
      return oauth_req( fav_url, access_token[b'oauth_token'], access_token[b'oauth_token_secret'], 'POST')

    @app.route('/retweet', methods=['GET','POST'])
    def reTweet():
      request_data = json.loads(request.data.decode('utf-8'))
      tweet_id = str(request_data['id'])
      fav_url = 'https://api.twitter.com/1.1/statuses/retweet/' + tweet_id + '.json'        
      return oauth_req( fav_url, access_token[b'oauth_token'], access_token[b'oauth_token_secret'], 'POST')


