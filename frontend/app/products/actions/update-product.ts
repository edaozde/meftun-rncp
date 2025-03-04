"use server";

import { revalidateTag } from "next/cache";
import { put } from "../../common/util/fetch";

export default async function updateProduct(productId: number, formData: FormData) {
  const response = await put(`products/${productId}`, formData);
  
  if (!response.error) {
    revalidateTag("products"); // ✅ Rafraîchit le cache après modification
  }
  
  return response;
}
