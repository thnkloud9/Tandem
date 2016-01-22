import logging
from .practice_sessions import PracticeSessions
from bson.objectid import ObjectId
from flask import jsonify, request, redirect, Response
from twilio.util import TwilioCapability
from twilio import twiml
from datetime import datetime, timedelta
#from apscheduler.schedulers.background import BackgroundScheduler

def init_app(app):

    """ twilio functions """
    @app.route('/mobile/client', methods=['GET', 'POST'])
    def client():
        """Respond to incoming requests."""
        
        account_sid = app.config['TWILIO_ACCOUNT_SID']
        auth_token  = app.config['TWILIO_AUTH_TOKEN'] 

        capability = TwilioCapability(account_sid, auth_token)

        application_sid = app.config['TWILIO_APP_SID']

        capability = TwilioCapability(account_sid, auth_token)
        capability.allow_client_outgoing(application_sid)
        token = capability.generate()

        return jsonify(token=token)

    @app.route('/mobile/verify', methods=['GET', 'POST'])
    def verify():
        """Test a mobile phone."""
        response = twiml.Response()
        response.say('Welcome to Tandem.  You can now use Tandem to practice whenever you like.')
        response.hangup()

        return Response(response.toxml(), mimetype='text/xml')

    @app.route('/mobile/voice', methods=['GET', 'POST'])
    def voice():
        """Greet / record the caller."""
        response = twiml.Response()

        # load practice_session and chck for next question
        session_id = request.values.get("practice_session", None)
        practice_session = PracticeSessions.getPracticeSession(session_id)
        language_code = PracticeSessions.getLanguageCode(practice_session)

        if not practice_session:
            response.say('Sorry. We can not find a valid practice session for this call.')
            response.hangup()

        session_title = PracticeSessions.getTitle(practice_session)
        next_question = PracticeSessions.getNextQuestion(practice_session)
        next_audio = PracticeSessions.getRandomQuestionAudio(next_question, language_code)
        action = "/mobile/recording?practice_session={0}&question={1}&audio={2}".format(session_id, next_question, next_audio)

        if not practice_session['answers']:
            response.say('This is your tandem app {0} practice session. Press pound after each answer'.format(session_title))

        response.play('https://tandem.marklewis.me/assets/audio/{0}'.format(next_audio))
        response.record(maxLength="30", action=action)
        
        return Response(response.toxml(), mimetype='text/xml')

    @app.route('/mobile/recording', methods=['GET', 'POST'])
    def recording():
        """Play back the caller's recording."""

        recording_url = request.values.get("RecordingUrl", None)
        session_id = request.values.get("practice_session", None)
        practice_session = PracticeSessions.getPracticeSession(session_id)
        question_id = request.values.get("question", None)
        audio_id = request.values.get("audio", None)

        response = twiml.Response()
        #response.say("You said.")
        #response.play(recording_url)

        # save the answer to the practice_session
        practice_session = PracticeSessions.saveAnswer(practice_session, question_id, audio_id, recording_url)

        next_question = PracticeSessions.getNextQuestion(practice_session)
        if not next_question:
            practice_session = PracticeSessions.saveComplete(session_id)
            response.say("That was your last question. Goodbye")
            response.hangup()
        else:        
            response.redirect('/mobile/voice?practice_session={0}'.format(session_id))

        return Response(response.toxml(), mimetype='text/xml')

    @app.route('/mobile/schedule/<practice_set_id>', methods=['GET', 'POST'])
    def schedule(practice_set_id):
        request_json = request.get_json()

        if not request_json:
            return jsonify(status=False)

        when = request_json['when']
        user_timezone = request_json['user_timezone']
        repeat = request_json['repeat']

        # create a new session
        practice_session_link = PracticeSessions.createFromPracticeSet(practice_set_id)
        practice_session = PracticeSessions.getPracticeSession(practice_session_link[0]['_id'])
        user_id = practice_session['submitted_by']

        logging.info('Creating new practice session based on practice_set {0} for {1}'.format(practice_set_id, user_id))
        
        # schedule it 
        logging.info('Scheduling practice_session {0} for {1}'.format(practice_session['_id'], when))
        PracticeSessions.queueNewJob(practice_session['_id'], when, user_timezone, repeat)
 
        return jsonify(status=True)
