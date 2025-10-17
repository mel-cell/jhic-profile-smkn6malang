# Stage 1: Install dependencies and build the project
FROM oven/bun:1.0.25-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# No build step needed for Bun + TypeScript runtime, but can add if needed

# Stage 2: Run the application
FROM oven/bun:1.0.25-alpine

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3002

COPY --from=builder /app .

EXPOSE 3002

CMD ["bun", "run", "src/index.ts"]
