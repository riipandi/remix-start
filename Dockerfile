# syntax=docker/dockerfile:1.4

# Arguments with default value (for build).
ARG NODE_ENV=production
ARG NODE_VERSION=20

# -----------------------------------------------------------------------------
# This is base image with `pnpm` package manager
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk update && apk add --no-cache tini curl jq libc6-compat
RUN corepack enable && corepack prepare pnpm@latest-8 --activate
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
WORKDIR /srv

# -----------------------------------------------------------------------------
# Build the application
# -----------------------------------------------------------------------------
FROM base AS builder
COPY --chown=node:node . .
RUN --mount=type=cache,id=cache-pnpm,target=/pnpm/store pnpm install && pnpm build

# -----------------------------------------------------------------------------
# Build the application
# -----------------------------------------------------------------------------
FROM base AS installer
WORKDIR /srv

COPY --from=builder --chown=nonroot:nonroot /srv/package.json ./package.json
COPY --from=builder --chown=nonroot:nonroot /srv/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=nonroot:nonroot /srv/.npmrc ./.npmrc
COPY --from=builder --chown=nonroot:nonroot /srv/public ./public
COPY --from=builder --chown=nonroot:nonroot /srv/build ./build

# Install production dependencies
ENV NODE_ENV $NODE_ENV
RUN --mount=type=cache,id=cache-pnpm,target=/pnpm/store pnpm install \
  --prod --frozen-lockfile --no-optional --ignore-scripts

# This only works when using npm or yarn
# COPY --from=base /usr/local/bin/node-prune /usr/local/bin/node-prune
# RUN /usr/local/bin/node-prune

# -----------------------------------------------------------------------------
# Production image, copy build output files and run the application
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner
LABEL org.opencontainers.image.source="https://github.com/riipandi/remix-start"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG DATABASE_URL

ENV DATABASE_URL $DATABASE_URL

ENV NODE_ENV $NODE_ENV
WORKDIR /srv

# Don't run production as root.
RUN addgroup --system --gid 1001 nonroot && adduser --system --uid 1001 nonroot
RUN corepack enable && corepack prepare pnpm@latest-8 --activate

# Copy built files, spawns command as a child process.
COPY --from=installer --chown=nonroot:nonroot /pnpm /pnpm
COPY --from=installer --chown=nonroot:nonroot /srv /srv
COPY --from=base /sbin/tini /sbin/tini

USER nonroot:nonroot
EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/usr/local/bin/pnpm", "start"]
