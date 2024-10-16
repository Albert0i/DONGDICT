#
# Import and expose environment variables
#
cnf ?= .env
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

#
# Main
#
.PHONY: help prune config my-ciapp

help:
	@echo
	@echo "Usage: make TARGET"
	@echo
	@echo "NodeJS Dockerize project automation helper for Windows version 1.0"
	@echo
	@echo "Targets:"
	@echo "	build		build app image"
	@echo "	up  		start the app"
	@echo "	down 		stop the app"	
	@echo "	ps 		show running containers"
	@echo "	logs		app logs"
	@echo "" 
	@echo "	cmd		start cmd on app"
	@echo "	config		edit configuration"

#
# build app image
#
build:
	docker-compose build

#
# start the app
#
up:
	docker-compose up -d --remove-orphans

#
# stop the app
#
down:
	docker-compose down -v

#
# show running containers 
#
ps:
	docker-compose ps

#
# app logs
#
logs:
	docker-compose logs

#
# start cmd on app
#
cmd:
	docker-compose exec app cmd

#
# edit configuration
#
config:
	nano .env

#
# EOF (2024/10/18)
#
