import os, requests, flask, json
from flask import request, redirect
from util import Asyncifyer, Promise
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
    qurl = collections.deque()
    qmbd = collections.deque()

    def embedLoader(link):
    
      self.embedsLeft += 1
      response = requests.get('http://api.instagram.com/oembed?url=' + link['link'])

      try:
        embedObj = response.json()['html']
        qmbd.append({'embed': embedObj, 'time': int(link['caption']['created_time']) })
        print('appended to qmbd')
      except:
        try:
          print(response.url)
        except:
          print('error')
    
      

    @app.route('/instagram/feed')
    def getOwnFeed():
      

      #Check if queue is empty and make request for data if it is.
      if(self.embedsLeft == 0):
        url = 'https://api.instagram.com/v1/users/self/feed?access_token=%s' % self.IG_TOKEN
        response = requests.get(url)
        resJSON = (response.json)()['data']

        for post in resJSON:
          qurl.append(post)
          # self.embedsLeft += 1
          print('append to qurl')

      #ask for embeds
        
        for link in qurl:  
          Thread(target=embedLoader, args=[link]).start()


      #Flag to tell client whethere qurlueue has more data to send..

      shortList = []
      while(qmbd):
        shortList.append(qmbd.popleft())
        self.embedsLeft-=1

      moreData = False
      if(self.embedsLeft > 3):
        moreData = True

      return json.dumps({'data': shortList, 'is_more_data': moreData})








