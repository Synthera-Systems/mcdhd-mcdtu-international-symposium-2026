// src/app/api/admin/delegate/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";
import { 
  sendRegistrationApprovedEmail, 
  sendRegistrationRejectedEmail, 
  sendActionRequiredEmail 
} from "@/lib/email";

export async function PUT(request: Request) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { paymentId, newStatus } = await request.json();

    if (!paymentId || !newStatus) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: newStatus },
      include: { delegate: true },
    });

    const delegate = updatedPayment.delegate;

    if (delegate) {
      if (newStatus === "COMPLETED") {
        await sendRegistrationApprovedEmail(
          delegate.email,
          delegate.fullName,
          delegate.referenceId,
          delegate.category
        );
      } else if (newStatus === "FAILED") {
        await sendRegistrationRejectedEmail(
          delegate.email, 
          delegate.fullName
        );
      } else if (newStatus === "ACTION_REQUIRED") {
        if (updatedPayment.actionToken) {
          await sendActionRequiredEmail(
            delegate.email,
            delegate.fullName,
            updatedPayment.actionToken
          );
        }
      }
    }

    return NextResponse.json({ success: true, payment: updatedPayment }, { status: 200 });
  } catch (error: any) {
    console.error("Delegate Update Error:", error);
    return NextResponse.json({ error: "Failed to update delegate" }, { status: 500 });
  }
}