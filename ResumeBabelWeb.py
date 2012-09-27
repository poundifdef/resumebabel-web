from flask import Flask, request, redirect, session, render_template, url_for
from jinja2 import Template
from werkzeug.routing import Rule,Subdomain
import json

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/samples")
def samples():
    return ""

@app.route("/api")
def api(boardstate):
    return boardstate

@app.route("/faq")
def faq():
    return ""

@app.route('/login')
def login():
    return ""
	
@app.route('/newuser')
def newuser():
    return ""

if __name__ == "__main__":
    app.config['DEBUG'] = True
    app.run('127.0.0.1',80)