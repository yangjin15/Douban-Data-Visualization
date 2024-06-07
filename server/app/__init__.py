from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS

mysql = MySQL()

def create_app():
    app = Flask(__name__)
    
    # MySQL configurations
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = 'yj811025'
    app.config['MYSQL_DB'] = 'douban_books_db'
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

    mysql.init_app(app)

    # 添加CORS支持
    CORS(app)

    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
