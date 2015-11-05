
# /soundcloud/stats pulls stats for user
# /sound is our auth route
# /soundAuth is our redirect
# /soundStream gets embeds for own sound feed


import flask, os, soundcloud, json, collections
from threading import Thread
from flask import request, redirect, session


client = soundcloud.Client(
  client_id= os.environ['SOUNDCLOUD_API_KEY'],
  client_secret= os.environ['SOUNDCLOUD_API_SECRET'],
  redirect_uri= os.environ['REDIRECT_URI'] + '/soundAuth'
)

class Soundcloud:
  
  def __init__(self, app, db):

    self.db = db
    self.SOUNDCLOUD_TOKEN = ''

    #authorization route
    @app.route('/sound')
    def sound():
      return redirect(client.authorize_url())

    #mid handshake route, retrieves access token
    @app.route('/soundAuth')
    def soundAuth():
      try:
        code = request.args.get('code')
        access_token = client.exchange_token(code)
        user = self.db.session.query(self.db.User).filter_by(authToken=session['id']).first()
        user.soundcloudToken = access_token.access_token
        self.db.session.commit()
        session['soundcloudToken'] = access_token.access_token
      except:
        print('soundcloud error in soundAuth: token shake')
      finally: 
        return redirect(os.environ['REDIRECT_URI'] +'/#/feed')

    @app.route('/soundcloud/stats')
    def soundStats():
      if ('soundcloudToken' not in session):
        user = self.db.session.query(self.db.User).filter_by(authToken=session['id']).first()
        session['soundcloudToken'] = user.soundcloudToken
      try:
        client = soundcloud.Client(access_token=session['soundcloudToken'])
        response = client.get('me')
        return response.raw_data  
      except:
        return json.dumps({})

    qmbd = collections.deque()
    self.embedsLeft = 0

    #method to be used asynchronously
    #will grab embeds from soundcloud without blocking the main server thread
    def embedLoader(link):
      try:
        response = client.get('/oembed', url=link.origin.permalink_url)
        qmbd.append({'embed': response.html, 'time' : link.origin.created_at})
      except:
        self.embedsLeft -= 1
        pass

    @app.route('/soundStream')
    def soundStream():
      if ('soundcloudToken' not in session):
        user = self.db.session.query(self.db.User).filter_by(authToken=session['id']).first()
        session['soundcloudToken'] = user.soundcloudToken
      try:
        client = soundcloud.Client(access_token=session['soundcloudToken'])
      except:
        return 'null'

      #if there's no data in our q to send to client, lets get some!
      if(self.embedsLeft == 0):
        try:
          response = client.get('/me/activities/tracks/affiliated', limit=4)
        except:
          return 'null'

        #for every link in our response object, tell embedLoader 
        #grab an imbed from soundlcoud and append it to our q
        for link in response.collection:
          Thread(target=embedLoader, args=[link]).start()
          self.embedsLeft += 1

      #this is our temp list to send to the client
      #we will fill it with whatever has returned into our embed q at the time
      shortList = []

      #if we have data to send, grab all in qmbd and put it in the shortList
      if(self.embedsLeft > 0):
        while(qmbd):
          try:
            shortList.append(qmbd.popleft())
            self.embedsLeft -= 1
          except:
            print('nothin in qmbd yet')

      #toggle moreData to notify user if there's more data or not
      moreData = False
      if(self.embedsLeft > 0):
        moreData = True

      #send shortList and our more_data flag
      return json.dumps({'data': shortList,'is_more_data': moreData})
      







