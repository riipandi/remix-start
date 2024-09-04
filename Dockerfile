# syntax=docker/dockerfile:1.4

# Arguments with default value (for build).
ARG PLATFORM=linux/amd64
ARG NODE_ENV=production
ARG NODE_VERSION=20

# -----------------------------------------------------------------------------
# Base image with pnpm package manager.
# -----------------------------------------------------------------------------
FROM --platform=${PLATFORM} node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH" COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV LEFTHOOK=0 CI=true PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true
RUN corepack enable && corepack prepare pnpm@latest-9 --activate
WORKDIR /srv

# -----------------------------------------------------------------------------
# Install dependencies and some toolchains.
# -----------------------------------------------------------------------------
FROM base AS builder

# Copy the source files
COPY --chown=node:node . .

RUN apk update && apk add --no-cache tini jq libc6-compat
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --ignore-scripts && pnpm build

# -----------------------------------------------------------------------------
# Compile the application and install production only dependencies.
# -----------------------------------------------------------------------------
FROM base AS pruner
ENV NODE_ENV $NODE_ENV

COPY --from=builder /srv/.npmrc /srv/.npmrc
COPY --from=builder /srv/package.json /srv/package.json
COPY --from=builder /srv/pnpm-lock.yaml /srv/pnpm-lock.yaml
COPY --from=builder /srv/build/client /srv/build/client
COPY --from=builder /srv/build/server /srv/build/server

# Install production dependencies and cleanup node_modules.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install \
    --prod --frozen-lockfile --ignore-scripts && pnpm prune \
    --prod && pnpm dlx clean-modules clean --yes

# -----------------------------------------------------------------------------
# Production image, copy build output files and run the application.
# -----------------------------------------------------------------------------
FROM base AS runner
LABEL org.opencontainers.image.source="https://github.com/riipandi/remix-start"

# ----- Read application environment variables --------------------------------

ARG APP_BASE_URL APP_SECRET_KEY APP_LOG_LEVEL DATABASE_URL \
    SMTP_HOST SMTP_PORT SMTP_USERNAME SMTP_PASSWORD SMTP_EMAIL_FROM

ENV APP_BASE_URL=$APP_BASE_URL \
    APP_SECRET_KEY=$APP_SECRET_KEY \
    APP_LOG_LEVEL=$APP_LOG_LEVEL \
    DATABASE_URL=$DATABASE_URL \
    SMTP_HOST=$SMTP_HOST \
    SMTP_PORT=$SMTP_PORT \
    SMTP_USERNAME=$SMTP_USERNAME \
    SMTP_PASSWORD=$SMTP_PASSWORD \
    SMTP_EMAIL_FROM=$SMTP_EMAIL_FROM

# ----- Read application environment variables --------------------------------

# Don't run production as root.
RUN addgroup --system --gid 1001 nonroot && adduser --system --uid 1001 nonroot

# Copy the build output files from the pruner stage.
COPY --chown=nonroot:nonroot --from=pruner /pnpm /pnpm
COPY --chown=nonroot:nonroot --from=pruner /srv /srv

# Copy some utilities from builder image.
COPY --from=builder /sbin/tini /sbin/tini

# Define the host and port to listen on.
ENV NODE_ENV=$NODE_ENV HOST=0.0.0.0 PORT=3000

USER nonroot:nonroot
EXPOSE $PORT

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/usr/local/bin/pnpm", "start"]
