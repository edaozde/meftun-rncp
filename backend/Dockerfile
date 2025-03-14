# Étape 1 : Utiliser une image Node.js optimisée
FROM node:18-slim

# Installer OpenSSL et autres dépendances nécessaires
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers package.json pour optimiser le cache
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Copier le dossier Prisma avant de générer Prisma
COPY prisma /app/prisma

# Générer le client Prisma avec le bon schema.prisma
RUN npx prisma generate

# Compiler le code TypeScript
RUN npm run build

# Nouvelle commande qui inclut le db push
CMD npx prisma db push --accept-data-loss --schema=./prisma/schema.prisma && npm run start:prod
