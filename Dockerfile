# -----------------------------------------------------------------------------
# Build dependencies
# -----------------------------------------------------------------------------
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# -----------------------------------------------------------------------------
# Rebuild the source code only when needed
# -----------------------------------------------------------------------------
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn prisma generate
RUN yarn build

# -----------------------------------------------------------------------------
# Production image, copy all the files and run the application
# -----------------------------------------------------------------------------
FROM node:16-alpine AS runner
LABEL org.opencontainers.image.source="https://github.com/riipandi/prismix"

ENV DATABASE_URL="file:/data/sqlite.db"
ENV NODE_ENV=production
ENV PORT=3080

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

COPY --from=builder --chown=nodeuser:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=nodeuser:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=nodeuser:nodejs /app/entrypoint.sh /app/entrypoint.sh
COPY --from=builder --chown=nodeuser:nodejs /app/build /app/build
COPY --from=builder --chown=nodeuser:nodejs /app/public /app/public
COPY --from=builder --chown=nodeuser:nodejs /app/prisma /app/prisma

USER nodeuser
EXPOSE $PORT

ENTRYPOINT [ "./entrypoint.sh" ]
