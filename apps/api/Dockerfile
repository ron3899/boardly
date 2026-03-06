FROM node:22-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@10.30.3

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .
RUN cd apps/api && npx prisma generate
RUN cd apps/api && npx tsc || true

FROM base AS runner
WORKDIR /app
COPY --from=build /app ./
WORKDIR /app/apps/api
EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production
CMD ["npx", "tsx", "src/index.ts"]
