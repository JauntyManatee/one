import os, requests, flask, json
from flask import request, redirect
import collections

class Instagram:

  def __init__(self, app):

    self.IG_REDIRECT_URI = os.environ['REDIRECT_URI'] + '/igLand'
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
    q = collections.deque()

    @app.route('/instagram/feed')
    def getOwnFeed():
      url = 'https://api.instagram.com/v1/users/self/feed?access_token=%s' % self.IG_TOKEN

      #Check if queue is empty and make request for data if it is.
      if(not q):
        response = requests.get(url)
        resJSON = (response.json)()['data']

        for post in resJSON:
          q.append(post)

      shortList = []

      #Appends 2 items from queue to shortlist to send to client.
      for n in range(2):
        try:
          shortList.append(q.popleft())
        except:
          pass

      #Flag to tell client whethere queue has more data to send..
      moreData = False
      if(q):
        moreData = True
      return sendEmbed(shortList, moreData)

    #Util function to grab embeds from Instagram. Used to return posts to client.
    def sendEmbed(shortList, moreData):
      embedList = []

      for link in shortList:
        try:
          embedUrl = 'http://api.instagram.com/oembed?url=' + link['link']
          resp = requests.get(embedUrl)
          embedObj = json.loads(resp.text)
          embedList.append({'embed': embedObj['html'], 'time': int(link['caption']['created_time']) })
        except:
          print('error but continue plz')
      data = json.dumps({'data': embedList, 'is_more_data': moreData})
      return data










