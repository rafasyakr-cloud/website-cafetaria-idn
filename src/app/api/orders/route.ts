import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan masuk ke akun Anda terlebih dahulu untuk melakukan pemesanan." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { customer_name, whatsapp, order_type, items_json, total_amount, notes, payment_proof_path } = body;

    if (!customer_name || typeof customer_name !== "string" || customer_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nama lengkap wajib diisi (minimal 2 karakter)." },
        { status: 400 }
      );
    }

    const cleanWhatsapp = (whatsapp || "").replace(/[^0-9]/g, "");
    if (!cleanWhatsapp || cleanWhatsapp.length < 9 || cleanWhatsapp.length > 15) {
      return NextResponse.json(
        { success: false, error: "Nomor WhatsApp tidak valid (minimal 9 digit angka)." },
        { status: 400 }
      );
    }

    const parsedTotal = Number(total_amount);
    if (isNaN(parsedTotal) || parsedTotal <= 0) {
      return NextResponse.json(
        { success: false, error: "Nominal pembayaran tidak valid." },
        { status: 400 }
      );
    }

    // Generate unique readable order code
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `IDN-${dateStr}-${randomSuffix}`;

    const newOrder = await db.insert<OrderRecord>("Orders", {
      order_code: orderCode,
      user_id: session.id,
      customer_name: customer_name.trim(),
      whatsapp: cleanWhatsapp,
      order_type: order_type || "fnb",
      items_json: typeof items_json === "string" ? items_json : JSON.stringify(items_json || []),
      total_amount: parsedTotal,
      status: "menunggu_konfirmasi",
      payment_proof_path: payment_proof_path || "",
      notes: (notes || "").trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat.",
      order: newOrder,
    });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal membuat pesanan." },
      { status: 500 }
    );
  }
}

