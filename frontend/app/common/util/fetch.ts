import { cookies } from "next/headers";
import { API_URL } from "../constants/api";
import { getErrorMessage } from "./errors";

export const getHeaders = (isJson = true) => {
  const headers: Record<string, string> = {
    Cookie: cookies().toString(),
  };
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export const post = async (path: string, data: FormData | object) => {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${API_URL}/${path}`, {
    method: "POST",
    headers: getHeaders(!isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });

  const parsedRes = await res.json();
  if (!res.ok) {
    return { error: getErrorMessage(parsedRes) };
  }
  return { error: "", data: parsedRes };
};

export const get = async <T>(path: string, tags?: string[]) => {
  const res = await fetch(`${API_URL}/${path}`, {
    headers: getHeaders(),
    next: { tags },
  });

  return res.json() as T;
};

export const put = async (path: string, data: FormData | object) => {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${API_URL}/${path}`, {
    method: "PUT",
    headers: getHeaders(!isFormData),
    body: isFormData ? data : JSON.stringify(data),
  });

  const parsedRes = await res.json();
  if (!res.ok) {
    return { error: getErrorMessage(parsedRes) };
  }
  return { error: "", data: parsedRes };
};

export const del = async (path: string) => {
  const res = await fetch(`${API_URL}/${path}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const parsedRes = await res.json();
  if (!res.ok) {
    return { error: getErrorMessage(parsedRes) };
  }
  return { error: "", data: parsedRes };
};
