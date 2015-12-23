import logging
import uuid
from eve.methods.post import post_internal
from flask import current_app as app

class Session():

    def createSession(user):
        logging.info('in session getToken')

        # check for existing session first
        sessions = app.data.driver.db['sessions']
        lookup = {'username': user["username"]}
        session = sessions.find_one(lookup)

        if session:
            return str(session["token"])

        # insert into sessions
        token = uuid.uuid4()
        session = {
            "username": user["username"],
            "password": user["password"],
            "token": str(token),
            "roles": user["roles"],
        }
        session_link = post_internal('sessions', session)
        return str(token)
        
    def destroySession(username):
        sessions = app.data.driver.db['sessions']
        sessions.remove({'username': username})
