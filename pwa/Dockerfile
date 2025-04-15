#syntax=docker/dockerfile:1

# Versions
FROM node:20.19-alpine AS node_upstream

# Base stage for dev and build
FROM node_upstream AS base

# Install required dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /srv/app

RUN npm install -g corepack@latest && \
    corepack enable && \
    corepack prepare --activate pnpm@latest-10 && \
    pnpm config -g set store-dir /.pnpm-store

# Learn more here: https://nextjs.org/telemetry
# Delete the following line in case you want to enable telemetry during dev and build.
ENV NEXT_TELEMETRY_DISABLED=1

# Development image
FROM base AS dev

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=localhost

CMD ["sh", "-c", "pnpm install; pnpm dev"]

# Builder stage
FROM base AS builder

COPY --link pnpm-lock.yaml ./
RUN pnpm fetch --prod

COPY --link . .

RUN pnpm install --frozen-lockfile --offline --prod && \
    pnpm run build

# Production image
FROM node_upstream AS prod

WORKDIR /srv/app

ENV NODE_ENV=production
# Delete the following line in case you want to enable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs; \
    adduser --system --uid 1001 nextjs

COPY --from=builder --link /srv/app/public ./public

# Set correct permissions
RUN mkdir -p .next && chown -R nextjs:nodejs .next

# Copy built Next.js app
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --link --chown=1001:1001 /srv/app/.next/standalone ./
COPY --from=builder --link --chown=1001:1001 /srv/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
