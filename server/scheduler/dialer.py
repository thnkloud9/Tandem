import logging
from bson.objectid import ObjectId
from twilio.rest import TwilioRestClient 
from pymongo import MongoClient
 
ACCOUNT_SID = "ACd2d64bee9b5d72522c0fa5e33c7aa2fc" 
AUTH_TOKEN = "8f54d45265a4fe99157003841e499388" 

client = MongoClient('localhost', 27017)
db = client['tandem']
 
client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN) 

def getMobile(user_id):
    users = db['users']
    lookup = {'_id': ObjectId(user_id)}
    user = users.find_one(lookup)
  
    logging.info('looking up {0}'.format(user_id))
 
    if not user:
        return None 
    
    return str(user['mobile'])

def verify(user_id): 
    mobile = getMobile(user_id)
    
    if not mobile:
        return None
 
    call = client.calls.create(
        to='+' + mobile, 
        from_="+4923198928606", 
        url="https://tandem.marklewis.me/mobile/verify",
    ) 
 
    return call.sid

def startPracticeSession(practice_session_id):
    practice_sessions = db['practice_sessions']
    lookup = {'_id': ObjectId(practice_session_id)}
    practice_session = practice_sessions.find_one(lookup)
    mobile = getMobile(practice_session['submitted_by'])

    logging.info('playing practice_set {0} for user {1} using {2}'.format(practice_session_id, practice_session['submitted_by'], mobile))

    call = client.calls.create(
        to='+' + mobile, 
        from_="+4923198928606", 
        url="https://tandem.marklewis.me/mobile/voice?practice_session={0}".format(practice_session_id),
    ) 
 
    return call.sid
