from flask import Flask, render_template
from auth import *
import base64

app = Flask(__name__)

app.secret_key = base64.b64encode(os.urandom(16)).decode('utf-8')

@app.route('/')
def home():
  return render_template('index.html')
