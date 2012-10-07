from flask.ext.wtf import (Form, TextField, PasswordField, SubmitField,
                           Required, Email, Length, ValidationError)
from models import User


class LoginForm(Form):
    email = TextField("Email", validators=[Required()])
    password = PasswordField("Password", validators=[Required()])
    submit = SubmitField("Sign in")


class RegistrationForm(Form):
    email = TextField("Email", validators=[Required(), Email(),
                      Length(max=128)])
    display_name = TextField("Display Name", validators=[Required(),
                             Length(max=32)])
    password = PasswordField("Password", validators=[Required()])
    submit = SubmitField("Register")

    def validate_email(form, field):
        if User.query.filter_by(email=field.data).first():
            raise ValidationError('Email address already taken')

    def validate_display_name(form, field):
        # TODO: no whitespace
        if User.query.filter_by(display_name=field.data).first():
            raise ValidationError('Display name already taken')

    def validate_password(form, field):
        # TODO: min password requirements
        pass
