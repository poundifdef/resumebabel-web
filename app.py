from bcrypt import hashpw
from flask import (abort, flash, Flask, jsonify,
                   render_template as flask_render_template, request,
                   send_from_directory, url_for)
from flask.ext.login import (current_user, login_required, login_user,
                             logout_user, LoginManager, redirect)
import json
import mail
from models import db, User, Resume
from forms import LoginForm, RegistrationForm
import os
import sys
import glob
import shutil

app = Flask(__name__)
app.config.from_object('config.Config')

sys.path.append(app.config['RESUMEBABEL'])


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


@app.route('/resumes/', methods=['GET', 'POST'])
@login_required
def resumes():
    if request.method == 'POST':
        resume = Resume(request.form['title'], current_user)
        db.session.add(resume)
        db.session.commit()

        if request.args.get('api'):
            return jsonify(response='OK')

    resumes = Resume.query.filter_by(user=current_user).all()
    return render_template('resumes.html', resumes=resumes, has_js=True)

@app.route('/resumes/<int:resume_id>/', methods=['GET', 'POST'])
@login_required
def resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user=current_user).first()
    if not resume:
        abort(404)

    if request.method == 'POST':
        if request.args.get('api'):
            try:
                if len(request.form['resume']) > 65535:
                    raise Exception('Resume json can be no more than 64k')

                new_resume = json.loads(request.form['resume'])

                # TODO: properly validate json
                required_fields = {'contact': {}, 'education': [], 'experiences': {}}
                for field, field_type in required_fields.iteritems():
                    value = new_resume.get(field, None)
                    if value is None:
                        raise Exception('Resume must have these fields: ' + str(required_fields))
                    if type(value) != type(field_type):
                        raise Exception('Resume must have these fields: ' + str(required_fields))


                resume_name = '%d.json' % (resume_id)
                resume_path = os.path.join(app.config['RESUME_FOLDER'], resume_name)
                fd = open(resume_path, 'w')
                fd.write(request.form['resume'])
                fd.close()

                return jsonify(response='OK', error=[])
            except Exception as ex:
                return jsonify(response='Error', error=[str(ex)])

    return render_template('resume.html', has_js=True, get_resume=True)


@app.route('/resumes/<int:resume_id>/resume.<string:file_format>')
@login_required
def download_resume(resume_id, file_format):
    from resumebabel.resumebabel import ResumeBabel 

    resume = Resume.query.filter_by(id=resume_id, user=current_user).first()
    if not resume or file_format not in ResumeBabel.get_supported_formats():
        abort(404)

    resume_name = '%d.json' % (resume_id)
    resume_path = os.path.join(app.config['RESUME_FOLDER'], resume_name)

    file_name = '%d.%s' % (resume_id, file_format)
    file_path = os.path.join(app.config['RESUME_FOLDER'], file_name)

    resume_json = None
    if os.path.isfile(resume_path):
        resume_json = open(resume_path, 'r').read()

    if not os.path.isfile(file_path):
        out_fd = open(file_path, 'w')
        r = ResumeBabel(resume_json)
        r.export_resume(out_fd, file_format)
        out_fd.close()

    as_attachment = False
    if request.args.get('download'):
        as_attachment = True

    # TODO: mimetype='application/json' ????
    return send_from_directory(app.config['RESUME_FOLDER'],
                               file_name, attachment_filename=('resume.' + file_format),
                               cache_timeout=60, as_attachment=as_attachment)


@app.route('/resumes/delete/<int:resume_id>/', methods=['POST'])
@login_required
def delete_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user=current_user).first()
    if not resume:
        abort(404)

    db.session.delete(resume)
    db.session.commit()

    to_delete = glob.glob(app.config['RESUME_FOLDER'] + '/%d.*' % (resume_id))
    for filename in to_delete:
        os.unlink(filename)

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

    src = app.config['RESUME_FOLDER'] + ('/%d.json' % (resume_id))
    dest = app.config['RESUME_FOLDER'] + ('/%d.json' % (cloned_resume.id))
    if os.path.isfile(src):
        shutil.copy(src, dest)

    if request.args.get('api'):
        return jsonify(response='OK')
    else:
        return redirect(url_for("resumes"))


@app.route('/resumes/edit/<int:resume_id>/', methods=['POST'])
@login_required
def edit_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user=current_user).first()
    if not resume:
        abort(404)

    for field, value in request.form.iteritems():
        print field, value
        print type(field), type(value)
        if field == 'default':
            if value == 'True':
                resume.default = True
                resumes = Resume.query.filter_by(user=current_user).all()
                for r in resumes:
                    if r.id != resume_id:
                        r.default = False
                        db.session.add(r)
            else:
                resume.default = False

        if field == 'title':
            # TODO: error checking!!! What if title is blank or all whitespace?
            resume.title = value

    db.session.add(resume)
    db.session.commit()

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
