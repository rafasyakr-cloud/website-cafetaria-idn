import { NextResponse } from "next/server";
import { db, UserRecord, RoleRecord } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password minimal terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = await db.find<UserRecord>("Users", { email: trimmedEmail });
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Alamat email ini sudah terdaftar. Silakan masuk." },
        { status: 409 }
      );
    }

    // Role default untuk registrasi adalah 'user'
    let roleUser = await db.find<RoleRecord>("Roles", { name: "user" });
    let roleId = "role-user";
    if (roleUser.length > 0) {
      roleId = roleUser[0].id;
    }

    const passwordHash = await hashPassword(password);
    const newUser = await db.insert<UserRecord>("Users", {
      name: name.trim(),
      email: trimmedEmail,
      password_hash: passwordHash,
      role_id: roleId,
      status: "active",
    });

    const sessionToken = await createSessionToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: "user",
      roleId: newUser.role_id,
    });

    await setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      message: "Pendaftaran akun berhasil.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: "user",
      },
    });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan saat pendaftaran." },
      { status: 500 }
    );
  }
}

