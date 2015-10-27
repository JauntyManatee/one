import os, urllib.parse, requests, flask, json
import oauth2 as oauth
from flask import request, redirect

class Twitter:

  def __init__(self, app):

    self.CONSUMER = ''
    self.ACCESS_TOKEN = ''
    self.REQUEST_TOKEN = ''
    consumer_key = os.environ['TWITTER_API_KEY']
    consumer_secret = os.environ['TWITTER_API_SECRET']

    request_token_url = 'https://api.twitter.com/oauth/request_token'
    access_token_url = 'https://api.twitter.com/oauth/access_token'
    authorize_url = 'https://api.twitter.com/oauth/authorize'

    def oauth_req(url, key, secret, http_method):
      token = oauth.Token(key=key, secret=secret)
      client = oauth.Client(self.CONSUMER, token)
      resp, content = client.request( url, method=http_method)
      return content
    # This Route will redirect user for Twitter Verification, then redirect when Authorized
    @app.route('/activate')
    def getTweets():
      self.CONSUMER = oauth.Consumer(consumer_key, consumer_secret)
      client = oauth.Client(self.CONSUMER)
      resp, content = client.request(request_token_url, "GET")
      if resp['status'] != '200':
        raise Exception("Invalid response %s." % resp['status'])
      print(request.args)
      self.SESSION_TOKEN = request.args['sessionToken']
      self.REQUEST_TOKEN = dict(urllib.parse.parse_qsl(content))
      Rurl = "%s?oauth_token=%s" % (authorize_url, self.REQUEST_TOKEN[b'oauth_token'].decode('utf-8'))
#     response = flask.make_response(flask.render_template('index.html', foo=42))
#     response = werkzeug.wrappers.Response()
#     response.mimetype = 'none'
#     response.headers['Content-Type'] = "application/json"
#     response.headers['Access-Control-Allow-Origin'] = '*'
#     response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
#     response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE'
#     print(type(response), response)
#     return redirect(Rurl, code=302, Response=response)
      return redirect(Rurl)

    #This will grab the oauth token and make a request to access_token_url to let Twitter know all is well
    @app.route('/authorized')
    def getToken():
      token = oauth.Token(self.REQUEST_TOKEN[b'oauth_token'].decode('utf-8'),
          self.REQUEST_TOKEN[b'oauth_token_secret'].decode('utf-8'))
      token.set_verifier(request.args.get('oauth_verifier'))
      client = oauth.Client(self.CONSUMER, token)
      resp, content2 = client.request(access_token_url, "POST")
      self.ACCESS_TOKEN = dict(urllib.parse.parse_qsl(content2))
      print(self.ACCESS_TOKEN)
      session.query(User).filter_by(authToken=self.SESSION_TOKEN).update({User.twitterToken: self.ACCESS_TOKEN})
#      return redirect(os.environ['REDIRECT_URI']+'/#/feed')
      return str.encode('Authorized.')

    # After Authorized...redirect to tweetsfeed which will make a call
    # to grab the users TimeLine (from APIfactory)
    @app.route('/tweetsfeed')
    def theTweets():      
      home_timeline = oauth_req( 'https://api.twitter.com/1.1/statuses/home_timeline.json', self.ACCESS_TOKEN[b'oauth_token'], self.ACCESS_TOKEN[b'oauth_token_secret'], 'GET')
      return home_timeline

    @app.route('/favtweet', methods=['GET','POST'])
    def favTweet():
      request_data = json.loads(request.data.decode('utf-8'))
      tweet_id = str(request_data['id'])
      fav_url = 'https://api.twitter.com/1.1/favorites/create.json?id=' + tweet_id       
      return oauth_req( fav_url, self.ACCESS_TOKEN[b'oauth_token'], self.ACCESS_TOKEN[b'oauth_token_secret'], 'POST')

    @app.route('/retweet', methods=['GET','POST'])
    def reTweet():
      request_data = json.loads(request.data.decode('utf-8'))
      tweet_id = str(request_data['id'])
      fav_url = 'https://api.twitter.com/1.1/statuses/retweet/' + tweet_id + '.json'        
      return oauth_req( fav_url, self.ACCESS_TOKEN[b'oauth_token'], self.ACCESS_TOKEN[b'oauth_token_secret'], 'POST')


