from flask import Flask, render_template 
import sys
sys.path.append('server_logic')

from twitterRoutes import *
 
app = Flask(__name__)      

@app.route('/')
def home():
  return render_template('index.html')

if __name__ == '__main__':
  app.run(debug=True)

#not sure if we need this anymore...
#@app.route('/<path:path>')
#def seeStaticFile(path):
#	return app.send_static_file(path);


