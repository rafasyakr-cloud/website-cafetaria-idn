import { NextResponse } from "next/server";
import { getCurrentUser, createSessionToken, setSessionCookie } from "@/lib/auth";
import { db, OrderRecord, UserRecord } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
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

    let session = await getCurrentUser();
    if (!session) {
      // Auto-create client user session agar pelanggan tidak terhambat
      const clientId = `client-${cleanWhatsapp}`;
      const clientEmail = `${cleanWhatsapp}@klien.cafetariaidn.com`;

      // Check if user already exists
      const existingUsers = await db.find<UserRecord>("Users", { email: clientEmail });
      let userId = clientId;
      if (existingUsers.length > 0) {
        userId = existingUsers[0].id;
      } else {
        try {
          const newUser = await db.insert<UserRecord>("Users", {
            id: clientId,
            name: customer_name.trim(),
            email: clientEmail,
            password_hash: "CLIENT_NO_PASSWORD",
            role_id: "role-user",
            status: "active",
          });
          userId = newUser.id;
        } catch (e) {
          // Fallback to clientId
        }
      }

      const token = await createSessionToken({
        id: userId,
        name: customer_name.trim(),
        email: clientEmail,
        role: "user",
        roleId: "role-user",
      });
      await setSessionCookie(token);
      session = {
        id: userId,
        name: customer_name.trim(),
        email: clientEmail,
        role: "user",
        roleId: "role-user",
      };
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
