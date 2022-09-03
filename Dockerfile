# -----------------------------------------------------------------------------
# Build dependencies
# -----------------------------------------------------------------------------
FROM node:16-alpine AS deps
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# -----------------------------------------------------------------------------
# Rebuild the source code only when needed
# -----------------------------------------------------------------------------
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/public ./public
COPY --from=deps /app/build ./build
RUN pnpm install --production
RUN pnpm run prisma generate

# -----------------------------------------------------------------------------
# Production image, copy all the files and run the application
# -----------------------------------------------------------------------------
FROM node:16-alpine AS runner
LABEL org.opencontainers.image.source="https://github.com/riipandi/prismix"

ARG DATABASE_URL
ARG SESSION_SECRET
ENV DATABASE_URL $DATABASE_URL
ENV SESSION_SECRET $SESSION_SECRET
ENV NODE_ENV=production
ENV PORT=3080

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

COPY --from=deps --chown=nodeuser:nodejs /app/entrypoint.sh /app/entrypoint.sh
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=nodeuser:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=nodeuser:nodejs /app/prisma /app/prisma
COPY --from=builder --chown=nodeuser:nodejs /app/public /app/public
COPY --from=builder --chown=nodeuser:nodejs /app/build /app/build

USER nodeuser
EXPOSE $PORT

ENTRYPOINT [ "./entrypoint.sh" ]
