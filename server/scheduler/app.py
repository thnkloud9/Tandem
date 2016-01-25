from datetime import datetime
import sys
import os
import time
import logging
import dialer
from pymongo import MongoClient
from apscheduler.schedulers.background import BackgroundScheduler


def addJobs(new_jobs_queue):
    for job in new_jobs_queue.find():
        print(str(job))
        logging.info(str(job))
        
        if job['what'] == 'play_practice_session':
            server_when = datetime.strptime(job['when'], '%Y-%m-%dT%H:%M:%S.%fZ')
            scheduler.add_job(dialer.startPracticeSession, 'date', run_date=server_when, args=[job['practice_session']])

        new_jobs_queue.remove(job)
    return True

if __name__ == '__main__':
    app_dir = os.path.dirname(os.path.realpath(__file__))
    filename= app_dir + '/../log/scheduler.log'
    f = open(filename, 'w+')
    f.close()
    logging.basicConfig(
        filename=filename,
        format='%(asctime)s - %(name)s - %(levelname)s: %(message)s', 
        datefmt='%m/%d/%Y %I:%M:%S %p',
        level=logging.DEBUG)
    logging.info('TandemApi Scheduler Started')

    scheduler = BackgroundScheduler()
    scheduler.add_jobstore('mongodb', database="tandem", collection='jobs')
    if len(sys.argv) > 1 and sys.argv[1] == '--clear':
        scheduler.remove_all_jobs()

    scheduler.start()
    print('To clear the alarms, run this example with the --clear argument.')
    print('Press Ctrl+{0} to exit'.format('Break' if os.name == 'nt' else 'C'))

    client = MongoClient('localhost', 27017)
    db = client['tandem']
    new_jobs_queue = db['new_jobs_queue']
 
    try:
        while True:
            time.sleep(2)
            addJobs(new_jobs_queue)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
