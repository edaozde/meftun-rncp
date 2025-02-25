# Étape 1 : Builder l'application
FROM node:18 AS builder

WORKDIR /app

# Copier les fichiers de dépendances pour optimiser le cache Docker
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --only=production

# Copier le reste du code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Compiler le TypeScript
RUN npm run build


# Étape 2 : Image finale optimisée
FROM node:18-slim AS runner

# Définir un utilisateur non-root pour plus de sécurité
RUN useradd --create-home --shell /bin/bash appuser

WORKDIR /app

# Copier uniquement le build et les dépendances depuis l’image de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Exposer le port utilisé par l'application
EXPOSE 3001

# Changer l'utilisateur pour éviter de tourner en root
USER appuser

# Lancer l'application en mode production
CMD ["npm", "run", "start:prod"]
