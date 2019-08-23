.PHONY: build build-prod root-shell shell dbshell up lint lintfix test

build:
	npm install
	npm run build
	DOCKER_BUILDKIT=1 docker build -t app:build --build-arg APP_ENV=dev .

build-prod:
	npm install
	npm run-script build-production
	DOCKER_BUILDKIT=1 docker build -t app:build --build-arg APP_ENV=prod .

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
	docker-compose run server ./manage.py collectstatic -c --no-input
	docker-compose run server ./manage.py check
	docker-compose run server py.test
