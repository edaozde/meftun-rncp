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

# Générer Prisma d'abord
RUN npx prisma generate

# Build NestJS et vérifier
RUN npm run build && \
    ls -la dist/src/ && \
    find dist/src/ -name "main.js" || echo "main.js not found!"

# Production stage
FROM node:18-slim

WORKDIR /app

# Installer OpenSSL pour Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --production

# Copier les fichiers buildés et Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

# Vérifier le build final
RUN ls -la dist/src/ && find dist/src/ -name "main.js" || echo "main.js not found in production stage!"

# Commande de démarrage complète
CMD /bin/sh -c '\
    npx prisma db push --accept-data-loss --force-reset --skip-generate && \
    node dist/src/main.js'
