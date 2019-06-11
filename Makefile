.PHONY: build root-shell shell dbshell up lint lintfix test

build:
	npm install
	npm run build
	docker build -t app:build .

root-shell:
	docker-compose exec -u 0 server bash

shell:
	docker-compose exec server bash

dbshell:
	docker-compose exec server bash -c "./manage.py dbshell"

up:
	docker-compose up

lint:
	docker-compose run server ./bin/lint-check.sh

lintfix:
	docker-compose run server ./bin/lint-fix.sh

test:
	docker-compose run server ./manage.py collectstatic -c --no-input
	docker-compose run server py.test
