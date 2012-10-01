from flask import Flask, render_template
import os

app = Flask(__name__)
app.config['DEBUG'] = bool(os.environ.get('DEBUG'))
# app.config['SERVER_NAME'] = 'dev.resumebabel.com:5000'


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/samples")
def samples():
    return ""


@app.route("/faq")
def faq():
    return ""


@app.route('/login')
def login():
    return ""


@app.route('/register')
def newuser():
    return ""


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run('0.0.0.0', port, use_reloader=True)
