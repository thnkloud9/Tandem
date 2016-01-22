import logging
import requests
import random
import datetime
from bson.objectid import ObjectId
from eve.methods.post import post_internal
from flask import current_app as app
from eve.io.media import MediaStorage
from eve.io.mongo import Mongo
from gridfs import GridFS

class PracticeSessions():

    def createFromPracticeSet(practice_set_id):
        logging.info('creating new practice session')

        # check for existing session first
        practice_sessions = app.data.driver.db['practice_sessions']
        lookup = {
            'practice_set': practice_set_id,
            'status': 'started'
        }
        practice_session = practice_sessions.find_one(lookup)

        if practice_session:
            return str(practice_session["_id"])

        practice_sets = app.data.driver.db['practice_sets'] 
        lookup = {"_id": ObjectId(practice_set_id)}
        practice_set = practice_sets.find_one(lookup)

        # insert into practice_sessions
        practice_session = {
            "practice_set": practice_set_id,
            "platform": "mobile",
            "questions": practice_set['questions'],
            "submitted_by": practice_set['submitted_by'],
            "status": "started",
            "answers": [],
            "audio": []
        }
        practice_session_link = post_internal('practice_sessions', practice_session)

        return practice_session_link

    def getPracticeSession(practice_session_id):
        # load practice_session and chck for next question
        practice_sessions = app.data.driver.db['practice_sessions']
        lookup = {'_id': ObjectId(practice_session_id)}
        practice_session = practice_sessions.find_one(lookup)
        
        if not practice_session:
            return None

        return practice_session

    def getTitle(practice_session):
        # load practice_set 
        practice_sets = app.data.driver.db['practice_sets']
        lookup = {'_id': practice_session["practice_set"]}
        practice_set = practice_sets.find_one(lookup)

        if not practice_set:
            return None

        return str(practice_set['title'])

    def getNextQuestion(practice_session):   
        available_questions = [item for item in practice_session['questions'] if item not in practice_session['answers']]

        if not available_questions:
            return None

        next_question = available_questions.pop(0)

        return next_question

    def getRandomQuestionAudio(question_id, language_code):
        available_audio = []
        audios = app.data.driver.db['audio']
        lookup = {
            'question': question_id, 
            'language_code': language_code,
            'context': 'question'
        }
        for item in audios.find(lookup):
            available_audio.append(item)
        audio = random.choice(available_audio)

        return audio["_id"]

    def getLanguageCode(practice_session):
        users = app.data.driver.db['users']
        lookup = {'_id': practice_session['submitted_by']}
        user = users.find_one(lookup)
        language_code = user['learning'][0]

        return language_code

    def saveAnswer(practice_session, question_id, audio_id, answer_url):
       
        practice_sessions = app.data.driver.db['practice_sessions']
        questions = app.data.driver.db['questions']
        audios = app.data.driver.db['audio']
        users = app.data.driver.db['users']

        lookup = {'_id': ObjectId(audio_id)}
        question_audio = audios.find_one(lookup)

        lookup = {'_id': ObjectId(question_id)}
        question = questions.find_one(lookup)

        lookup = {'_id': practice_session['submitted_by']}
        user = users.find_one(lookup)
        language_code = user['learning'][0]

        # get audio from url
        # and save file to gridfs
        _response = requests.get(answer_url, verify=False)
        _data = _response.content
        _fs = GridFS(app.data.driver.db)
        audio_file_id = _fs.put(_data, filename=None, content_type="audio/mp3")
       
        # create new audio object 
        new_audio = {
            "context": "answer",
            "question": question_id,
            "question_text": question['text']['translations'][language_code],
            "status": "submitted",
            "submitted_by": practice_session['submitted_by'],
            "audio": audio_file_id,
            "language_code": language_code,
            "parent_audio": ObjectId(audio_id),
            "affected_user": ObjectId(question_audio['submitted_by']),
            "_created": datetime.datetime.now(),
            "_updated": datetime.datetime.now()
        }
        new_audio_id = audios.save(new_audio)

        # update practice_session object
        practice_session['audio'].append(ObjectId(audio_id))
        practice_session['audio'].append(ObjectId(new_audio_id))
        practice_session['answers'].append(ObjectId(question_id)) 
        practice_session['_updated'] = datetime.datetime.now()
        practice_sessions.save(practice_session)

        return practice_session

    def saveComplete(session_id):
        practice_sessions = app.data.driver.db['practice_sessions']
        lookup = {'_id': ObjectId(session_id)}
        practice_session = practice_sessions.find_one(lookup)

        practice_session['status'] = str('completed')
        practice_session['_updated'] = datetime.datetime.now()
        practice_sessions.save(practice_session)

        return practice_session 

    def queueNewJob(practice_session_id, when, user_timezone, repeat):
        new_job = {
            "when": when,
            "user_timezone": user_timezone,
            "repeat": repeat,
            "what": "play_practice_session",
            "practice_session": practice_session_id
        }
        new_jobs = app.data.driver.db['new_jobs_queue']
        new_job_id = new_jobs.save(new_job)
        
        return new_job_id
