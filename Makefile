.PHONY: build shell up flake8 test

build:
	npm install
	npm run build
	docker-compose build

shell:
	docker-compose run server bash

up:
	docker-compose up

flake8:
	docker-compose run server flake8 server/

test:
	docker-compose run server py.test
