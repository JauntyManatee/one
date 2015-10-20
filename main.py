import sys
sys.path.append('project')

from server import *

<<<<<<< 5dd130a2cc50b0bc9d06d8128eb59d941a797b3e
=======
from reddit import *
>>>>>>> abstracted reddit out of server
from flask.ext.bower import Bower
from reddit import *
from instagram import *


Bower(app)
Reddit(app)
<<<<<<< 5dd130a2cc50b0bc9d06d8128eb59d941a797b3e
Instagram(app)
=======
>>>>>>> abstracted reddit out of server

if __name__ == '__main__':
  app.run(debug=True) 
