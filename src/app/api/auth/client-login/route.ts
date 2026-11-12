import { NextResponse } from "next/server";
import { db, UserRecord } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, whatsapp } = body;

    const trimmedName = (name || "Pelanggan Cafetaria").trim();
    const cleanWa = (whatsapp || "").replace(/[^0-9]/g, "");

    if (trimmedName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Nama pelanggan minimal 2 karakter." },
        { status: 400 }
      );
    }

    if (cleanWa.length < 8) {
      return NextResponse.json(
        { success: false, error: "Nomor WhatsApp/HP minimal 8 digit angka." },
        { status: 400 }
      );
    }

    const clientEmail = `${cleanWa}@klien.cafetariaidn.com`;

    // Cari apakah akun klien dengan kontak ini sudah ada
    let userRecord: UserRecord | null = null;
    const existing = await db.find<UserRecord>("Users", { email: clientEmail });

    if (existing.length > 0) {
      userRecord = existing[0];
      if (userRecord.name !== trimmedName) {
        try {
          await db.update<UserRecord>("Users", userRecord.id, { name: trimmedName });
          userRecord.name = trimmedName;
        } catch (e) {
          // Ignore non-fatal update error
        }
      }
    } else {
      // Buat akun klien baru tanpa password
      const newId = `client-${cleanWa}`;
      userRecord = await db.insert<UserRecord>("Users", {
        id: newId,
        name: trimmedName,
        email: clientEmail,
        password_hash: "CLIENT_NO_PASSWORD",
        role_id: "role-user",
        status: "active",
      });
    }

    const sessionToken = await createSessionToken({
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      role: "user",
      roleId: "role-user",
    });

    await setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      message: `Selamat datang, ${userRecord.name}!`,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        role: "user",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Gagal masuk sebagai klien." },
      { status: 500 }
    );
  }
}

