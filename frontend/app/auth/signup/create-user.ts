"use server";

import { API_URL } from "@/app/common/constants/api";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "../auth-cookies";

const setAuthCookie = async (response: Response): Promise<boolean> => {
  try {
    const setCookieHeader = response.headers.get("Set-Cookie");
    if (!setCookieHeader) return false;

    const tokenMatch = setCookieHeader.match(
      /(?:^|;\s*)Authentication=([^;]*)/
    );
    if (!tokenMatch) return false;

    const token = tokenMatch[1];
    const decoded = jwtDecode(token);

    if (!decoded.exp) return false;

    cookies().set({
      name: AUTHENTICATION_COOKIE,
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(decoded.exp * 1000),
    });

    return true;
  } catch {
    return false;
  }
};

export default async function createUser(
  _prevState: unknown,
  formData: FormData
) {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Création de l'utilisateur
    const createRes = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        acceptedPrivacyPolicy: true,
      }),
      credentials: "include",
    });

    if (!createRes.ok) {
      return { error: "Erreur lors de la création du compte." };
    }

    // Login automatique
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!loginRes.ok) {
      return { error: "Erreur lors de la connexion." };
    }

    const success = await setAuthCookie(loginRes);
    if (!success) {
      return { error: "Erreur lors de la connexion. Veuillez réessayer." };
    }

    return { success: true };
  } catch {
    return { error: "Une erreur est survenue." };
  }
}
