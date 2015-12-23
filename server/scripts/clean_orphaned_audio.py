from pymongo import MongoClient
from bson.objectid import ObjectId


client = MongoClient('localhost', 27017)
db = client['tandem']

audios = db['audio']
users = db['users']
files = db['fs.files']
chunks = db['fs.chunks']

# remove files first
for media_file in files.find():
  if not audios.find_one({ 'audio': ObjectId(media_file['_id']) }):
    if not users.find_one({ 'image': ObjectId(media_file['_id']) }):
        print('{0} - is an orphane file'.format(media_file['_id']))
        files.remove(media_file['_id'])
   

# now remove chunks
for chunk in chunks.find(): 
   if not files.find_one({'_id': chunk['files_id']}): 
       chunks.remove( chunk['_id'] )
