import flask, os, soundcloud, json
from flask import request, redirect

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
      access_token= client.exchange_token(code)
      print(access_token.access_token)
      self.SOUNDCLOUD_TOKEN = access_token.access_token
      print("Hi there, %s" % client.get('/me').username)
      return redirect(os.environ['REDIRECT_URI'] +'/#/feed')

    @app.route('/soundStream')
    def soundStream():
      client = soundcloud.Client(access_token=self.SOUNDCLOUD_TOKEN)
      theGoods = client.get('/me/activities/tracks/affiliated')
      theList = []
      for good in theGoods.collection:
        embed_info = client.get('/oembed', url=good.origin.permalink_url)
        # print(dir(embed_info))
        theList.append({'embed': embed_info.html, 'time' : good.origin.created_at})
      data = json.dumps({'data': theList})
      return data
