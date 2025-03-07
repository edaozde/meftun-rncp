import { NextRequest } from "next/server";
import authenticated from "./app/auth/authenticated";
import { unauthenticatedRoutes } from "./app/common/constants/route";

export function middleware(request: NextRequest) {
  console.log("🔍 Middleware activé !");
  console.log("🚀 URL demandée :", request.nextUrl.pathname);
  
  const isAuthenticated = authenticated();
  console.log("✅ Utilisateur authentifié :", isAuthenticated);
  
  const isUnauthenticatedRoute = unauthenticatedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route.path)
  );
  console.log("🔓 Page autorisée sans connexion :", isUnauthenticatedRoute);
  
  if (!isAuthenticated && !isUnauthenticatedRoute) {
    console.log("⛔ Redirection vers /auth/login");
    return Response.redirect(new URL("/auth/login", request.url));
  }
}
