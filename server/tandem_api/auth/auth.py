import logging
from eve.auth import TokenAuth
from flask import current_app as app, request, jsonify

class TandemTokenAuth(TokenAuth):
    def check_auth(self, token,  allowed_roles, resource, method):
        # TODO: change this to lookup from sessions
        sessions = app.data.driver.db['sessions']
        lookup = {'token': token}
        
        if allowed_roles:
            lookup['roles'] = {'$in': allowed_roles}
        session = sessions.find_one(lookup)

        return session
