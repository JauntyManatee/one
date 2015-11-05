# /instagram/ownGallery: pulls data on all of your own gallery posts
# /instagram/stats: pulls your profile data & your followers/following numbers
# /instagram/feed: grabs your own feed and returns embeds
# /igAuth ig auth route
# /igLand is ig landing page

import os, requests, flask, json
from flask import request, redirect, session

import collections
from threading import Thread

class Instagram:

  def __init__(self, app, db):
    self.db = db
    self.IG_REDIRECT_URI = os.environ['REDIRECT_URI'] + '/igLand'
    self.IG_USER_AGENT = 'Chrome-Python:ONE/1.0.1 by huligan27'
    # self.IG_TOKEN = ''
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
      if(session['id']):
        getIGToken(CODE)
      return redirect(os.environ['REDIRECT_URI']+'/#/feed')
      
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
      if(session['id']):
        user = self.db.session.query(self.db.User).filter_by(authToken=session['id']).first()
        # if(user.instagramToken):
        #   return redirect(os.environ['REDIRECT_URI']+'/#/feed') 
        user.instagramToken = token_json['access_token']
        db.session.commit()
        session['igToken'] = token_json['access_token']
        # self.IG_TOKEN = token_json['access_token']
        # self.IG_USER = token_json['user']
      else:
        return redirect(os.environ['REDIRECT_URI']+'/#/')

    # hold embed objects
    qmbd = collections.deque()

    # method to be used asynchronously 
    # grabs embeds from instagram and appends them to our qmbd
    def embedLoader(link):
      response = requests.get('http://api.instagram.com/oembed?url=' + link['link'])
      try:
        embed_obj = response.json()['html']
        qmbd.append({'embed': embed_obj, 'time': int(link['caption']['created_time']) })
        #sometimes we get a 404 response, not sure why, below to account for it
      except:
        self.embedsLeft -= 1
        pass

    @app.route('/instagram/stats')
    def getSelfStats():
      if(session['id']):
        if('igToken' not in session):
          user = self.db.session.query(self.db.User).filter_by(authToken=session['id']).first()
          session['igToken'] = user.instagramToken
        try:
          url = 'https://api.instagram.com/v1/users/self?access_token=%s' % session['igToken']
          response = requests.get(url)
          return json.dumps(response.json()['data'])
        except:
          return json.dumps({})
    
    @app.route('/instagram/ownGallery')
    def getOwnStats():
      if(session['id']):
        url = 'https://api.instagram.com/v1/users/self/media/recent?access_token=%s' % session['igToken']
        response = requests.get(url)
        return json.dumps(response.json()['data'])

    @app.route('/instagram/feed')
    def getOwnFeed():
      if(session['id']):
        if('igToken' not in session):
          user = self.db.session.query(self.db.User).filter_by(authToken=session['id']).first()
          session['igToken'] = user.instagramToken

        url = 'https://api.instagram.com/v1/users/self/feed?count=10&access_token=%s' % session['igToken']
        
        #if data q for client empty, we want to replenish it
        if(self.embedsLeft == 0):

          response = requests.get(url)
          try:
            for link in response.json()['data']:
              Thread(target=embedLoader, args=[link]).start()
              self.embedsLeft += 1
          except:
            print('error grabbing urls')

        #list to be populated to send to client from qmbd
        shortList = []
       
        if(self.embedsLeft > 0):
          while(qmbd):
            try:
              shortList.append(qmbd.popleft())
              self.embedsLeft-=1
            except:
              print('nothin in qmbd yet')

        moreData = False
        #originally this was set to >3 to account for 404s, working with the below comment block
        if(self.embedsLeft > 0):
          moreData = True
        
        # potential fix for buggy 404s, added a self.embeds-=1 to the except block
        # in embedloader and it seems to fix the problem 
        # if(self.embedsLeft <= 3):
        #   self.embedsLeft = 0
        return json.dumps({'data': shortList, 'is_more_data': moreData})








