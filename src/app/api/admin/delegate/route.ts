// src/app/api/admin/delegate/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
  // 1. Verify Security Cookie
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  // Parse session JSON or fallback string safely
  let isAuthenticated = false;
  try {
    const parsed = JSON.parse(session.value);
    isAuthenticated = parsed === "authenticated" || parsed.authenticated === true || parsed.role === "admin";
  } catch {
    isAuthenticated = session.value === "authenticated";
  }

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { paymentId, newStatus } = await request.json();

    if (!paymentId || !newStatus) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 2. Update the payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: newStatus }
    });

    return NextResponse.json({ success: true, payment: updatedPayment }, { status: 200 });

  } catch (error: any) {
    console.error("Delegate Update Error:", error);
    return NextResponse.json({ error: "Failed to update delegate" }, { status: 500 });
  }
}