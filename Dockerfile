# -----------------------------------------------------------------------------
# Build dependencies
# -----------------------------------------------------------------------------
FROM node:lts-alpine AS deps
WORKDIR /app
COPY . .
RUN npm config set fund false
RUN npm install --prefer-offline --no-audit --progress=false
RUN npm run build

# -----------------------------------------------------------------------------
# Rebuild the source code only when needed
# -----------------------------------------------------------------------------
FROM deps AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/package-lock.json ./package-lock.json
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/public ./public
COPY --from=deps /app/build ./build
RUN rm -f /app/pnpm-lock.yaml
RUN npm ci --omit=dev --progress=false
RUN npm run prisma generate

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
ENV PORT=3000

# Add shortcut for connecting to database CLI. Remove this line if using PostgreSQL.
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app
COPY --from=deps --chown=nodejs:nodejs /app/entrypoint.sh /app/entrypoint.sh
COPY --from=builder --chown=nodejs:nodejs /app/package-lock.json ./package-lock.json
COPY --from=builder --chown=nodejs:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=nodejs:nodejs /app/prisma /app/prisma
COPY --from=builder --chown=nodejs:nodejs /app/public /app/public
COPY --from=builder --chown=nodejs:nodejs /app/build /app/build

USER nodejs
EXPOSE $PORT

ENTRYPOINT [ "./entrypoint.sh" ]
