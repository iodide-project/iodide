.PHONY: build shell up flake8 test

build:
	npm install
	npm run build
	docker build -t app:build .

root-shell:
	docker-compose run -u 0 server bash

shell:
	docker-compose run server bash

up:
	docker-compose up

flake8:
	docker-compose run server flake8 server/

test:
	docker-compose run server py.test
