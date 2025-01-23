import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "./auth-cookies";

export default function authenticated() {
  return !!cookies().get(AUTHENTICATION_COOKIE)?.value;
}