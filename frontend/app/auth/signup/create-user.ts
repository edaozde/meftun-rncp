"use server";

import { API_URL } from "@/app/common/constants/api";
import { redirect } from "next/navigation";
import { getErrorMessage } from '@/app/common/util/errors';

export default async function createUser(_prevState: unknown, formData: FormData) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    body: formData,
  });
  const parsedRes = await res.json();
  if (!res.ok) {
    return { error: getErrorMessage(parsedRes) };
  }

  redirect("/");
}