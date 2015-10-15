import sys
sys.path.append('server')

from server import *

if(__name__=='__main__'):
	app.run(debug=True)
