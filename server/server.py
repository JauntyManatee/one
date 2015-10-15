from flask import Flask, request
 
app = Flask(__name__, static_folder='./client')      
 
@app.route('/')
def home():
  return app.send_static_file('index.html')
 
@app.route('/<path:path>')
def static_prox(path):
  return app.send_static_file(path)

if __name__ == '__main__':
  app.run(debug=True)
