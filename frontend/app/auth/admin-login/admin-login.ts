"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FormResponse } from "@/app/common/interfaces/form-response.interface";
import { API_URL } from "@/app/common/constants/api";
import { getErrorMessage } from "@/app/common/util/errors";
import { redirect } from "next/navigation";
import { AUTHENTICATION_COOKIE } from "../auth-cookies";

const MAX_ATTEMPTS = 5; // 🔥 Bloque après 5 essais
const BLOCK_DURATION = 15 * 60 * 1000; // 🔥 Bloque 15 minutes

export default async function adminLogin(_prevState: FormResponse, formData: FormData) {
  try {
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    if (!email || !password) {
      return { error: "Veuillez remplir tous les champs." };
    }

    // ✅ Vérification des tentatives échouées
    const attemptsCookie = cookies().get("admin_login_attempts")?.value;
    let attempts = attemptsCookie ? JSON.parse(attemptsCookie) : { count: 0, timestamp: Date.now() };

    if (attempts.count >= MAX_ATTEMPTS && Date.now() - attempts.timestamp < BLOCK_DURATION) {
      return { error: "Trop de tentatives. Réessayez plus tard." };
    }

    const res = await fetch(`${API_URL}/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      // 🔥 Augmente le compteur des tentatives échouées
      attempts.count += 1;
      attempts.timestamp = Date.now();
      cookies().set({
        name: "admin_login_attempts",
        value: JSON.stringify(attempts),
        maxAge: BLOCK_DURATION / 1000,
        secure: true,
        httpOnly: true,
      });

      return { error: "Identifiants incorrects." };
    }

    // ✅ Connexion réussie → Réinitialisation des tentatives
    cookies().delete("admin_login_attempts");
    setAuthCookie(res);
    redirect("/admin/dashboard");
  } catch (error) {
    console.error("Erreur lors de la connexion admin:", error);
    return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
  }
}

const setAuthCookie = (response: Response) => {
  const setCookieHeader = response.headers.get("Set-Cookie");
  if (!setCookieHeader) {
    console.error("❌ Aucun cookie trouvé dans la réponse !");
    return;
  }

  const tokenMatch = setCookieHeader.match(/(?:^|;\s*)authToken=([^;]*)/);
  if (!tokenMatch) {
    console.error("❌ Impossible d'extraire le token !");
    return;
  }

  const token = tokenMatch[1];

  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) {
      console.error("❌ Token invalide (pas d'expiration) !");
      return;
    }

    cookies().set({
      name: AUTHENTICATION_COOKIE,
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(decoded.exp * 1000),
    });
  } catch (error) {
    console.error("❌ Erreur lors du décodage du token :", error);
  }
};
