FROM oven/bun:1.2-alpine
WORKDIR /app

ARG PORT=3000
ARG HOSTNAME="0.0.0.0"
ARG NODE_ENV=production
ARG NEXT_TELEMETRY_DISABLED=1
ARG VERSION
ARG BUILD_DATE
ARG VCS_REF
ARG UPTIME_KUMA_BASE_URL
ARG PAGE_ID
ARG CI_MODE=false

ENV PORT=${PORT} \
  HOSTNAME=${HOSTNAME} \
  NODE_ENV=${NODE_ENV} \
  NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED} \
  UPTIME_KUMA_BASE_URL=${UPTIME_KUMA_BASE_URL} \
  PAGE_ID=${PAGE_ID} \
  CI_MODE=${CI_MODE}

RUN apk add --no-cache curl

RUN if [ "$CI_MODE" = "true" ]; then \
  echo "CI_MODE is enabled, build will be skipped" && exit 1; \
fi

RUN if [ -z "$UPTIME_KUMA_BASE_URL" ]; then \
  echo "Error: UPTIME_KUMA_BASE_URL is required" && exit 1; \
fi

RUN if [ -z "$PAGE_ID" ]; then \
  echo "Error: PAGE_ID is required" && exit 1; \
fi

COPY package.json bun.lock ./
RUN set -e && \
    echo "Installing dependencies..." && \
    bun install --frozen-lockfile || { echo "Failed to install dependencies"; exit 1; }

COPY . .
RUN set -e && \
    echo "Starting build process..." && \
    bun run build || { echo "Build failed"; exit 1; } && \
    mkdir -p /app/.next/static && \
    echo "Checking build output:" && \
    ls -la && \
    echo "Checking if server.js exists:" && \
    if ! find . -name "server.js" > /dev/null; then \
        echo "Error: server.js not found after build" && exit 1; \
    fi && \
    echo "Build completed successfully"

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1

CMD ["bun", "./server.js"]