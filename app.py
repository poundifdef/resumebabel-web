from bcrypt import hashpw
from flask import flash, Flask, render_template as flask_render_template, \
    request, url_for
from flask.ext.login import current_user, login_required, login_user, \
    logout_user, LoginManager, redirect
from models import db, User
import os

app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)


login_manager = LoginManager()
login_manager.setup_app(app)
login_manager.login_view = "login"


def render_template(*args, **kwargs):
    nav = [
            ('/', 'Home'),
            ('#', 'Samples'),
            ('#', 'FAQ'),
          ]

    if current_user.is_authenticated():
        nav.append((url_for('resumes'), 'My Resumes'))
        nav.append((url_for('logout'), 'Logout'))
    else:
        nav.append((url_for('login'), 'Login'))

    return flask_render_template(*args, nav=nav, **kwargs)


@login_manager.user_loader
def load_user(id):
    return User.query.filter_by(id=id).first()


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/samples")
def samples():
    return ""


@app.route("/faq")
def faq():
    return ""


@app.route('/login', methods=['GET', 'POST'])
def login():
    def check_credential(user):
        return user and hashpw(password, user.salt) == user.passwd

    if request.method == 'POST':
        username = request.form.get('email', '')
        password = request.form.get('password', '')

        user = User.query.filter_by(email=username).first()
        if check_credential(user):
            login_user(user)
        else:
            flash('Invalid Login')

    if current_user.is_anonymous():
        return render_template('login.html')

    return redirect(url_for("resumes"))

    return render_template('login.html')


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))


@app.route('/resumes')
@login_required
def resumes():
    return render_template('resumes.html')


@app.route('/register')
def register():
    return ""


if __name__ == "__main__":
    # Create test context to set up db
    ctx = app.test_request_context()
    ctx.push()

    # Create db tables
    db.create_all()

    # Create initial admin user if they don't already exist
    if not User.query.filter_by(email='admin').first():
        u = User('admin', 'peach')
        u.admin = True
        db.session.add(u)
        db.session.commit()

    ctx.pop()

    # Start server
    port = int(os.environ.get("PORT", 5000))
    app.run('0.0.0.0', port)
