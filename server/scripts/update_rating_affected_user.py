from pymongo import MongoClient
from bson.objectid import ObjectId


client = MongoClient('localhost', 27017)
db = client['tandem']

audios = db['audio']
ratings = db['ratings']

# add affected_user to answer audio
for rating in ratings.find():
    if not rating.get('parent', None):
        audio = audios.find_one({'_id': ObjectId(rating.get('parent', None))})
        if audio:
            print('UPDATING - {0} - {1}'.format(rating['_id'], audio['submitted_by']))
            rating['affected_user'] = ObjectId(audio['submitted_by'])
            ratings.save(rating)

