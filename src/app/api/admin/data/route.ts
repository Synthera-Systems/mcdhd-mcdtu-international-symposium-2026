// src/app/api/admin/data/route.ts
export const runtime = 'edge';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    // Parse the JSON string we set during login
    const sessionData = JSON.parse(session.value);
    if (!sessionData.authenticated) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Invalid session format" }, { status: 401 });
  }

  try {
    const delegates = await prisma.delegate.findMany({
      include: { payment: true },
      orderBy: { createdAt: 'desc' }
    });

    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ delegates, submissions }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Data Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}