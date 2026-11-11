import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, UserRecord, RoleRecord } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const users = await db.list<UserRecord>("Users");
    const roles = await db.list<RoleRecord>("Roles");
    const roleMap = new Map(roles.map((r) => [r.id, r]));

    const sanitizedUsers = users.map((u) => {
      const isRoleAdmin = u.role_id === "role-admin" || u.role_id === "admin";
      const role = roleMap.get(u.role_id) || roles.find((r) => r.name === u.role_id || r.id === u.role_id);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role_id: isRoleAdmin ? "role-admin" : (role ? role.id : u.role_id),
        role_name: isRoleAdmin ? "admin" : (role ? role.name : "user"),
        status: u.status,
        created_at: u.created_at,
        updated_at: u.updated_at,
      };
    });

    return NextResponse.json({ success: true, users: sanitizedUsers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, role_id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID pengguna diperlukan." }, { status: 400 });
    }

    const targetUser = await db.get<UserRecord>("Users", id);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // Aturan Proteksi Admin: Admin tidak bisa menonaktifkan dirinya sendiri
    if (id === session.id && status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menonaktifkan akun Anda sendiri." },
        { status: 400 }
      );
    }

    // Cek jika merubah role admin terakhir
    const isTargetAdmin = targetUser.role_id === "role-admin" || targetUser.role_id === "admin";
    if (isTargetAdmin && role_id && role_id !== "role-admin" && role_id !== "admin") {
      const allUsers = await db.list<UserRecord>("Users");
      const activeAdmins = allUsers.filter(
        (u) => (u.role_id === "role-admin" || u.role_id === "admin") && u.status === "active"
      );
      if (activeAdmins.length <= 1) {
        return NextResponse.json(
          { success: false, error: "Tidak dapat mengubah role administrator aktif terakhir." },
          { status: 400 }
        );
      }
    }

    const updates: Partial<UserRecord> = {};
    if (role_id) updates.role_id = role_id;
    if (status) updates.status = status;

    const updated = await db.update<UserRecord>("Users", id, updates);
    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID pengguna diperlukan." }, { status: 400 });
    }

    if (id === session.id) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri." },
        { status: 400 }
      );
    }

    const targetUser = await db.get<UserRecord>("Users", id);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const isTargetAdmin = targetUser.role_id === "role-admin" || targetUser.role_id === "admin";
    if (isTargetAdmin) {
      const allUsers = await db.list<UserRecord>("Users");
      const activeAdmins = allUsers.filter(
        (u) => (u.role_id === "role-admin" || u.role_id === "admin") && u.status === "active"
      );
      if (activeAdmins.length <= 1) {
        return NextResponse.json(
          { success: false, error: "Tidak dapat menghapus administrator aktif terakhir." },
          { status: 400 }
        );
      }
    }

    await db.delete("Users", id);
    return NextResponse.json({ success: true, message: "Pengguna berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
