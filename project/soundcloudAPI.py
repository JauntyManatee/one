import flask, os, soundcloud
from flask import request, redirect
client = soundcloud.Client(
  client_id= os.environ['SOUNDCLOUD_API_KEY'],
  client_secret= os.environ['SOUNDCLOUD_API_SECRET'],
  redirect_uri='http://127.0.0.1:5000/soundAuth',
)

class Soundcloud:
  
  def __init__(self, app):
    @app.route('/sound')
    def sound():
      return redirect(client.authorize_url())

    @app.route('/soundAuth')
    def soundAuth():
      code = request.args.get('code')
      access_token= client.exchange_token(code)
      print(access_token)
      print("Hi there, %s" % client.get('/me').username)

    @app.route('/soundEmbed')
    def soundEmbed():
      track_url = 'http://soundcloud.com/brightmatter/stay-where-near'
      embed_info = client.get('/oembed', url=track_url)
      return embed_info.html
      
