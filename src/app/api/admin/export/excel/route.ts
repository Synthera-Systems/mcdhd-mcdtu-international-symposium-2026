// --- src/app/api/admin/export/excel/route.ts ---
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

// Map raw database columns to premium, polished Excel headers
const COLUMN_HEADER_MAP: Record<string, string> = {
  referenceId: "Reference ID",
  fullName: "Full Name",
  email: "Email Address",
  affiliation: "Institutional Affiliation",
  category: "Delegate Category",
  participationType: "Participation Mode",
  utrNumber: "12-Digit UTR Number",
  paymentStatus: "Payment Status",
  linkedAbstractId: "Linked Abstract ID",
  createdAt: "Registration Date"
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { statusFilter, selectedColumns } = body;

    // 1. Build dynamic search parameters based on the admin's choice
    const whereClause: any = {};
    if (statusFilter && statusFilter !== "ALL") {
      whereClause.payment = { status: statusFilter };
    }

    // 2. Query data safely along with payment details
    const delegates = await prisma.delegate.findMany({
      where: whereClause,
      include: { payment: true },
      orderBy: { createdAt: "desc" }
    });

    // 3. Transform database rows into explicit custom dynamic keys requested by admin
    const excelRows = delegates.map((d) => {
      const rowObject: Record<string, any> = {};
      
      selectedColumns.forEach((colKey: string) => {
        const headerName = COLUMN_HEADER_MAP[colKey] || colKey;
        
        if (colKey === "utrNumber") {
          rowObject[headerName] = d.payment?.utrNumber || "N/A";
        } else if (colKey === "paymentStatus") {
          rowObject[headerName] = d.payment?.status || "N/A";
        } else if (colKey === "createdAt") {
          rowObject[headerName] = new Date(d.createdAt).toLocaleDateString("en-IN");
        } else {
          rowObject[headerName] = (d as any)[colKey] || "N/A";
        }
      });
      
      return rowObject;
    });

    // 4. Generate SheetJS book structures server-side
    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Delegates List");

    // 5. Output raw binary array buffers to circumvent local stream file storage dependencies
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new Response(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=mitocan_delegates_export_${Date.now()}.xlsx`
      }
    });

  } catch (error: any) {
    console.error("XLSX Engine Export Error:", error);
    return NextResponse.json({ error: "Failed to compile registration spreadsheet metadata." }, { status: 500 });
  }
}