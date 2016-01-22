import os
import bcrypt
import logging
import settings
import mobile
import auth
import assets
from bson.objectid import ObjectId
from auth.auth import TandemTokenAuth 
from eve import Eve
from flask.ext.cors import CORS


def get_app(config=None):

    app_dir = os.path.dirname(os.path.realpath(__file__))
    logging.basicConfig(
        filename= app_dir + '/../log/app.log',
        format='%(asctime)s - %(name)s - %(levelname)s: %(message)s', 
        datefmt='%m/%d/%Y %I:%M:%S %p',
        level=logging.DEBUG)
    logging.info('TandemApi Started')

    if config is None:
        config = {}

    for key in dir(settings):
        if key.isupper():
            config.setdefault(key, getattr(settings, key))

    def encrypt_pass(documents):
        for document in documents:
            salt = app.config.get('BCRYPT_GENSALT_WORK_FACTOR', 12)
            password_hash = bcrypt.hashpw(document['password'].encode('UTF-8'), bcrypt.gensalt(salt)) 
            document['password'] = password_hash.decode('UTF-8')

    def add_points(documents):
        users = app.data.driver.db['users']
        for document in documents:
            lookup = {
                '_id': document['submitted_by']
            }
            user = users.find_one(lookup)
            if user:
                user['points'] = int(user.get('points', 0) + 10)
                users.save(user)
            
    app = Eve(auth=TandemTokenAuth, settings=config)
    cors = CORS(app)

    # on every new user insert
    app.on_insert_users += encrypt_pass

    # on every new audio insert
    app.on_insert_audio += add_points

    auth.init_app(app)
    mobile.init_app(app)
    assets.init_app(app)
 
    return app

if __name__ == '__main__':
    app_dir = os.path.dirname(os.path.realpath(__file__))
    logging.basicConfig(
        filename= app_dir + '/../log/app.log',
        format='%(asctime)s - %(name)s - %(levelname)s: %(message)s', 
        datefmt='%m/%d/%Y %I:%M:%S %p',
        level=logging.DEBUG)
    logging.info('TandemApi Started')

    debug = True
    host = '0.0.0.0'
    port = int(os.environ.get('PORT', '5000'))

    app = get_app()
    app.run(host=host, port=port, debug=debug)
