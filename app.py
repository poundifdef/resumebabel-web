from bcrypt import hashpw
from flask import (abort, flash, Flask, jsonify,
                   render_template as flask_render_template, request,
                   url_for)
from flask.ext.login import (current_user, login_required, login_user,
                             logout_user, LoginManager, redirect)
import mail
from models import db, User, Resume
from forms import LoginForm, RegistrationForm
import os

app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)


login_manager = LoginManager()
login_manager.setup_app(app)
login_manager.login_view = "login"
login_manager.login_message = None


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
        return user and hashpw(password, user.salt) == user.password

    if current_user.is_authenticated():
        return redirect(url_for("resumes"))

    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        user = User.query.filter_by(email=email).first()

        if check_credential(user):
            login_user(user)
            return redirect(url_for("resumes"))
        else:
            flash('Invalid Login')
            return render_template('login.html', form=form)

    return render_template('login.html', form=form)


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))


@app.route('/resumes/')
@login_required
def resumes():
    resumes = Resume.query.filter_by(user=current_user).all()
    return render_template('resumes.html', resumes=resumes, has_js=True)


@app.route('/resumes/delete/<int:resume_id>/', methods=['POST'])
@login_required
def delete_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user=current_user).first()
    if not resume:
        abort(404)

    db.session.delete(resume)
    db.session.commit()

    # TODO: DELETE ASSETS TOO

    if request.args.get('api'):
        return jsonify(response='OK')
    else:
        return redirect(url_for("resumes"))


@app.route('/resumes/clone/<int:resume_id>/', methods=['POST'])
@login_required
def clone_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user=current_user).first()
    if not resume:
        abort(404)

    cloned_resume = Resume(resume.title + ' [CLONE]', current_user)
    db.session.add(cloned_resume)
    db.session.commit()

    # TODO: CLONE JSON ASSET (IF IT EXISTS)

    if request.args.get('api'):
        return jsonify(response='OK')
    else:
        return redirect(url_for("resumes"))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated():
        return redirect(url_for("resumes"))

    form = RegistrationForm()
    if form.validate_on_submit():
        email = form.email.data
        display_name = form.display_name.data
        password = form.password.data

        u = User(email, display_name, password)
        db.session.add(u)
        db.session.commit()

        # TODO: Capture first and last name? personalized email?
        mail.send_welcome_email(email)

        login_user(u)
        return redirect(url_for("resumes"))

    return render_template('register.html', form=form)


if __name__ == "__main__":
    # Create test context to set up db
    ctx = app.test_request_context()
    ctx.push()

    # Create db tables
    db.create_all()

    # Create initial admin user if they don't already exist
    if not User.query.filter_by(email='admin').first():
        u = User('admin', 'admin', 'peach')
        u.admin = True
        db.session.add(u)

        r1 = Resume('Test Resume', u)
        db.session.add(r1)
        r2 = Resume('Google Resume', u)
        db.session.add(r2)

        db.session.commit()

    ctx.pop()

    # Start server
    port = int(os.environ.get("PORT", 5000))
    app.run('0.0.0.0', port)
