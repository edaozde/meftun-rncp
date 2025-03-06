"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { API_URL } from "@/app/common/constants/api";
import { getErrorMessage } from "@/app/checkout/util/errors";
import { redirect } from "next/navigation";
import { AUTHENTICATION_COOKIE } from "../auth-cookies";

export default async function adminLogin(
  _prevState: unknown,
  formData: FormData
) {
  const res = await fetch(`${API_URL}/auth/admin-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const parsedRes = await res.json();
  if (!res.ok) {
    return { error: getErrorMessage(parsedRes) };
  }

  setAdminAuthCookie(res);
  redirect("/admin-dashboard");
}

const setAdminAuthCookie = (response: Response) => {
  const setCookieHeader = response.headers.get("Set-Cookie");
  if (setCookieHeader) {
    const token = setCookieHeader.split(";")[0].split("=")[1];
    cookies().set({
      name: AUTHENTICATION_COOKIE,
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(jwtDecode(token).exp! * 1000),
    });
  }
};
