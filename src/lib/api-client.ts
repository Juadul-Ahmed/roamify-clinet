import { authClient } from "@/lib/auth-client";

interface SessionWithToken {
  session?: {
    token?: string;
  };
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const { data: session } = await authClient.getSession();
  const token = (session as SessionWithToken | null)?.session?.token;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
}