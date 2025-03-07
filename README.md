
# Project Title

A brief description of what this project does and who it's for

🛍️ MEFTUN – Plateforme e-commerce & gestion admin
Meftun est une plateforme e-commerce combinant une interface utilisateur et un espace administrateur dédié à la gestion des produits et des commandes.
L'application met l'accent sur l'accessibilité, l'expérience utilisateur fluide et une authentification sécurisée.

🚀 Démarrage du projet
📥 Cloner le repository
bash
Copier
Modifier
git clone git@github.com:TonGit/Meftun.git meftun
cd meftun
📦 Installation des dépendances
bash
Copier
Modifier
npm install  # ou yarn install
🏃‍♂️ Lancer le frontend
bash
Copier
Modifier
npm run dev  # ou yarn dev
📌 L'application sera accessible sur http://localhost:3000/

🐳 Lancer le backend avec Docker
Le backend est dockerisé pour simplifier son exécution et éviter les problèmes d’environnement.

1️⃣ Assurez-vous d’avoir Docker installé
2️⃣ Lancer le backend

bash
Copier
Modifier
docker-compose up -d
📌 Le backend tournera sur http://localhost:3001/

3️⃣ Vérifier que tout fonctionne

bash
Copier
Modifier
docker ps  # Vérifie que le conteneur est bien en cours d'exécution
🛠️ Technologies utilisées
Stack	Technologies 🚀
Frontend	Next.js (React), TypeScript, Material UI
Backend	Node.js (NestJS), PostgreSQL (via Prisma)
Auth	JWT + Cookies HTTPOnly
Paiement	Stripe
Conteneurisation	Docker (uniquement pour le backend)
Déploiement	Vercel & Docker
📌 Fonctionnalités clés
🔑 Authentification & Sécurité
✔️ Inscription et connexion utilisateur via JWT
✔️ Authentification sécurisée avec cookies HTTPOnly
✔️ Redirection automatique selon le rôle (Admin / Utilisateur)

🛍️ Gestion des produits
✔️ Ajout, modification et suppression de produits
✔️ Gestion des stocks et variantes (tailles, couleurs)
✔️ Upload & affichage des images

📦 Commandes & Paiements
✔️ Panier & validation de commande
✔️ Historique des commandes utilisateur
✔️ Paiement sécurisé via Stripe

⚙️ Espace administrateur
✔️ Gestion des produits et des utilisateurs
✔️ Suivi des commandes et statistiques




📩 Contact : contact@meftun.com
