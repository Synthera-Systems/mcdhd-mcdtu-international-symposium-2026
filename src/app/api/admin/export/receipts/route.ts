// --- src/app/api/admin/export/receipts/route.ts ---
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const skip = (page - 1) * limit;

    // 1. Fetch chunk boundary parameters to optimize Vercel serverless processing
    const delegates = await prisma.delegate.findMany({
      skip,
      take: limit,
      include: { payment: true },
      where: { payment: { NOT: { screenshotUrl: "" } } },
      orderBy: { createdAt: "asc" }
    });

    if (delegates.length === 0) {
      return NextResponse.json({ error: "No records found matching this page segment." }, { status: 404 });
    }

    const zip = new JSZip();
    let dynamicFilesAddedCount = 0;

    // 2. Stream individual assets out of storage and pack them cleanly into memory
    for (const d of delegates) {
      if (d.payment?.screenshotUrl) {
        const pathKey = d.payment.screenshotUrl.split("/").pop();
        if (!pathKey) continue;

        const { data, error } = await supabaseAdmin.storage.from("receipts").download(pathKey);
        
        if (!error && data) {
          const fileExtension = pathKey.split(".").pop() || "png";
          // Rule applied: Clean renaming matching requested blueprint schema
          const calibratedFileName = `${d.referenceId}-${d.fullName.replace(/[^a-zA-Z0-9]/g, "_")}-receipt.${fileExtension}`;
          
          zip.file(calibratedFileName, data.arrayBuffer());
          dynamicFilesAddedCount++;
        }
      }
    }

    if (dynamicFilesAddedCount === 0) {
      return NextResponse.json({ error: "No physical receipt objects found inside this segment." }, { status: 404 });
    }

    // 3. Compile and cast into browser-streamable typed arrays
    const archiveBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const responsiveStreamPayload = new Uint8Array(archiveBuffer);

    return new Response(responsiveStreamPayload, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=mitocan_receipts_batch_page_${page}.zip`
      }
    });

  } catch (error: any) {
    console.error("ZIP Engine Download Error:", error);
    return NextResponse.json({ error: "Failed to compile compressed batch folder metadata." }, { status: 500 });
  }
}