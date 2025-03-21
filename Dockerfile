FROM --platform=$BUILDPLATFORM oven/bun:1.2-alpine AS builder
WORKDIR /app

ARG NODE_ENV=production
ARG NEXT_TELEMETRY_DISABLED=1
ARG BUILD_MODE=true
ARG UPTIME_KUMA_BASE_URL
ARG PAGE_ID

ENV NODE_ENV=${NODE_ENV} \
  NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED} \
  BUILD_MODE=${BUILD_MODE} \
  UPTIME_KUMA_BASE_URL=${UPTIME_KUMA_BASE_URL} \
  PAGE_ID=${PAGE_ID}

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# Production stage
FROM --platform=$TARGETPLATFORM oven/bun:1.2-alpine
WORKDIR /app

ARG PORT=3000
ARG HOSTNAME="0.0.0.0"
ARG NODE_ENV=production
ARG NEXT_TELEMETRY_DISABLED=1
ARG VERSION
ARG BUILD_DATE
ARG VCS_REF
ARG BUILD_MODE=false
ARG UPTIME_KUMA_BASE_URL
ARG PAGE_ID

ENV PORT=${PORT} \
  HOSTNAME=${HOSTNAME} \
  NODE_ENV=${NODE_ENV} \
  NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED} \
  BUILD_MODE=${BUILD_MODE} \
  UPTIME_KUMA_BASE_URL=${UPTIME_KUMA_BASE_URL} \
  PAGE_ID=${PAGE_ID}

# OCI labels
LABEL org.opencontainers.image.title="Kuma Mieru" \
  org.opencontainers.image.description="A 3rd-party Uptime Kuma monitoring dashboard built on Next.js 15, TypeScript and Recharts." \
  org.opencontainers.image.version=${VERSION} \
  org.opencontainers.image.created=${BUILD_DATE} \
  org.opencontainers.image.revision=${VCS_REF} \
  org.opencontainers.image.licenses="MPL-2.0" \
  org.opencontainers.image.source="https://github.com/Alice39s/kuma-mieru" \
  com.github.actions.name="Kuma Mieru" \
  maintainer="Alice39s"

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

RUN mkdir -p ./.next/cache && \
    chown -R nobody:nobody /app

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1

USER nobody

CMD ["bun", "server.js"]
