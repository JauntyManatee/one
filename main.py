import sys

sys.path.append('project')

from server import *

from flask.ext.bower import Bower

# from soundcloudAPI import *
from reddit import *
from instagram import *
from twitter import *

Bower(app)
Reddit(app)
Instagram(app)
# Soundcloud(app)
Twitter(app)

if __name__ == '__main__':
  app.run(debug=True) 
