import sys
sys.path.append('project')

from server import *
from flask.ext.bower import Bower

Bower(app)

if __name__ == '__main__':
  app.run(debug=True)
