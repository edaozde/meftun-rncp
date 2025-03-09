import { NextRequest, NextResponse } from "next/server";
import authenticated from "./app/auth/authenticated";

export async function middleware(request: NextRequest) {
  console.log("🔍 Middleware activé !");
  console.log("🚀 URL demandée :", request.nextUrl.pathname);

  // Pour les routes protégées, vérifier l'authentification
  const isAuthenticated = authenticated();
  if (!isAuthenticated) {
    const loginUrl = request.nextUrl.pathname.startsWith("/admin")
      ? "/auth/admin-login"
      : "/auth/login";
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  return NextResponse.next();
}

// Ne protéger que les routes spécifiques
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/shop/:path*",
  ],
};
