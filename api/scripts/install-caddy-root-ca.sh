#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# 1. Ensure the local directory exists
mkdir -p api/frankenphp/certs/

# 2. Copy the root cert from the running PHP container
# (Added a fallback name just in case)
docker compose cp php:/data/caddy/pki/authorities/local/root.crt api/frankenphp/certs/caddy-root.crt

# 3. Copy to Debian's system-wide CA directory with the mandatory .crt extension
sudo cp api/frankenphp/certs/caddy-root.crt /usr/local/share/ca-certificates/caddy-root.crt

# 4. Inject the Caddy certificate into your local Chrome/Chromium profile database:
certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "Caddy Local Root CA" -i api/frankenphp/certs/caddy-root.crt

# 5. Trigger Debian to rebuild the trusted certificate store
sudo update-ca-certificates

echo "✅ Success! Root CA updated successfully."

# Veriry
# certutil -d sql:$HOME/.pki/nssdb -L

# Uninstall

# 1. Remove the certificate file you copied
# sudo rm /usr/local/share/ca-certificates/caddy-root.crt

# 2. Update the system store to remove it from the trusted list
# sudo update-ca-certificates --fresh
