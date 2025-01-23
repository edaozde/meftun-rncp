"use server";

import { get } from "@/app/common/util/fetch"


export default async function getMe() {
  return get("users/me");
}