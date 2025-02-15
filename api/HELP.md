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

| URL                         | Path             | Language   | Description |
| --------------------------- | ---------------- | ---------- | ----------- |
| http://localhost:8080/docs/ | api/             | PHP        | The API     |
| http://localhost/           | pwa/             | TypeScript | The Next.js |
| http://localhost/admin/     | pwa/pages/admin/ | TypeScript | The Admin   |

## Migration

```bash
php bin/console make:entity

php bin/console make:migration
php bin/console doctrine:migrations:migrate

php bin/console doctrine:schema:validate
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

---

## Curl

```bash
curl -X 'GET' \
  'http://localhost:8080/rendements_par_ilots/2025-02-03' \
  -H 'accept: application/ld+json' \
  | json_pp
```
