web: gunicorn server.wsgi
worker_beat: celery beat -A server
worker: celery -A server worker

release: ./bin/pre_deploy
