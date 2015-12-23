import logging
from bson.objectid import ObjectId
from flask import current_app as app, jsonify, Response
from eve.io.media import MediaStorage
from eve.io.mongo import Mongo
from gridfs import GridFS

def init_app(app):
    @app.route('/assets/<file_id>', methods=['GET'])
    def get_asset(file_id):

        _fs = GridFS(app.data.driver.db)
        _file = _fs.get(ObjectId(file_id))
        content = _file.read()

        return Response(content, mimetype=str(_file.content_type))

    @app.route('/assets/audio/<audio_id>', methods=['GET'])
    def get_audio(audio_id):

        audios = app.data.driver.db['audio']
        lookup = {'_id': ObjectId(audio_id)}
        audio = audios.find_one(lookup)

        if not audio:
            return jsonify(status=False)

        _fs = GridFS(app.data.driver.db)
        _file = _fs.get(audio['audio'])
        content = _file.read()

        return Response(content, mimetype=str(_file.content_type))
        
    @app.route('/assets/profile_images/<user_id>', methods=['GET'])
    def get_profile_image(user_id):

        users = app.data.driver.db['users']
        lookup = {'_id': ObjectId(user_id)}
        user = users.find_one(lookup)

        if not user:
            return jsonify(status=False)

        _fs = GridFS(app.data.driver.db)
        _file = _fs.get(user.get('image', None))
        if not _file:
            content = None
        else:
            content = _file.read()

        return Response(content, mimetype=str(_file.content_type))
