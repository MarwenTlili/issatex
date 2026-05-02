# Default shell
SHELL := /bin/bash

# Prompt Colors
GREEN  := $(shell printf "\033[0;32m")
BLUE   := $(shell printf "\033[0;36m")
YELLOW := $(shell printf "\033[1;33m")
RED    := $(shell printf "\033[0;31m")
RESET  := $(shell printf "\033[0m")

# Backend Service
PHP ?= php

# Helpers
log     = @printf "$(BLUE)➡️  $(1)$(RESET)\n"
success = @printf "$(GREEN)✅ $(1)$(RESET)\n"
warn    = @printf "$(YELLOW)⚠️  $(1)$(RESET)\n"
error   = @printf "$(RED)❌ $(1)$(RESET)\n"

.PHONY: reset up down logs bash

###############################################################################
# RESET DATABASE
###############################################################################

reset:
	@$(call warn,This will DELETE all data and regenerate the DataBase.)
	@read -p "Confirm ? (y/n) [n]: " confirm; \
	if [ "$$confirm" != "y" ]; then \
		printf "$(RED)❌ Aborted.$(RESET)\n"; \
		exit 1; \
	fi;

	@$(call log,Running reset inside PHP container ...)
	docker compose exec $(PHP) bash scripts/reset.sh
	@$(call success,Database successfully reset 🎉)

###############################################################################
# OPTIONAL: QUICK COMMANDS
###############################################################################

bash:
	docker compose exec $(PHP) bash

logs:
	docker compose logs -f

up:
	docker compose up -d

down:
	docker compose down

ps:
	docker compose ps
