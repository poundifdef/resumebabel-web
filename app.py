from flask import Flask, render_template
from models import db, User
import os

app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)


@app.route("/")
def index():
    print User.query.all()
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
    # Create test context to set up db
    ctx = app.test_request_context()
    ctx.push()

    # Create db tables
    print db.create_all()

    # Create initial admin user
    u = User('admin', 'gettingajob')
    print db.session.add(u)
    print db.session.commit()

    print User.query.all()

    ctx.pop()

    print app.__dict__

    # Start server
    port = int(os.environ.get("PORT", 5000))
    app.run('0.0.0.0', port)
