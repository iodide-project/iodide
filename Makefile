.PHONY: build shell up flake8 test

build:
	npm install
	npm run build
	docker build -t app:build .

root-shell:
	docker-compose exec -u 0 server bash

shell:
	docker-compose exec server bash

up:
	docker-compose up

lint:
	docker-compose run server ./bin/lint-check.sh

lintfix:
	docker-compose run server ./bin/lint-fix.sh

test:
	docker-compose run server py.test
