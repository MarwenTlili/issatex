# Default shell
SHELL := /bin/bash

# Prompt Colors
GREEN  := $(shell printf "\033[0;32m")
BLUE   := $(shell printf "\033[0;36m")
YELLOW := $(shell printf "\033[1;33m")
RED    := $(shell printf "\033[0;31m")
RESET  := $(shell printf "\033[0m")

# Backend & Frontend Services
PHP ?= php
PWA ?= pwa

COMPOSE := docker compose

# Production Compose Wrapper (DRY Optimization)
DOCKER_PROD := $(COMPOSE) --env-file .env.production.local -f compose.yaml -f compose.prod.yaml

# Helpers
log     = @printf "$(BLUE)➡️  $(1)$(RESET)\n"
success = @printf "$(GREEN)✅ $(1)$(RESET)\n"
warn    = @printf "$(YELLOW)⚠️  $(1)$(RESET)\n"
error   = @printf "$(RED)❌ $(1)$(RESET)\n"

.PHONY: \
	reset \
	build build-no-cache build-prod build-prod-% build-prod-no-cache-% \
	up test-db-init test-php up-prod \
	create-admin-prod \
	regenerate-jwt-keypair copy-cert logs php pwa \
	down down-v down-prod

###############################################################################
# RESET DATABASE
###############################################################################

reset:
	@$(call warn,This will DELETE all data and recreate the database.)
	@read -p "Confirm ? (y/n) [n]: " confirm; \
	if [ "$$confirm" != "y" ]; then \
		printf "$(RED)❌ Aborted.$(RESET)\n"; \
		exit 1; \
	fi;

	@$(call log,Closing active connections ...)
	$(COMPOSE) exec database psql -U app -d postgres -c " \
	SELECT pg_terminate_backend(pid) \
	FROM pg_stat_activity \
	WHERE datname = 'issatex' AND pid <> pg_backend_pid();"

	@$(call log,Running reset inside PHP container ...)
	$(COMPOSE) exec $(PHP) sh scripts/reset.sh

	@$(call success,Database successfully reset 🎉)

###############################################################################
# OPTIONAL: QUICK COMMANDS
###############################################################################

build:
	$(COMPOSE) build

build-no-cache:
	$(COMPOSE) build --no-cache

build-prod:
	$(DOCKER_PROD) build

build-prod-no-cache:
	$(DOCKER_PROD) build --no-cache

build-prod-%:
	$(DOCKER_PROD) build $*

build-prod-no-cache-%:
	$(DOCKER_PROD) build --no-cache $*

up:
	$(COMPOSE) up -d --wait --remove-orphans

test-db-init:
	$(COMPOSE) exec $(PHP) sh -c '\
		php bin/console doctrine:database:drop --force --if-exists --env=test && \
		php bin/console doctrine:database:create --env=test && \
		php bin/console doctrine:migrations:migrate --env=test -n && \
		php bin/console doctrine:fixtures:load --env=test -n

test-php:
	$(COMPOSE) exec $(PHP) php bin/phpunit

up-prod:
	$(DOCKER_PROD) up -d --wait --remove-orphans

create-admin-prod:
	$(DOCKER_PROD) exec $(PHP) \
		php bin/console app:create-admin \
		--email=admin@example.com \
		--username=admin \
		--password='admin'

regenerate-jwt-keypair:
	$(COMPOSE) exec $(PHP) \
		php bin/console lexik:jwt:generate-keypair --overwrite

copy-caddy-root-ca:
	mkdir -p api/frankenphp/certs
	$(COMPOSE) cp $(PHP):/data/caddy/pki/authorities/local/root.crt \
		api/frankenphp/certs/caddy-root.crt

install-caddy-root-ca:
	./api/scripts/install-caddy-root-ca.sh 

logs:
	$(COMPOSE) logs -f

php:
	$(COMPOSE) exec $(PHP) bash

pwa:
	$(COMPOSE) exec $(PWA) sh

down:
	$(COMPOSE) down --remove-orphans

down-v:
	$(COMPOSE) down -v

down-prod:
	$(DOCKER_PROD) down
