from flask import Flask, render_template
import os

app = Flask(__name__)
app.config.from_object('website_settings.Config')


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
    app.run('0.0.0.0', port)
