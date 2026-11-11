import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { db, UserRecord } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Password saat ini dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    const user = await db.get<UserRecord>("Users", session.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Data pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const isMatch = await verifyPassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Password saat ini tidak sesuai." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await db.update<UserRecord>("Users", session.id, {
      password_hash: newHash,
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui. Simpan password baru Anda dengan aman.",
    });
  } catch (err: any) {
    console.error("Gagal mengganti password:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

