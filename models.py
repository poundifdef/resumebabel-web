from bcrypt import gensalt, hashpw
from flask.ext.login import UserMixin
from flask.ext.sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), unique=True, nullable=False)
    salt = db.Column(db.String(32), unique=False, nullable=False)
    passwd = db.Column(db.String(60), unique=False, nullable=False)
    admin = db.Column(db.Boolean, default=False, unique=False, nullable=False)

    def __init__(self, email, password):
        self.email = email

        salt = gensalt(10)
        self.salt = salt
        self.passwd = hashpw(password, salt)

    def __repr__(self):
        return '<User %r>' % (self.email)
