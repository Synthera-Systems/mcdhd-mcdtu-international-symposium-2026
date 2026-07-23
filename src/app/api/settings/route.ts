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

    const storageStats: any[] = await prisma.$queryRaw`
      SELECT COALESCE(SUM((metadata->>'size')::bigint), 0) as total_bytes 
      FROM storage.objects 
      WHERE bucket_id IN ('receipts', 'abstracts')
    `;

    const usedBytes = Number(storageStats[0]?.total_bytes || 0);
    const maxFreeBytes = 1 * 1024 * 1024 * 1024; // Exactly 1GB in bytes
    const utilizationRatio = usedBytes / maxFreeBytes;
    
    // Flag warning if storage capacity passes 80% threshold
    const storageWarning = utilizationRatio >= 0.8;

    return NextResponse.json({
      ...settings,
      storageWarning,
      storagePercentage: (utilizationRatio * 100).toFixed(1)
    });

  } catch (error) {
    console.error("Settings GET Engine Error:", error);
    return NextResponse.json({ error: "Failed to read configuration parameters" }, { status: 500 });
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

    const dataPayload = {
      symposiumDates: body.symposiumDates ?? "",
      earlyRegistrationDeadline: body.earlyRegistrationDeadline ?? "",
      lateRegistrationDeadline: body.lateRegistrationDeadline ?? "",
      notificationDate: body.notificationDate ?? "",
      accountName: body.accountName ?? "",
      bankName: body.bankName ?? "",
      accountNumber: body.accountNumber ?? "",
      ifscCode: body.ifscCode ?? "",
      upiQrUrl: body.upiQrUrl ?? "",
    };

    // Use UPSERT so row id: 1 is created if missing
    const updatedSettings = await prisma.systemSettings.upsert({
      where: { id: 1 },
      update: dataPayload,
      create: {
        id: 1,
        ...dataPayload,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Settings PUT Error:", error); // Added log to see exact Prisma errors in dev server
    return NextResponse.json({ error: "Failed to update internal settings map." }, { status: 500 });
  }
}