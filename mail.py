import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_email(recipients, subject, message, message_type='plain'):
    """ Sends email."""
    # TODO: put mail configs in a config file
    # TODO: add attachments
    # TODO: find a way to change the sender (gmail security makes it hard)

    username = 'service@resumebabel.com'
    password = 'p3aCHe$s'

    if isinstance(recipients, basestring):
        recipients = recipients.split(',')

    msg = MIMEMultipart('alternative')

    msg.add_header('Subject', subject)
    msg.add_header('From', 'Resumebabel <service@resumebabel.com>')

    for recipient in recipients:
        msg.add_header('To', recipient)

    body = MIMEText(message.encode('utf-8'), message_type, 'utf-8')

    msg.attach(body)

    # The actual mail send
    server = smtplib.SMTP('smtp.gmail.com:587')
    server.starttls()
    server.login(username, password)
    server.sendmail(username, msg.get_all('To'), msg.as_string())
    server.quit()

def send_welcome_email(email):
    subject = 'Welcome to resumebabel!'
    welcome_message = '''
    Welcome to resumebabel! http://www.resumebabel.com
    '''
    send_email(email, subject, welcome_message)
