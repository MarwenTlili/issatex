# Issatex

A modern textile manufacturing CAPM application built with:

- ⚙️ API Platform (Symfony) — backend API
- ⚛️ Next.js (PWA) — frontend & admin UI
- 🐳 Docker — development & production environment
- 📡 Mercure — real-time updates
- 🗄 PostgreSQL — database

## 📋 Prerequisites

- Docker >= 29
- Git

## 🏗 Project Structure

```bash
issatex/
├── api/            # API Platform (Symfony)
├── pwa/            # Next.js frontend
├── compose.yaml
└── ...
```

> `.env` contains safe committed defaults only.  
> Sensitive values must be stored in `.env.*.local`.

## 🚀 Quick Start (Development Only)

```bash
# 1. Clone the project & navigate into it
git clone https://github.com/MarwenTlili/issatex
cd issatex

# 2. Build docker containers
docker compose build --no-cache

# 3. Start docker services
docker compose up -d --wait

# 4. Initialize database, migrations, and fixtures
docker compose exec php bash scripts/reset.sh
```

## 🐳 Docker Usage

### Production

Build / Start / Stop

```bash
docker compose \
  --env-file .env.production.local \
  -f compose.yaml -f compose.prod.yaml \
  build --no-cache

docker compose \
  --env-file .env.production.local \
  -f compose.yaml -f compose.prod.yaml \
  up -d --wait

docker compose \
  --env-file .env.production.local \
  -f compose.yaml -f compose.prod.yaml \
  down
```

Initialize the admin user

```bash
docker compose exec php php bin/console app:create-admin \
  --email=admin@example.com \
  --username=admin \
  --password='admin'
```

## ⚙️ Common Commands

### Backend (Symfony)

Execute commands inside the running PHP container:

```bash
# Enter the PHP container's terminal
docker compose exec php bash

# --- Run these inside the container ---

# Create entity
php bin/console make:entity

# Migrations
php bin/console make:migration
php bin/console doctrine:migrations:migrate -n

# Fixtures
php bin/console doctrine:fixtures:load -n

# Cache
php bin/console cache:clear

# Debugging
printenv
php bin/console debug:dotenv
php bin/console debug:dotenv --env=test
php bin/console debug:container --env-vars
php bin/console debug:router
```

### Database (PostgreSQL)

```bash
# Connect inside the container
docker compose exec database psql -U app -d issatex

# Connect from the host machine (requires psql client installed locally)
psql -h localhost -p 5433 -U app -d issatex
```

## 🧪 Testing

### Configure

Create the test environment configuration if it doesn't exist:

```bash
# api/.env.test.local
JWT_PASSPHRASE="!ChangeThisJWTPassphrase!"
```

### Setup & Run

Execute the testing suite inside the PHP container:

```bash
docker compose exec php bash

# Inside the container:
php bin/console doctrine:database:create --env=test
php bin/console doctrine:migrations:migrate --env=test -n
php bin/console doctrine:fixtures:load --env=test -n

# Run the test suite
php bin/phpunit
```

## 🔐 HTTPS (Local Development)

This project uses self-signed certificates via Caddy.

```bash
docker compose cp php:/data/caddy/pki/authorities/local/root.crt \
	api/frankenphp/certs/

# chrome://certificate-manager/localcerts/usercerts
```

## 🌐 Access the Application

| Service         | URL                     |
| --------------- | ----------------------- |
| Frontend        | https://localhost       |
| API Docs        | https://localhost/docs  |
| Admin Dashboard | https://localhost/admin |

JWT endpoints

| Service                  | URL                                    | Body                                                       |
| ------------------------ | -------------------------------------- | ---------------------------------------------------------- |
| login                    | https://localhost/api/token/login      | {"username": "{{IDENTIFIER}}", "password": "{{PASSWORD}}"} |
| refresh token            | https://localhost/api/token/refresh    | {"refresh_token": "..."}                                   |
| invalidate refresh token | https://localhost/api/token/invalidate | {"refresh_token": "..."}                                   |

## 📡 API Usage

```bash
# 1. Login to retrieve the JWT token
curl --insecure \
  -X POST https://localhost/api/token/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin","password": "admin"}'

# 2. Make an authenticated request
curl --insecure \
  https://localhost/api/machines \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## 📊 Example Endpoints

```bash
# Daily Performance
curl --insecure https://localhost/api/rendements/2025-01-27?periode=jour

# Weekly Performance
curl --insecure https://localhost/api/rendements/2025-01-27?periode=semaine

# Monthly Performance
curl --insecure https://localhost/api/rendements/2025-01

# Yearly Performance
curl --insecure https://localhost/api/rendements/2025
```

## 📄 License

MIT
