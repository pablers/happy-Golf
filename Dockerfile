# Stage 1: Base
FROM node:22-alpine AS base
WORKDIR /app

# Stage 2: Frontend Build
FROM base AS frontend-builder
COPY package*.json ./
RUN npm ci
COPY . .
# Creamos el build del front
RUN npm run build

# Stage 3: Backend Build
FROM base AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
# Prisma generate
RUN npx prisma generate
# Build de NestJS
RUN npm run build

# Stage 4: Final Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copiamos el backend construido y sus dependencias de producción
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/prisma ./backend/prisma
COPY --from=backend-builder /app/backend/package.json ./backend/package.json

# Copiamos el build del frontend a la raíz de la app (donde el backend lo buscará)
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 3000

# Script para correr migraciones y arrancar
CMD ["sh", "-c", "cd backend && npx prisma migrate deploy && node dist/main"]
