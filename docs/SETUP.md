# Issatex

A modern textile manufacturing CAPM application built with:

- ⚙️ API Platform (Symfony) — backend API
- ⚛️ Next.js (PWA) — frontend & admin UI
- 🐳 Docker — development & production environment
- 📡 Mercure — real-time updates
- 🗄 PostgreSQL — database

## 📋 Prerequisites

- Docker >= 29
- Docker Compose >= 2.9
- Git

## 🏗 Project Structure

```bash
issatex/
├── api/        # Symfony API Platform
├── pwa/        # Next.js frontend
├── compose.yaml
└── ...
```

## 🚀 Quick Start

1. Clone repository

```bash
git clone https://github.com/MarwenTlili/issatex
cd issatex
```

2. Create local env file (dev only)

```bash
cp .env .env.development.local
```

3. Generate secrets

Generate application secrets with `openssl rand -base64 32`

example:

```bash
# issatex/.env.development.local
CADDY_MERCURE_JWT_SECRET=

# issatex/api/.env.dev.local
APP_SECRET=
MERCURE_JWT_SECRET=
JWT_PASSPHRASE=

# issatex/pwa/.env.development.local
NEXTAUTH_SECRET=
```

4. Build containers

```bash
docker compose --env-file .env.development.local build --no-cache
```

5. Start services

```bash
docker compose --env-file .env.development.local up -d --wait
```

6. Initialize database (if needed)

Init/Reset DB: drop + create + migrate + load fixtures

```bash
# From host
docker compose exec php bash -lc "make reset"

# OR

# From php container
./scripts/reset.sh
```

## 🌐 Access the Application

| Service  | URL                      |
| -------- | ------------------------ |
| Frontend | https://localhost/       |
| API Docs | https://localhost/docs/  |
| Admin    | https://localhost/admin/ |

JWT endpoints

| Service                  | URL                                    | Body                                                       |
| ------------------------ | -------------------------------------- | ---------------------------------------------------------- |
| login                    | https://localhost/api/token/login      | {"username": "{{IDENTIFIER}}", "password": "{{PASSWORD}}"} |
| refresh token            | https://localhost/api/token/refresh    | {"refresh_token": "..."}                                   |
| invalidate refresh token | https://localhost/api/token/invalidate | {"refresh_token": "..."}                                   |

> ⚠️ Uses self-signed HTTPS certificates (see below if needed)

## 🐳 Docker Usage

Build

```bash
# dev
docker compose --env-file .env.development.local build --no-cache
# re-build only one service
docker compose --env-file .env.development.local build --no-cache php

# prod
docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml build --no-cache
```

Start / Stop

```bash
# dev
docker compose --env-file .env.development.local up -d --wait
docker compose --env-file .env.development.local down

# prod
docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml up -d --wait
docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml down
```

Logs

```bash
docker compose --env-file .env.development.local logs -f
docker compose --env-file .env.development.local logs -f php
```

## ⚙️ Backend (Symfony / API Platform)

```bash
docker compose exec -it php bash
```

Common Commands

```bash
# Create entity
php bin/console make:entity

# Migrations
php bin/console make:migration
php bin/console doctrine:migrations:migrate -n

# Fixtures
php bin/console doctrine:fixtures:load -n

# Cache
php bin/console cache:clear

# Debug
php bin/console debug:dotenv
php bin/console debug:container --env-vars
php bin/console debug:router
```

## 📡 API Usage

> ⚠️ Use --insecure because HTTPS is self-signed locally.

Login

```bash
curl --insecure \
  -X POST https://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "<email>",
    "password": "<password>"
  }'
```

Authenticated Request

```bash
curl --insecure \
  https://localhost/api/users \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## 📊 Example Endpoints

```bash
# Daily
curl --insecure https://localhost/api/rendements/2025-01-27?periode=jour

# Weekly
curl --insecure https://localhost/api/rendements/2025-01-27?periode=semaine

# Monthly
curl --insecure https://localhost/api/rendements/2025-01

# Yearly
curl --insecure https://localhost/api/rendements/2025
```

## 📡 Real-time (Mercure)

```bash
curl -v --insecure \
  "https://localhost/.well-known/mercure?topic=https://localhost/ordre_fabrications"
```

## 🗄 Database

```bash
# Inside the container
docker compose exec database psql -U app -d issatex

# From host
psql -h localhost -U app -d issatex
```

## 🧪 Testing

Configure

```bash
DATABASE_URL="postgresql://app:app@database:5432/issatex_test?serverVersion=16&charset=utf8"
```

Setup

```bash
docker compose exec php php bin/console doctrine:database:create --env=test
docker compose exec php php bin/console doctrine:migrations:migrate --env=test -n
docker compose exec php php bin/console doctrine:fixtures:load --env=test -n
```

Run

```bash
docker compose exec php php bin/phpunit
```

## 🔐 HTTPS (Local Development)

This project uses self-signed certificates via Caddy.

```bash
docker compose cp php:/data/caddy/pki/authorities/local/root.crt api/frankenphp/certs/

# chrome://certificate-manager/-> Custom-> (Trusted Certificates) import -> select root.crt-> restart chrome
# about:preferences#privacy ->Certificats -> View Certificates -> (Authorities) import -> select root.crt
```

Install (Chrome)

- **Open**: chrome://settings/security
- **Manage certificates** → Import root.crt

Android

- Transfer certificate
- Install as trusted credential

## 🌍 Environments

| Environment | File                   |
| ----------- | ---------------------- |
| Development | .env.development.local |
| Testing     | .env.test              |
| Production  | .env.production.local  |

## 📄 License

MIT
