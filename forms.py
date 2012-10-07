from flask.ext.wtf import (Form, TextField, PasswordField, SubmitField,
    Required, ValidationError)

class LoginForm(Form):
    email = TextField("Email", validators=[Required()])
    password = PasswordField("Password", validators=[Required()])
    submit = SubmitField("Sign in")
