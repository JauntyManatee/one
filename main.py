import sys
sys.path.append('project')

from server import *

from flask.ext.bower import Bower
from reddit import *
from instagram import *

Bower(app)
Reddit(app)
Instagram(app)

if __name__ == '__main__':
  app.run(debug=True) 
