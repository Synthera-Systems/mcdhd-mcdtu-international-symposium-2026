// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ipStore = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
             request.headers.get("x-real-ip") || 
             "127.0.0.1";
             
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api/admin/login")) {
    const now = Date.now();
    const record = ipStore.get(ip);

    if (!record || now > record.resetTime) {
      ipStore.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    } else {
      record.count += 1;
      if (record.count > 5) {
        return new NextResponse(
          JSON.stringify({ error: "Too many login attempts. Please wait 15 minutes." }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/login", "/api/register", "/api/submit_abstract"],
};