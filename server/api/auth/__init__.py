import logging
import bcrypt
import uuid
import datetime
from flask import current_app as app, jsonify, request, redirect
from .session import Session

def init_app(app):
    #TODO: add proper HTTP codes and Error Handling 
    @app.route('/api/login', methods=['POST'])
    def login():
        # TODO: this only works with json data params, it should work with both
        request_json = request.get_json()

        if not request_json:
            return jsonify(status=False)

        username = request_json['username']
        password = request_json['password']

        # TODO: check if the username is already in the sessions collection

        users = app.data.driver.db['users']
        lookup = {'username': str(username)}
        user = users.find_one(lookup)

        if not user:
            return jsonify(status=False)
     
        hashed = user['password'].encode('UTF-8') 
        password = password.encode('UTF-8')

        if not (password and hashed):
            return jsonify(status=False)

        try:
            rehashed = bcrypt.hashpw(password, hashed)
            if hashed != rehashed:
                return jsonify(status=False)
        except ValueError:
            return jsonify(status=False)

        # insert into sessions
        token = Session.createSession(user)
        # update last_login
        user['last_login'] = datetime.datetime.now()
        users.save(user)

        response = {
            "status": True,
            "token": token,
            "username": user["username"],
            "roles": user["roles"],
            "user": str(user["_id"]),
            "speaks": user["speaks"],
            "learning": user["learning"]
        }

        return jsonify(response);

    @app.route('/api/logout', methods=['POST'])
    def logout():
        # remove from sessions with username
        request_json = request.get_json()
        username = request_json['username']

        Session.destroySession(username)

        return jsonify(status=True, username=username);

