class Config(object):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/resumebabel.sqlite'
    SECRET_KEY = 'yeah not a secret'
    RESUME_FOLDER = 'resumes'
