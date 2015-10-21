import os, requests, flask
from flask import request, redirect

class Instagram:

  def __init__(self, app):

    self.IG_REDIRECT_URI = 'http://127.0.0.1:5000/igLand'
    self.IG_USER_AGENT = 'Chrome-Python:ONE/1.0.1 by huligan27'
    self.IG_TOKEN = ''
    self.IG_USER = ''

    @app.route('/igAuth')
    def igAuth():
      link = 'https://api.instagram.com/oauth/authorize/?client_id=%s&redirect_uri=%s&response_type=code' % (os.environ['IG_CLIENT_ID'], self.IG_REDIRECT_URI)
      return redirect(link)

    @app.route('/igLand')
    def igLand():
      params = request.args
      CODE = params.get('code')
      token = getIGToken(CODE)
      return redirect('http://localhost:5000/#/feed')
      # return 'check your console for token bro!!!  <a href="http://127.0.0.1:5000/instagram/feed">get own feed</a>code: %s ' % CODE

    def getIGToken(code):
      headers = {'User-Agent' : self.IG_USER_AGENT}
      post_data = {
        "client_id": os.environ['IG_CLIENT_ID'],
        "client_secret": os.environ['IG_CLIENT_SECRET'],
        "grant_type" : "authorization_code",
        "code" : code,
        "redirect_uri" : self.IG_REDIRECT_URI
      }
      response = requests.post("https://api.instagram.com/oauth/access_token", 
        headers=headers, 
        auth=(os.environ['IG_CLIENT_ID'], os.environ['IG_CLIENT_SECRET']), 
        data=post_data)

      token_json = response.json();
      print('instagram token, @~38:instagram.py, remove in production',token_json)
      self.IG_TOKEN = token_json['access_token']
      self.IG_USER = token_json['user']


    @app.route('/instagram/feed')
    def getOwnFeed():
      url = 'https://api.instagram.com/v1/users/self/feed?access_token=%s' % self.IG_TOKEN
      response = requests.get(url)
      return response.text








