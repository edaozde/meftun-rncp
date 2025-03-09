"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FormResponse } from "@/app/common/interfaces/form-response.interface";
import { API_URL } from "@/app/common/constants/api";
import { getErrorMessage } from "@/app/common/util/errors";
import { AUTHENTICATION_COOKIE } from "../auth-cookies";

export default async function login(
  _prevState: FormResponse,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!email || !password) {
      return { error: "Veuillez remplir tous les champs." };
    }

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const responseData = await res.json();

    if (!res.ok) {
      return { error: getErrorMessage(responseData) };
    }

    const success = await setAuthCookie(res);
    if (!success) {
      return { error: "Erreur lors de la connexion. Veuillez réessayer." };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return { error: "Une erreur est survenue. Veuillez réessayer plus tard." };
  }
}

const setAuthCookie = async (response: Response): Promise<boolean> => {
  try {
    const setCookieHeader = response.headers.get("Set-Cookie");
    if (!setCookieHeader) {
      console.error("❌ Aucun cookie trouvé dans la réponse !");
      return false;
    }

    const tokenMatch = setCookieHeader.match(
      /(?:^|;\s*)Authentication=([^;]*)/
    );
    if (!tokenMatch) {
      console.error("❌ Impossible d'extraire le token !");
      return false;
    }

    const token = tokenMatch[1];
    const decoded = jwtDecode(token);

    if (!decoded.exp) {
      console.error("❌ Token invalide (pas d'expiration) !");
      return false;
    }

    cookies().set({
      name: AUTHENTICATION_COOKIE,
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(decoded.exp * 1000),
    });

    return true;
  } catch (error) {
    console.error("❌ Erreur lors du décodage du token :", error);
    return false;
  }
};
