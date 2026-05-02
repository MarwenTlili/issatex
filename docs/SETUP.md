# Issatex

A modern textil's CAPM application built with:

- ⚙️ API Platform (Symfony) — backend API
- ⚛️ Next.js (PWA) — frontend & admin UI
- 🐳 Docker — development & production environment
- 📡 Mercure — real-time updates
- 🗄 PostgreSQL — database

## 🚀 Quick Start

```bash
git clone https://github.com/MarwenTlili/issatex
cd issatex

# Setup environment
cp .env .env.development.local

# use "openssl rand -base64 32" to generate SECRETs and place them in your 
# .env.<environment>.local

# Start application
docker compose --env-file .env.development.local up -d --build --no-cache

# Init/Reset DB
docker compose exec php bash -lc make reset
```

## 🌐 Access the Application

| Service  | URL                      |
| -------- | ------------------------ |
| API Docs | https://localhost/docs/  |
| Frontend | https://localhost/       |
| Admin    | https://localhost/admin/ |

> ⚠️ Uses self-signed HTTPS certificates (see below if needed)

## 🐳 Docker Usage

Build

```bash
# dev
docker compose --env-file .env.development.local build --no-cache

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
docker compose logs -f
docker compose logs -f php
```

Full Reset

```bash
docker compose down -v
docker compose --env-file .env.development.local up -d --build
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
docker compose exec php php bin/console doctrine:migrations:migrate -n --env=test
```

Run

```bash
docker compose exec php php bin/phpunit
```

## 🔐 HTTPS (Local Development)

This project uses self-signed certificates via Caddy.

```bash
docker cp issatex-php-1:/data/caddy/pki/authorities/local/root.crt api/frankenphp/certs/

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
