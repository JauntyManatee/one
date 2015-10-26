import flask, os, soundcloud, json, collections, time
from threading import Thread
from flask import request, redirect
<<<<<<< HEAD
=======
import collections
from threading import Thread
>>>>>>> a28caab

client = soundcloud.Client(
  client_id= os.environ['SOUNDCLOUD_API_KEY'],
  client_secret= os.environ['SOUNDCLOUD_API_SECRET'],
  redirect_uri= os.environ['REDIRECT_URI'] + '/soundAuth'
)
#'http://127.0.0.1:5000/soundAuth'
class Soundcloud:
  
  def __init__(self, app):

    self.embedsLeft = 0
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
      







