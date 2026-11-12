import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: "ID pesanan diperlukan." }, { status: 400 });
    }

    const existing = await db.get<OrderRecord>("Orders", id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    const body = await request.json();
    const { status, rejection_reason } = body;

    const validStatuses = ["menunggu_konfirmasi", "dikonfirmasi", "ditolak", "selesai"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Status pesanan tidak valid." }, { status: 400 });
    }

    const updates: Partial<OrderRecord> = {};
    if (status) updates.status = status;
    if (rejection_reason !== undefined) updates.rejection_reason = rejection_reason;

    const updated = await db.update<OrderRecord>("Orders", id, updates);

    return NextResponse.json({
      success: true,
      message: "Status pesanan berhasil diperbarui.",
      order: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal memperbarui status pesanan." },
      { status: 500 }
    );
  }
}

