import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(request: Request) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const skip = (page - 1) * limit;

    const delegates = await prisma.delegate.findMany({
      skip,
      take: limit,
      include: { payment: true },
      where: { payment: { NOT: { screenshotUrl: "" } } },
      orderBy: { createdAt: "asc" },
    });

    if (delegates.length === 0) {
      return NextResponse.json({ error: "No records found for this page." }, { status: 404 });
    }

    const zip = new JSZip();
    let dynamicFilesAddedCount = 0;

    for (const d of delegates) {
      if (d.payment?.screenshotUrl) {
        const pathKey = d.payment.screenshotUrl.split("/").pop();
        if (!pathKey) continue;

        const { data, error } = await supabaseAdmin.storage.from("receipts").download(pathKey);
        if (!error && data) {
          const fileExtension = pathKey.split(".").pop() || "png";
          const calibratedFileName = `${d.referenceId}-${d.fullName.replace(/[^a-zA-Z0-9]/g, "_")}-receipt.${fileExtension}`;
          zip.file(calibratedFileName, data.arrayBuffer());
          dynamicFilesAddedCount++;
        }
      }
    }

    if (dynamicFilesAddedCount === 0) {
      return NextResponse.json({ error: "No receipt files found in this segment." }, { status: 404 });
    }

    const archiveBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const responsiveStreamPayload = new Uint8Array(archiveBuffer);

    return new Response(responsiveStreamPayload, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=mitocan_receipts_batch_page_${page}.zip`,
      },
    });
  } catch (error: any) {
    console.error("ZIP Engine Download Error:", error);
    return NextResponse.json({ error: "Failed to compile batch zip." }, { status: 500 });
  }
}