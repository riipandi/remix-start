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
RUN npx prisma generate

# -----------------------------------------------------------------------------
# Production image, copy all the files and run the application
# -----------------------------------------------------------------------------
FROM node:lts-alpine AS runner
LABEL org.opencontainers.image.source="https://github.com/riipandi/prismix"

ARG APP_URL
ARG DATABASE_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG SESSION_SECRET
ARG SESSION_STORAGE=cookies
ARG SMTP_HOST
ARG SMTP_MAIL_FROM
ARG SMTP_PASS
ARG SMTP_PORT
ARG SMTP_SECURE
ARG SMTP_USER
ARG SPOTIFY_CLIENT_ID
ARG SPOTIFY_CLIENT_SECRET
ARG UID_CLIENT_ID
ARG UID_CLIENT_SECRET
ARG UPSTASH_REDIS_TOKEN
ARG UPSTASH_REDIS_URL

ENV APP_URL $APP_URL
ENV DATABASE_URL $DATABASE_URL
ENV GOOGLE_CLIENT_ID $GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET $GOOGLE_CLIENT_SECRET
ENV SESSION_SECRET $SESSION_SECRET
ENV SESSION_STORAGE $SESSION_STORAGE
ENV SMTP_HOST $SMTP_HOST
ENV SMTP_MAIL_FROM $SMTP_MAIL_FROM
ENV SMTP_PASS $SMTP_PASS
ENV SMTP_PORT $SMTP_PORT
ENV SMTP_SECURE $SMTP_SECURE
ENV SMTP_USER $SMTP_USER
ENV SPOTIFY_CLIENT_ID $SPOTIFY_CLIENT_ID
ENV SPOTIFY_CLIENT_SECRET $SPOTIFY_CLIENT_SECRET
ENV UID_CLIENT_ID $UID_CLIENT_ID
ENV UID_CLIENT_SECRET $UID_CLIENT_SECRET
ENV UPSTASH_REDIS_TOKEN $UPSTASH_REDIS_TOKEN
ENV UPSTASH_REDIS_URL $UPSTASH_REDIS_URL
ENV NODE_ENV production
ENV PORT 3000

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
