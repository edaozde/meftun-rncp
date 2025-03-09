import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "./auth-cookies";

export default function authenticated() {
  try {
    console.log("🔍 Vérification d'authentification...");
    const cookieStore = cookies();
    console.log("📦 Cookie store:", cookieStore);

    const authCookie = cookieStore.get(AUTHENTICATION_COOKIE);
    console.log("🍪 Cookie d'authentification:", authCookie);

    const isAuthenticated = !!authCookie?.value;
    console.log("✅ Résultat authentification:", isAuthenticated);

    return isAuthenticated;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la vérification d'authentification:",
      error
    );
    return false;
  }
}
