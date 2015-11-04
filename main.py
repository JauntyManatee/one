import sys,os

sys.path.append('project')

try:
  os.environ['runtime'] = sys.argv[1]
except:
  os.environ['runtime'] = 'dev'

from server import *

from flask.ext.bower import Bower

from soundcloudAPI import *
from reddit import *
from instagram import *
from twitter import *
from db_route import *


db = DB_Route(app)


Bower(app)
Reddit(app)
Instagram(app, db)
Soundcloud(app, db)
Twitter(app, db)

#login_manager.init_app(app)

if __name__ == '__main__':
  app.run(debug=True) 
