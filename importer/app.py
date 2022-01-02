import logging

from flask import Flask, request, jsonify
from flaskext.mysql import MySQL

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
# app.run()

mysql = MySQL(app)
mysql_conn = mysql.connect()


@app.route('/')
def index():
    return 'OK'


@app.route('/parse', methods=['POST'])
def parse_statement():
    print(request.files)
    if 'file' not in request.files:
        resp = jsonify({'message': 'No file part in the request'})
        resp.status_code = 400
        return resp
    file = request.files['file']
    parse_result = StatementParser({'ContentType': 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'}, file,
                                   mysql_conn).parse()
    return parse_result


logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
