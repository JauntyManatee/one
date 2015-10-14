from flask import Flask, request
 
app = Flask(__name__, static_folder='../client')      
 
@app.route('/')
def home():
  return "hey"
 
if __name__ == '__main__':
  app.run(debug=True)
