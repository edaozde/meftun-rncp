# Étape 1 : Utiliser une image Node.js officielle
FROM node:18

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier le reste du code source
COPY . .

# Étape 6 : Générer le client Prisma
RUN npx prisma generate

# Étape 7 : Compiler le code TypeScript
RUN npm run build

# Étape 8 : Exposer le port
EXPOSE 3001

# Étape 9 : Démarrer l'application
CMD ["npm", "run", "start:prod"]
