#!/bin/bash

set -e

# COLORS
GREEN="\033[32m"
BLUE="\033[36m"
RESET="\033[0m"
RED="\033[0;31m"

log() {
  echo -e "${BLUE}➡️  $1${RESET}"
}

error() {
  echo -e "${RED}❌ $1${RESET}"
}

if [ "$APP_ENV" != "dev" ]; then
  error "This script should only run in 'dev' environment."
  exit 1
fi

# 1. DROP & RECREATE DATABASE (The missing link)
log "Dropping and recreating the database ..."
php bin/console doctrine:database:drop --force --if-exists
php bin/console doctrine:database:create --no-interaction

# 2. REMOVE OLD MIGRATIONS FILES
log "Cleaning migration files ..."
rm -f migrations/*.php || true

# 3. GENERATE MIGRATIONS
echo ➡️ Generating fresh migration ...
php bin/console make:migration --no-interaction # > add "/dev/null" (to not print the output)

# 4. RUN MIGRATIONS
echo ➡️ Executing migrations ...
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

# 5. LOAD FIXTURES
echo ➡️ Loading fixtures ...
php bin/console doctrine:fixtures:load -n --group=load
