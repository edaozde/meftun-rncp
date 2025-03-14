# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Installer OpenSSL pour Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

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

# Installer OpenSSL pour Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --production

# Copier les fichiers buildés et prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Script de démarrage qui attend que la base de données soit prête
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

# Commande de démarrage qui gère tous les cas
CMD /bin/sh -c '\
    npx prisma generate && \
    (npx prisma migrate deploy || npx prisma db push --accept-data-loss) && \
    node dist/main'
