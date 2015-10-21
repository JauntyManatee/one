from flask import Flask, render_template
from auth import *
#from db import engine
from db import conn

app = Flask(__name__)

@app.route('/')
def home():
  return render_template('index.html')
