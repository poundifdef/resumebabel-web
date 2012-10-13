from datetime import datetime
from bcrypt import gensalt, hashpw
from flask.ext.login import UserMixin
from flask.ext.sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), unique=True, nullable=False)
    display_name = db.Column(db.String(32), unique=True, nullable=False)
    created = db.Column(db.DateTime, unique=False, nullable=False)
    deleted = db.Column(db.DateTime, unique=False, nullable=True)
    salt = db.Column(db.String(32), unique=False, nullable=False)
    password = db.Column(db.String(60), unique=False, nullable=False)
    admin = db.Column(db.Boolean, default=False, unique=False, nullable=False)

    def __init__(self, email, display_name, password, admin=False):
        self.email = email
        self.display_name = display_name
        self.admin = admin
        self.created = datetime.now()

        salt = gensalt(10)
        self.salt = salt
        self.password = hashpw(password, salt)

    def __repr__(self):
        return '<User %r>' % (self.email)


class Resume(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), unique=False, nullable=False)
    default = db.Column(db.Boolean, default=False, unique=False,
                        nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('resumes',
                           lazy='dynamic'))

    def __init__(self, title, user):
        self.title = title
        self.slug = slug
        self.user = user

    def __repr__(self):
        return '<Resume %s: %s>' % (self.user.email, self.title)
