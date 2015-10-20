import os, urllib.parse, requests, flask

from uuid import uuid4
from flask import request

class Reddit:
  
  def __init__(self, app):
    
    self.REDDIT_REDIRECT_URI = 'http://localhost:5000/redditLand'
    self.REDDIT_STATE = str(uuid4())
    self.REDDIT_USER_AGENT = 'Chrome-Python:ONE/1.0.1 by /u/huligan27'
    self.REDDIT_TOKEN = ''
<<<<<<< 5dd130a2cc50b0bc9d06d8128eb59d941a797b3e
=======
    self.app = app
>>>>>>> abstracted reddit out of server

    #initial auth route, sends user to reddit auth, we also send our server params
    @app.route('/redditAuth')
    def redditAuth():
      params = {
        "client_id": os.environ['REDDIT_CLIENT_ID'],
        "response_type": "code",
        "state": self.REDDIT_STATE,
        "redirect_uri": self.REDDIT_REDIRECT_URI,
        "duration": "temporary",
        "scope": "identity"
      }
      url = "https://www.reddit.com/api/v1/authorize?" + urllib.parse.urlencode(params)
      return '<a href="%s">Authenticate with reddit</a>' % url

    #reddit landing, after auth above, user redirected here
    #code is provided which allows us to grab user token using 'get_token'
    @app.route('/redditLand')
    def redditLand():
      params = request.args
      REDDIT_CODE = params.get('code')
      token = get_token(REDDIT_CODE)
      return 'check your console for the token BRO!! \ncode: %s' % (REDDIT_CODE)

    #used in reddit landing once code received to request a bearer token on user behalf
    #here token is assigned to self.REDDIT_TOKEN for later use in code
    def get_token(code):
      headers = {'User-Agent' : 'Chrome-Python:ONE/1.0.1 by /u/huligan27'}
      post_data = {
        "grant_type" : "authorization_code",
        "code" : code,
        "redirect_uri" : self.REDDIT_REDIRECT_URI
      }
      response = requests.post('https://www.reddit.com/api/v1/access_token', 
        headers=headers, auth=(os.environ['REDDIT_CLIENT_ID'], os.environ['REDDIT_CLIENT_SECRET']), data=post_data)

      token_json = response.json();
      self.REDDIT_TOKEN = token_json['access_token']
<<<<<<< 5dd130a2cc50b0bc9d06d8128eb59d941a797b3e
      print('reddit token, @~52:reddit.py, remove in production',token_json) 
=======
      print('reddit token:@~53,reddit.py',token_json) 
>>>>>>> abstracted reddit out of server
      return token_json

    #take a look at current token
    @app.route('/reddit/token')
    def printToken():
      return self.REDDIT_TOKEN

    #no auth required, can grab rss without auth
    #feeds include hot (main feed), confidence, top, new, controversial, old, random, qa
    @app.route('/reddit/rss/<feed>')
    def rssFeed(feed='hot'):
      response = requests.get('https://www.reddit.com/' + feed + '.json')
      return response.text

    #Grab user preferences, note error thrown if no token available
    @app.route('/reddit/me')
    def redditMe():
      headers = {"Authorization": "bearer " + self.REDDIT_TOKEN, "User-Agent": self.REDDIT_USER_AGENT}
      response = requests.get("https://oauth.reddit.com/api/v1/me", headers=headers)
      return response.text

    #path include 'prefs, trophies', note error thrown if no token available
    @app.route('/reddit/me/<path>')
    def redditMeExtras(path=''):
      headers = {"Authorization": "bearer 14565753-zWTUe_uzkCeRRMkW4tP56kkvG78", "User-Agent": self.REDDIT_USER_AGENT}
      response = requests.get("https://oauth.reddit.com/api/v1/me/"+path, headers=headers)
      return response.text
    



