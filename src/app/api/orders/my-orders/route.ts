import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan masuk untuk melihat daftar pesanan Anda." },
        { status: 401 }
      );
    }

    // Hanya ambil pesanan milik user ini saja (server-enforced security)
    const myOrders = await db.find<OrderRecord>("Orders", { user_id: session.id });
    myOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      orders: myOrders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengambil data pesanan." },
      { status: 500 }
    );
  }
}

