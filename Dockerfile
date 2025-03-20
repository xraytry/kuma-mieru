FROM oven/bun:1.2-alpine as builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY postcss.config.js .
COPY tailwind.config.js .
COPY tsconfig.json .
COPY biome.jsonc .
COPY next.config.js .
COPY .env .

COPY app ./app
COPY components ./components
COPY config ./config
COPY public ./public
COPY scripts ./scripts
COPY services ./services
COPY types ./types
COPY utils ./utils
COPY styles ./styles

RUN bun run build

# Production stage
FROM oven/bun:1.2-alpine
WORKDIR /app

ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  PORT=3000 \
  HOSTNAME="0.0.0.0"

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

RUN mkdir -p ./.next/cache

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/api/health || exit 1

USER nobody

CMD ["bun", "server.js"]
