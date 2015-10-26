import os, requests, flask, json
from flask import request, redirect

import time
import collections
from threading import Thread

class Instagram:


  def __init__(self, app):

    self.IG_REDIRECT_URI = os.environ['REDIRECT_URI'] + '/igLand'
    self.IG_USER_AGENT = 'Chrome-Python:ONE/1.0.1 by huligan27'
    self.IG_TOKEN = ''
    self.IG_USER = ''
    self.embedsLeft = 0




   
    @app.route('/igAuth')
    def igAuth():
      link = 'https://api.instagram.com/oauth/authorize/?client_id=%s&redirect_uri=%s&response_type=code' % (os.environ['IG_CLIENT_ID'], self.IG_REDIRECT_URI)
      return redirect(link)

    @app.route('/igLand')
    def igLand():
      params = request.args
      CODE = params.get('code')
      token = getIGToken(CODE)
      return redirect(os.environ['REDIRECT_URI']+'/#/feed')
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

    


    #Holds queued items to be sent to client

    # qurl = collections.deque()
    qmbd = collections.deque()


  
    def embedLoader(link):
      response = requests.get('http://api.instagram.com/oembed?url=' + link['link'])
      try:
        embed_obj = response.json()['html']
        qmbd.append({'embed': embed_obj, 'time': int(link['caption']['created_time']) })
      except:
        'error'
      

    @app.route('/instagram/feed')
    def getOwnFeed():
      
      url = 'https://api.instagram.com/v1/users/self/feed?access_token=%s' % self.IG_TOKEN
      
      if(self.embedsLeft == 0):

        response = requests.get(url)
        try:
          for link in response.json()['data']:
            Thread(target=embedLoader, args=[link]).start()
            self.embedsLeft += 1
        except:
          pass

      shortList = []


      if(self.embedsLeft > 3):
        while(qmbd):
          try:
            shortList.append(qmbd.popleft())
            self.embedsLeft-=1
          except:
            print('nothin in qmbd yet')

      moreData = False
      if(self.embedsLeft > 3):
        moreData = True

      if(self.embedsLeft <= 3):
        self.embedsLeft = 0


      return json.dumps({'data': shortList, 'is_more_data': moreData})








