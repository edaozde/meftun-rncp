"use server";

import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "./auth-cookies";
import { jwtDecode } from "jwt-decode";

interface UserSession {
  userId: number;
  role: string;
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const token = cookies().get(AUTHENTICATION_COOKIE)?.value;
    if (!token) return null;

    const decoded = jwtDecode<UserSession>(token);
    return decoded;
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return null;
  }
}
