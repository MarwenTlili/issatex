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
psql -h localhost -U app -d issatex
# OR
docker compose exec -it database bash
psql -U app -d issatex
```

## URLs

| URL                         | Path             | Language   | Description |
| --------------------------- | ---------------- | ---------- | ----------- | ----------- |
| http://localhost:8080/docs/ | api/             | PHP        | The API     |
| http://localhost/           | pwa/             | TypeScript | The Next.js | application |
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
php bin/console doctrine:fixtures:load
```

## Helpers
```bash
php bin/console server:dump
php bin/console cache:clear
```
