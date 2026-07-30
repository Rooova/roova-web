import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type SessionRole = "AGENCY" | "ADMIN" | "INVESTOR";

export async function getServerSession<T = { id: string }>(
  role: SessionRole,
): Promise<T | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(`${API_URL}/auth/${role.toLowerCase()}/me`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!response.ok) return null;
  return (await response.json()) as T;
}
