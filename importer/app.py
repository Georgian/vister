import logging

from flask import Flask
from flaskext.mysql import MySQL

from broker import Broker
from statement_parser import StatementParser

LOG_FORMAT = ('%(levelname) -1s %(asctime)s %(name) -1s %(funcName) '
              '-5s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)

app = Flask(__name__)
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_PORT'] = 3306
app.config['MYSQL_DATABASE_USER'] = 'user'
app.config['MYSQL_DATABASE_PASSWORD'] = 'pass'
app.config['MYSQL_DATABASE_DB'] = 'importer'
# app.config['MYSQL_DATABASE_CHARSET'] = 'utf-8'
app.run()

mysql = MySQL(app)
mysql_conn = mysql.connect()


@app.route('/')
def index():
    return 'OK'


def consume_message(messager, headers, body):
    parse_result = StatementParser(headers, body, mysql_conn).parse()
    if parse_result:
        LOGGER.info('Read %s transactions', len(parse_result))
        messager.publish_message({'ContentType': 'application/json'}, len(parse_result))
    else:
        LOGGER.info('Zero transactions')


logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
Broker(consume_message).run()
