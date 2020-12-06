@DDAPI_TODO_SECRET = $(shell openssl rand -base64 32)

start: createenv startcontainers

createenv:
ifeq (,$(wildcard ./.env))
	@echo "DDAPI_TODO_SECRET=$(DDAPI_TODO_SECRET)" >> .env
	@echo "DDAPI_TODO_DB=$(shell pwd)/backend/todo.db" >> .env
	@echo "DDAPI_TODO_ISS=todo.ddapi.localhost" >> .env
	@echo "REACT_APP_BACKEND_URL=http://localhost:8080" >> .env
endif
.PHONY: createenv

startcontainers:
	@docker-compose up -d
.PHONY: startcontainers