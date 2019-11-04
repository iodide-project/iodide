.PHONY: build root-shell shell dbshell up lint lintfix test

build:
	npm install
	npm run build
	docker-compose build

root-shell:
	docker-compose run --rm -u 0 server bash

shell:
	docker-compose run --rm server bash

dbshell:
	docker-compose run --rm server bash -c "./manage.py dbshell"

up:
	docker-compose up

lint:
	docker-compose run --rm server ./bin/lint-check.sh

lintfix:
	docker-compose run --rm server ./bin/lint-fix.sh

test:
	docker-compose run --rm server tests

pip-compile:
	docker-compose run --rm server -- pip-compile --verbose --upgrade --generate-hashes -o requirements/build.txt requirements/build.in
	docker-compose run --rm server -- pip-compile --verbose --upgrade --generate-hashes -o requirements/tests.txt requirements/tests.in
