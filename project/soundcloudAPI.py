import flask, os, soundcloud, json
from flask import request, redirect
client = soundcloud.Client(
  client_id= os.environ['SOUNDCLOUD_API_KEY'],
  client_secret= os.environ['SOUNDCLOUD_API_SECRET'],
  redirect_uri='http://127.0.0.1:5000/soundAuth'
)

class Soundcloud:
  
  def __init__(self, app):

    self.SOUNDCLOUD_TOKEN = ''

    @app.route('/sound')
    def sound():
      return redirect(client.authorize_url())

    @app.route('/soundAuth')
    def soundAuth():
      code = request.args.get('code')
      access_token= client.exchange_token(code)
      print(access_token.access_token)
      self.SOUNDCLOUD_TOKEN = access_token.access_token
      print("Hi there, %s" % client.get('/me').username)

    @app.route('/soundStream')
    def soundStream():
      client = soundcloud.Client(access_token=self.SOUNDCLOUD_TOKEN)
      theGoods = client.get('/me/activities/tracks/affiliated')
      theList = []
      theTimes = []
      for good in theGoods.collection:
        theTimes.append(good.origin.created_at)
        embed_info = client.get('/oembed', url=good.origin.permalink_url)
        theList.append(embed_info.html)
      data = json.dumps({'data': theList, 'times': theTimes})
      print(data)
      return data

