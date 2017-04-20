import logging

from flask import Blueprint, Flask
from flask_sqlalchemy import SQLAlchemy
from flask.ext.redis import FlaskRedis
from redis import StrictRedis
from sqlalchemy.sql.expression import func

from src.extensions import (
    debug_toolbar
)


stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.INFO)

db = SQLAlchemy()
redis_store = FlaskRedis.from_custom_provider(StrictRedis)



from src.blueprints.demo import demo    # import demo blueprint
from src.blueprints.mobydock.page import page


def create_app():
    """
    Create a Flask application using the app factory pattern.

    :return: Flask app
    """
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_object('config.settings')
    app.config.from_pyfile('settings.py', silent=True)

    db.init_app(app)
    redis_store.init_app(app)

    app.register_blueprint(page)
    app.register_blueprint(demo, url_prefix="/demo")
    extensions(app)
    app.logger.addHandler(stream_handler)

    return app

def extensions(app):
    """
    Register 0 or more extensions (mutates the app passed in).

    :param app: Flask application instance
    :return: None
    """
    if app.config.get('DEBUG'):
        debug_toolbar.init_app(app)

    return None
