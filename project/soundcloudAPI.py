import flask, os, soundcloud, json
from flask import request, redirect
import collections

client = soundcloud.Client(
  client_id= os.environ['SOUNDCLOUD_API_KEY'],
  client_secret= os.environ['SOUNDCLOUD_API_SECRET'],
  redirect_uri= os.environ['REDIRECT_URI'] + '/soundAuth'
)
#'http://127.0.0.1:5000/soundAuth'
class Soundcloud:
  
  def __init__(self, app):

    self.SOUNDCLOUD_TOKEN = ''

    @app.route('/sound')
    def sound():
      return redirect(client.authorize_url())

    @app.route('/soundAuth')
    def soundAuth():
      code = request.args.get('code')
      access_token = client.exchange_token(code)
      print(access_token.access_token)
      self.SOUNDCLOUD_TOKEN = access_token.access_token
      print("Hi there, %s" % client.get('/me').username)
      return redirect(os.environ['REDIRECT_URI'] +'/#/feed')

    q = collections.deque()

    @app.route('/soundStream')
    def soundStream():
      #soon to access token from db based on user id
      client = soundcloud.Client(access_token=self.SOUNDCLOUD_TOKEN)
      if(not q):
        theGoods = client.get('/me/activities/tracks/affiliated')
  
        for good in theGoods.collection:
          q.append(good)

      l = []

      for n in range(2):
        try:
          l.append(q.popleft())
        except:
          pass

      moreData = False
      if(q):
        moreData = True
      return sendEmbed(l, moreData)
      
    def sendEmbed(links, moreData):
      embedList = []

      for good in links:
        embed_info = client.get('/oembed', url=good.origin.permalink_url)
        
        embedList.append({'embed': embed_info.html, 'time' : good.origin.created_at})
      data = json.dumps({'data': embedList,'is_more_data': moreData})
      return data
      








