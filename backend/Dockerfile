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

# Générer le client Prisma
RUN npx prisma generate

# Compiler le code TypeScript
RUN npm run build

# Exposer le port
EXPOSE 3001

# Lancer les migrations avant le démarrage de l'application
CMD npx prisma migrate deploy && npm run start:prod
