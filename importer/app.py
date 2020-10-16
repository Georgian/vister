import logging

from flask import Flask

from broker import Broker
from statement_parser import StatementParser

LOG_FORMAT = ('%(levelname) -1s %(asctime)s %(name) -1s %(funcName) '
              '-5s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)

app = Flask(__name__)
app.run()


@app.route('/')
def index():
    return 'OK'


def consume_message(messager, headers, body):
    parse_result = StatementParser(headers, body).parse()
    if parse_result:
        LOGGER.info('Read %s transactions', len(parse_result))
        messager.publish_message({'ContentType': 'application/json'}, len(parse_result))
    else:
        LOGGER.info('Zero transactions')


logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
Broker(consume_message).run()
