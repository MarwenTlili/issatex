# 🛠️ Troubleshooting

## Error: JWT Encoding Failure

> An error occurred while trying to encode the JWT token. Please verify your configuration (private key/passphrase) (500 Internal Server Error)

This typically happens when the .pem files in config/jwt/ were encrypted with a different passphrase than the one currently defined in your JWT_PASSPHRASE environment variable (common after a docker compose down -v).

✅ Solution

Regenerate Keys
Run these commands inside the PHP container to sync the keys with your current environment:

⚠️ Don't do this in **production** environment, otherwise every single JWT token currently held by your users will instantly become invalid.

```bash
# Enter the container
docker compose exec php

# Force regenerate keys using the current JWT_PASSPHRASE
php bin/console lexik:jwt:generate-keypair --overwrite
php bin/console lexik:jwt:generate-keypair --overwrite --env=test

# (Optional) Fix permissions to ensure the web server can read them
# Recommanded permissions are 600 or 640
setfacl -R -m u:www-data:rX config/jwt
```

🔍 Verification

To verify that the keys match your environment variable, run:

```bash
openssl rsa -in config/jwt/private.pem -check -passin "pass:JWT_PASSPHRASE"
```

If successful, the first line of output will be: `RSA key ok`.

## There is 1 other session using the database.

> An exception occurred while executing a query: SQLSTATE[55006]: Object in use: 7 ERROR: database "issatex" is being accessed by other users

✅ Solution

```bash
docker compose exec database psql -U app -d postgres -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'issatex' AND pid <> pg_backend_pid();"
```
