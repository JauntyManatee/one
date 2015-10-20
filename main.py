import sys
sys.path.append('project')

from server import *

from reddit import *
from flask.ext.bower import Bower


Bower(app)
Reddit(app)

if __name__ == '__main__':
  app.run(debug=True) 
