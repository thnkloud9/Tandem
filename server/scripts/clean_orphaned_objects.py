from pymongo import MongoClient
from bson.objectid import ObjectId


client = MongoClient('localhost', 27017)
db = client['tandem']

audios = db['audio']
users = db['users']
files = db['fs.files']
chunks = db['fs.chunks']
practice_sets = db['practice_sets']
practice_sessions = db['practice_sessions']

# remove practice_sets without associated user
for practice_set in practice_sets.find():
    if not users.find_one({'_id': ObjectId(practice_set['submitted_by'])}):
        print('{0} - is an orphane practice_set'.format(practice_set['_id']))
        practice_sets.remove(practice_set['_id']) 

# remove practice_sessions without associated user
for practice_session in practice_sessions.find():
    if not users.find_one({'_id': ObjectId(practice_set['submitted_by'])}):
        print('{0} - is an orphane practice_session'.format(practice_session['_id']))
        practice_sessions.remove(practice_session['_id']) 

# remove files without associated user
for media_file in files.find():
  if not audios.find_one({ 'audio': ObjectId(media_file['_id']) }):
    if not users.find_one({ 'image': ObjectId(media_file['_id']) }):
        print('{0} - is an orphane file'.format(media_file['_id']))
        files.remove(media_file['_id'])
   

# now remove chunks witout associated file
for chunk in chunks.find(): 
   if not files.find_one({'_id': chunk['files_id']}): 
       chunks.remove( chunk['_id'] )
