.PHONY: build shell up

build:
	npm install
	npm run build-server
	docker-compose build

shell:
	docker-compose run server bash

up:
	docker-compose up

flake8:
	docker-compose run server flake8 server/
