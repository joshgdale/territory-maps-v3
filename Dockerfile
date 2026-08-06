# ==========================================
# 1. Base Stage
# ==========================================
FROM node:24-alpine AS base
WORKDIR /app

# Native modules (bcrypt) need a toolchain on Alpine/musl
RUN apk add --no-cache python3 make g++

# ==========================================
# 2. Install All Dependencies (once)
# ==========================================
# Single install — BuildKit otherwise runs deps + production-deps in
# parallel (two npm ci + two native compiles), which OOMs small Coolify hosts.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ==========================================
# 3. Production node_modules (prune, don't reinstall)
# ==========================================
FROM deps AS production-deps
RUN npm prune --omit=dev

# ==========================================
# 4. Build Stage (Compiles TS / Vite assets)
# ==========================================
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN node ace build

# ==========================================
# 5. Final Production Stage
# ==========================================
FROM node:24-alpine
WORKDIR /app

ENV NODE_ENV=production
# Defaults only — override at runtime via Coolify / docker -e
ENV HOST=0.0.0.0
ENV PORT=8080

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app

EXPOSE 8080
CMD ["node", "./bin/server.js"]
