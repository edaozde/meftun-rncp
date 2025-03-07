export const unauthenticatedRoutes = [
  {
    title: "Connexion utilisateur",
    path: "/auth/login",
  },
  {
    title: "Connexion administrateur",
    path: "/auth/admin-login",
  },
  {
    title: "S'inscrire",
    path: "/auth/signup",
  },
];

export const userRoutes = [
  {
    title: "Produits",
    path: "/shop", // ✅ Garde une route propre pour les users
  },
  {
    title: "Profil",
    path: "/profile",
  },
];

export const adminRoutes = [
  {
    title: "Produits (Admin)", // ✅ On garde `/` si ton backend l'exige
    path: "/",
  },
  {
    title: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    title: "Clients",
    path: "/admin/clients",
  },
];
