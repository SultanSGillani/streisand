build:
	docker-compose build

up:
	docker-compose up -d

up-non-daemon:
	docker-compose up

start:
	docker-compose start

stop:
	docker-compose stop

restart:
	docker-compose stop && docker-compose start

shell-api:
	docker exec -ti jumpcut_api_1 bash

shell-db:
	docker exec -ti jumpcut_db_1 bash

log-api:
	docker-compose logs api  

log-postgres:
	docker-compose logs postgres

log-frontend:
	docker-compose logs frontend
