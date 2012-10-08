from flask.ext.wtf import (Form, TextField, PasswordField, SubmitField,
                           Required, Email, Length, ValidationError)
import string
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
    password = PasswordField("Password", validators=[Required(), Length(min=8)])
    submit = SubmitField("Register")

    def validate_email(form, field):
        if User.query.filter_by(email=field.data).first():
            raise ValidationError('Email address already taken')

    def validate_display_name(form, field):
        # TODO: only valid URL characters

        if [c for c in field.data if c in string.whitespace]:
            raise ValidationError('Display name cannot contain whitespace')

        if User.query.filter_by(display_name=field.data).first():
            raise ValidationError('Display name already taken')
