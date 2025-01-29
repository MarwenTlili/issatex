# Issatex PWA (NextJS)

## How To

## PNPM

# PNPM
```bash
pnpm ls -g
pnpm store prune
pnpm install
pnpm audit
pnpm list --depth=1
pnpm run build
```

### React Admin

```bash
# Add php to trusted hosts in project/.env
TRUSTED_HOSTS=localhost|php

# Requirements
pnpm add react-admin
pnpm add @api-platform/api-doc-parser
pnpm add @emotion/react @emotion/styled
pnpm add @mui/material@5.16.14
pnpm add @mui/icons-material@5.16.14

pnpm add react-time-picker

# Remove Requirements
pnpm rm react-admin
pnpm rm @api-platform/api-doc-parser
pnpm rm @emotion/react @emotion/styled
pnpm rm @mui/system
pnpm rm @mui/material 
pnpm rm @mui/icons-material

# Generate resource
pnpm create @api-platform/client --resource presence -g next
```
