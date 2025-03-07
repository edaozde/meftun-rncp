# 🛍️ MEFTUN – Plateforme e-commerce & gestion admin
Meftun est une plateforme e-commerce combinant une interface utilisateur et un espace administrateur dédié à la gestion des produits et des commandes.
L'application met l'accent sur l'accessibilité, l'expérience utilisateur fluide et une authentification sécurisée.

## 🚀 Démarrage du projet
📥 Cloner le repository
```
git clone git@github.com:edaozde/Meftun.git meftun
cd meftun
```

📦 Installation des dépendances

```
npm install  
```

🏃‍♂️ Lancer le frontend
```
npm run dev  
```

📌 L'application sera accessible sur http://localhost:3000/


## 🛠️ Technologies utilisées
- Stack	Technologies 🚀  
- Frontend	Next.js (React), TypeScript, Material UI  
- Backend	Node.js (NestJS), PostgreSQL (via Prisma)  
- Auth	JWT + Cookies HTTPOnly  
- Paiement	Stripe  
- Conteneurisation	Docker (uniquement pour le backend)  

## Déploiement	Vercel & Docker

### 📌 Fonctionnalités clés  

🔑 Authentification & Sécurité  

- Inscription et connexion utilisateur via JWT  
- Authentification sécurisée avec cookies HTTPOnly  
- Redirection automatique selon le rôle (Admin / Utilisateur)  

🛍️ Gestion des produits
- Ajout, modification et suppression de produits
- Gestion des stocks et variantes (tailles, couleurs)
- Upload & affichage des images  

📦 Commandes & Paiements
- Panier & validation de commande
- Historique des commandes utilisateur
- Paiement sécurisé via Stripe  

⚙️ Espace administrateur
- Gestion des produits et des utilisateurs
- Suivi des commandes et statistiques  




📩 Contact : contact@meftun.com
