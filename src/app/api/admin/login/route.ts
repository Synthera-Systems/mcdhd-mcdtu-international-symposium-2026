// src/app/api/admin/login/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"; // NEW: Import bcryptjs

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required." }, { status: 400 });
    }

    // Check database for the admin user[cite: 3]
    const admin = await prisma.adminUser.findUnique({
      where: { username }
    });

    // NEW: Use bcrypt.compare to securely verify the password hash
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      
      if (isMatch) {
        const cookieStore = await cookies();
        
        // Store a JSON string in the cookie to keep track of who logged in[cite: 3]
        const sessionData = JSON.stringify({
          authenticated: true,
          username: admin.username,
          name: admin.name,
          role: admin.role
        });

        cookieStore.set("admin_session", sessionData, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 1 day
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