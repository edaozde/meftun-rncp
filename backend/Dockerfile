# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer toutes les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Générer Prisma Client
RUN npx prisma generate

# Build l'application
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --production

# Copier les fichiers buildés et prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Commande de démarrage
CMD npx prisma migrate deploy && node dist/main
