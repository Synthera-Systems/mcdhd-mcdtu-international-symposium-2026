import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";

export async function GET() {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const delegates = await prisma.delegate.findMany({
      include: { payment: true },
      orderBy: { createdAt: "desc" },
    });

    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ delegates, submissions }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Data Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}