// src/app/api/action/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Check if token is valid and fetch the failure reason
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.json({ error: "Token is required." }, { status: 400 });

  try {
    const payment = await prisma.payment.findUnique({
      where: { actionToken: token },
      include: { delegate: true },
    });

    if (!payment || payment.status !== "ACTION_REQUIRED") {
      return NextResponse.json(
        { error: "This link is invalid, expired, or your payment has already been processed." },
        { status: 404 }
      );
    }

    const aiLog = payment.aiValidationLog ? JSON.parse(payment.aiValidationLog) : {};

    return NextResponse.json({
      fullName: payment.delegate.fullName,
      utrNumber: payment.utrNumber,
      referenceId: payment.delegate.referenceId,
      reason: aiLog.reason || "Automated verification failed. Please re-upload.",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}

// POST: Save the new screenshot and re-trigger the AI engine
export async function POST(request: Request) {
  try {
    const { token, newScreenshotUrl } = await request.json();

    if (!token || !newScreenshotUrl) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. Find the existing payment
    const payment = await prisma.payment.findUnique({
      where: { actionToken: token },
      include: { delegate: true },
    });

    if (!payment || payment.status !== "ACTION_REQUIRED") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // 2. Update the screenshot and reset status to PROCESSING
    await prisma.payment.update({
      where: { actionToken: token },
      data: {
        screenshotUrl: newScreenshotUrl,
        status: "PROCESSING",
        aiValidationLog: null, // Clear the old error log
      },
    });

    // 3. Fire the AI Worker again!
    const baseUrl = request.headers.get('origin') || 'http://localhost:3000';
    fetch(`${baseUrl}/api/engine/ai_worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        delegateId: payment.delegateId,
        utrNumber: payment.utrNumber,
        screenshotUrl: newScreenshotUrl,
        email: payment.delegate.email,
        fullName: payment.delegate.fullName,
        referenceId: payment.delegate.referenceId,
        actionToken: token
      })
    }).catch(err => console.error("Failed to kick off AI Worker retry:", err));

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Action update error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}