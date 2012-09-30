from flask import Flask, render_template

app = Flask(__name__)


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
    app.config['DEBUG'] = True
    app.run('127.0.0.1', 8080)
