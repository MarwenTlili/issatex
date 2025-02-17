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
php bin/console doctrine:migrations:migrate

php bin/console doctrine:schema:validate
```

## Mercure

```bash
# From php container
curl -v https://localhost/.well-known/mercure?topic=https://localhost/ordre_fabrications
```

## Fixtures

```bash
php bin/console doctrine:fixtures:load --group=load
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

### Rendements Quotidien

```bash
curl -X 'GET' \
  'http://localhost/rendements/2025-01-27?periode=jour' \
  -H 'accept: application/ld+json' \
  | json_pp
```

### Rendements Hebdomadaire

```bash
curl -X 'GET' \
  'http://localhost/rendements/2025-01-27?periode=semaine' \
  -H 'accept: application/ld+json' \
  | json_pp
```

### Rendements Mensuel

```bash
curl -X 'GET' \
  'http://localhost/rendements/2025-01' \
  -H 'accept: application/ld+json' \
  | json_pp
```

### Rendements Annuel

```bash
curl -X 'GET' \
  'http://localhost/rendements/2025' \
  -H 'accept: application/ld+json' \
  | json_pp
```
