# syntax=docker/dockerfile:1.7

# ---------- Builder ----------
FROM node:22-alpine AS builder

ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    CI=true

# Pin pnpm to the version declared in package.json (packageManager field)
RUN corepack enable

WORKDIR /app

# Build-time public env (baked into the bundle by Vite)
# Pass with:  docker build --build-arg VITE_SUPABASE_URL=... --build-arg VITE_SUPABASE_ANON_KEY=...
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Workspace manifests first -> cached unless they change
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Reproducible install. game/ now ships its own pnpm-lock.yaml + pnpm-workspace.yaml
# (which approves esbuild's postinstall via `allowBuilds:`), so we can pin versions.
RUN pnpm install --frozen-lockfile

# Source
COPY . ./

# Type-check + bundle into ./dist
RUN pnpm build

# ---------- Runtime ----------
FROM nginx:1.27-alpine AS runtime

# SPA-friendly nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]