import flask, os, soundcloud, json
from flask import request, redirect
import collections
from threading import Thread

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

    qmbd = collections.deque()
    self.embedsLeft = 0

    def embedLoader(link):
      response = client.get('/oembed', url=link.origin.permalink_url)
      qmbd.append({'embed': response.html, 'time' : link.origin.created_at})

    @app.route('/soundStream')
    def soundStream():
      client = soundcloud.Client(access_token=self.SOUNDCLOUD_TOKEN)
      
      if(self.embedsLeft == 0):
        response = client.get('/me/activities/tracks/affiliated')
  
        for link in response.collection:
          Thread(target=embedLoader, args=[link]).start()
          self.embedsLeft += 1

      shortList = []

      if(self.embedsLeft > 0):
        while(qmbd):
          try:
            shortList.append(qmbd.popleft())
            self.embedsLeft -= 1
          except:
            print('nothin in qmbd yet')

      moreData = False
      if(self.embedsLeft > 0):
        moreData = True

      return json.dumps({'data': shortList,'is_more_data': moreData})
      
    # def sendEmbed(links, moreData):
    #   embedList = []

    #   for good in links:
    #     embed_info = client.get('/oembed', url=good.origin.permalink_url)
        
    #     embedList.append({'embed': embed_info.html, 'time' : good.origin.created_at})
    #   data = json.dumps({'data': embedList,'is_more_data': moreData})
    #   return data
      








