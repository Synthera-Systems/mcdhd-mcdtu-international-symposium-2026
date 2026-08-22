import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";
import * as XLSX from "xlsx";

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
  createdAt: "Registration Date",
};

export async function POST(request: Request) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { statusFilter, selectedColumns } = body;

    const whereClause: any = {};
    if (statusFilter && statusFilter !== "ALL") {
      whereClause.payment = { status: statusFilter };
    }

    const delegates = await prisma.delegate.findMany({
      where: whereClause,
      include: { payment: true },
      orderBy: { createdAt: "desc" },
    });

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

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Delegates List");

    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new Response(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=mitocan_delegates_export_${Date.now()}.xlsx`,
      },
    });
  } catch (error: any) {
    console.error("XLSX Engine Export Error:", error);
    return NextResponse.json({ error: "Failed to compile spreadsheet." }, { status: 500 });
  }
}