// src/app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required." }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username }
    });

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      
      if (isMatch) {
        const cookieStore = await cookies();
        
        const sessionData = JSON.stringify({
          authenticated: true,
          username: admin.username,
          name: admin.name,
          role: admin.role
        });

        // Pass raw string directly (Next.js handles encoding safely)
        cookieStore.set("admin_session", sessionData, {
          httpOnly: false, 
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        });
        
        return NextResponse.json({ success: true, admin: { name: admin.name, role: admin.role } });
      }
    }

    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}