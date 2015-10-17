from flask import Flask, render_template
from db import engine
 
app = Flask(__name__)      

@app.route('/')
def home():
  return render_template('index.html')

#not sure if we need this anymore...
#@app.route('/<path:path>')
#def seeStaticFile(path):
#	return app.send_static_file(path);


if __name__ == '__main__':
    app.run(debug=True)
    
