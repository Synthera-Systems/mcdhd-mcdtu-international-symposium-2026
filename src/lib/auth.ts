// src/lib/auth.ts
import { cookies } from "next/headers";

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    return false;
  }

  try {
    let rawVal = session.value;
    while (rawVal.includes("%")) {
      rawVal = decodeURIComponent(rawVal);
    }
    const parsed = JSON.parse(rawVal);
    
    return Boolean(
      parsed === "authenticated" ||
      parsed?.authenticated === true ||
      parsed?.role === "admin"
    );
  } catch {
    return session.value === "authenticated";
  }
}