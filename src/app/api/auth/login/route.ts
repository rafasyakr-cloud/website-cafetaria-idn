import { NextResponse } from "next/server";
import { db, UserRecord, RoleRecord } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const users = await db.find<UserRecord>("Users", { email: trimmedEmail });

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    const user = users[0];

    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Akun Anda sedang dinonaktifkan. Hubungi admin." },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // Ambil detail role dengan pencarian multi-kunci yang tangguh
    let roleName = "user";
    if (user.role_id === "admin" || user.role_id === "role-admin") {
      roleName = "admin";
    } else {
      const allRoles = await db.list<RoleRecord>("Roles");
      const matchedRole = allRoles.find(
        (r) => r.id === user.role_id || r.name === user.role_id
      );
      if (matchedRole) {
        roleName = matchedRole.name;
      }
    }

    const effectiveRoleId = roleName === "admin" ? "role-admin" : user.role_id;

    const sessionToken = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
      roleId: effectiveRoleId,
    });

    await setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      message: "Berhasil masuk.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
