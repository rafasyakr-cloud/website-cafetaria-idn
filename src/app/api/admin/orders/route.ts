import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const allOrders = await db.list<OrderRecord>("Orders");
    allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      orders: allOrders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengambil daftar pesanan admin." },
      { status: 500 }
    );
  }
}

