// --- src/app/api/admin/settings/route.ts ---
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const settings = await prisma.systemSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {}, 
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve configuration settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized access path." }, { status: 401 });
    }

    const body = await request.json();
    
    const updatedSettings = await prisma.systemSettings.update({
      where: { id: 1 },
      data: {
        symposiumDates: body.symposiumDates,
        submissionDeadline: body.submissionDeadline,
        notificationDate: body.notificationDate,
        accountName: body.accountName,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        ifscCode: body.ifscCode,
        upiQrUrl: body.upiQrUrl,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update internal settings map." }, { status: 500 });
  }
}