# How To

## Setup

### Build/Rebuild services

```bash
docker compose build --no-cache
```

## Run

### Create and start containers

```bash
docker compose up -d --wait

# connect to postgres
docker compose exec -it database psql -U app -d issatex
# OR from host
psql -h localhost -U app -d issatex
```

## URLs

| URL                     | Path             | Language   | Description |
| ----------------------- | ---------------- | ---------- | ----------- |
| http://localhost/docs/  | api/             | PHP        | The API     |
| http://localhost/       | pwa/             | TypeScript | The Next.js |
| http://localhost/admin/ | pwa/pages/admin/ | TypeScript | The Admin   |

## Migration

```bash
php bin/console make:entity

php bin/console make:migration
php bin/console doctrine:migrations:migrate -n

php bin/console doctrine:schema:validate
```

## Mercure

```bash
# From php container
curl -v https://localhost/.well-known/mercure?topic=https://localhost/ordre_fabrications
```

## Fixtures

```bash
# -n: --no-interaction (yes)
php bin/console doctrine:fixtures:load -n --group=load
```

## Certs

```bash
docker cp issatex-php-1:/data/caddy/pki/authorities/local/root.crt api/frankenphp/certs/

docker cp issatex-php-1:/data/caddy/certificates/local/localhost/ api/frankenphp/certs/
docker cp issatex-php-1:/data/caddy/certificates/local/192.168.1.17/ api/frankenphp/certs/192.168.1.17

# Then transfer certs to Android device

# chrome://settings/security -> gérer les certificats -> Importer -> SELECT root.crt

# OK
curl -v https://localhost --insecure
```

## Helpers

```bash
# Displays the dumped data in the console
php bin/console server:dump

# Dump the Autoloader:  Sometimes, Composer's autoloader needs a refresh.
composer dump-autoload

# Clears all the cache items in every pool.
php bin/console cache:clear

# Display current routes
php bin/console debug:router
```

## Endpoints

login: return {token: "..."}

```
curl --insecure \
	-X POST "https://localhost/api/auth/login" \
	-H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin"
  }' | json_pp
```

```bash
curl --insecure \
  -X GET https://localhost/api/users \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDA0OTMyMzcsImV4cCI6MTc0MDQ5NjgzNywicm9sZXMiOlsiUk9MRV9BRE1JTiIsIlJPTEVfVVNFUiJdLCJ1c2VybmFtZSI6ImFkbWluIn0.GQlJwOfo6z2NIaEsndnFm3LnNeqLGcOQ4DL_0M-5hGeKI4KVrc3jxbDx7qQPbeRFkp7reVQbVWfmg6hYrAVwqggnsbB2cRX6kAKEp9D0_mrLvpVTnROBRGWnP-glWndcONlix390hwFcfj6FLoBz7BWbRDi0tepyDqJoyakGtw6fCljRquYkT7N8iwy7-0B247Ezwt6yMxcF4C23nx21uCBdbLznw9slqevw8lxhNGcrQBnNpOlRfu7QwnNdOrnrFAqO9YJS2TcrFuhsKNCz3wWnlCSRslza7SPQs7Hs9VFFKdtG3YQDYm6Qj2FCUw-FvNaKbP0C3j93NuLoRUySEg" \
  | json_pp
```

### Rendements Quotidien

```bash
curl -X 'GET' \
  'http://localhost/api/rendements/2025-01-27?periode=jour' \
  -H 'accept: application/ld+json' \
  | json_pp
```

### Rendements Hebdomadaire

```bash
curl -X 'GET' \
  'http://localhost/api/rendements/2025-01-27?periode=semaine' \
  -H 'accept: application/ld+json' \
  | json_pp
```

### Rendements Mensuel

```bash
curl -X 'GET' \
  'http://localhost/api/rendements/2025-01' \
  -H 'accept: application/ld+json' \
  | json_pp
```

### Rendements Annuel

```bash
curl -X 'GET' \
  'http://localhost/api/rendements/2025' \
  -H 'accept: application/ld+json' \
  | json_pp
```

## PHPUnit Testing

Set testing database name and URI in **.env.test** or **.env.test.local**

```bash
DATABASE_URL="postgresql://app:app@database:5432/issatex_test?serverVersion=16&charset=utf8"
```

Migrate testing database

```bash
php bin/console doctrine:database:create --env=test
php bin/console make:migration --env=test
php bin/console doctrine:migrations:migrate -n --env=test
```

Load fixtures to testing database

```bash
php bin/console doctrine:fixtures:load -n --env=test --group=load
```

running tests

```bash
php bin/phpunit
```
