from pymongo import MongoClient
from bson.objectid import ObjectId


client = MongoClient('localhost', 27017)
db = client['tandem']

audios = db['audio']

# add affected_user to answer audio
for audio in audios.find():
    if audio['context'] == 'answer':
        if not audio.get('affected_user', None):
            parent_audio = audios.find_one({'_id': ObjectId(audio['parent_audio'])})
            if parent_audio:
                print('UPDATING - {0} - {1}'.format(audio['_id'], parent_audio['submitted_by']))
                audio['affected_user'] = ObjectId(parent_audio['submitted_by'])
                audios.save(audio)
            else:
                print('{0} - is missing a parent'.format(audio['_id'])) 
                audios.remove({'_id': ObjectId(audio['_id'])})

