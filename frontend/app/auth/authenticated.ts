import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "./auth-cookies";

export default function authenticated() {
  const authCookie = cookies().get(AUTHENTICATION_COOKIE)?.value;
  console.log("🔍 authenticated() exécuté | Cookie trouvé :", authCookie);

  return !!authCookie;
}
