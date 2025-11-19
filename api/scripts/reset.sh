#!/bin/bash

###############################################################################
# COMPLETLY RESET THE DATABASE AND LOAD FIXTURES FOR THIS PROJECT (Issatex)   #
###############################################################################

set -e  # Stop on first error

# COLORS
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[36m"
RESET="\033[0m"

log() {
  echo -e "${BLUE}➡️  $1${RESET}"
}

success() {
  echo -e "${GREEN}✅ $1${RESET}"
}

warn() {
  echo -e "${YELLOW}⚠️  $1${RESET}"
}

error() {
  echo -e "${RED}❌ $1${RESET}"
  exit 1
}

# CHECK IF DOCKER IS RUNNING
if ! docker info >/dev/null 2>&1; then
  error "Docker is not started."
fi

# CHECK FOR THE php SERVICE EXISTANCE
if ! docker compose ps php >/dev/null 2>&1; then
  error "Service 'php' not found in compose.yml"
fi

# USER CONFIRMATION BEFORE WIPING ALL DATA
warn "Warning: This will DELETE all data and regenerate the DB."
read -p "Confirm ? (yes/no) [no]:" confirm

if [ "$confirm" != "yes" ]; then
  warn "Operation cancelled."
  exit 0
fi

# MIGRATIONS DELETE
log "Removal of old migrations..."
docker compose exec php bash -lc "rm -f migrations/*.php"

# RESET PUBLIC SCHEMA
log "Reset the public PostgreSQL schema..."
docker compose exec database bash -lc "psql -U \$POSTGRES_USER -d \$POSTGRES_DB -c 'DROP SCHEMA public CASCADE;'"
docker compose exec database bash -lc "psql -U \$POSTGRES_USER -d \$POSTGRES_DB -c 'CREATE SCHEMA public;'"

# GENERATING MIGRATIONS
log "Generation of new migrations..."
docker compose exec php php bin/console make:migration --no-interaction

# EXECUTE MIGRATIONS
log "Executing migrations..."
docker compose exec php php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

# LOADING FIXTURES
log "Loading fixtures..."
docker compose exec php php bin/console doctrine:fixtures:load -n --group=load

# END
success "Database successfully reset ! 🎉"
