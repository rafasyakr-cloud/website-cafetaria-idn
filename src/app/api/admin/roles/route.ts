import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, RoleRecord } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const roles = await db.list<RoleRecord>("Roles");
    return NextResponse.json({ success: true, roles });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Nama role wajib diisi." }, { status: 400 });
    }

    const trimmedName = name.trim().toLowerCase();
    const existing = await db.find<RoleRecord>("Roles", { name: trimmedName });
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Nama role ini sudah digunakan." }, { status: 409 });
    }

    const newRole = await db.insert<RoleRecord>("Roles", {
      name: trimmedName,
      description: description || "",
      permissions: permissions || [],
      is_system: false,
    });

    return NextResponse.json({ success: true, role: newRole });
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
    const { id, description, permissions } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID role diperlukan." }, { status: 400 });
    }

    const target = await db.get<RoleRecord>("Roles", id);
    if (!target) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    const updates: Partial<RoleRecord> = {};
    if (description !== undefined) updates.description = description;
    if (permissions !== undefined) updates.permissions = permissions;

    const updated = await db.update<RoleRecord>("Roles", id, updates);
    return NextResponse.json({ success: true, role: updated });
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
      return NextResponse.json({ success: false, error: "ID role diperlukan." }, { status: 400 });
    }

    const target = await db.get<RoleRecord>("Roles", id);
    if (!target) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    // Role bawaan sistem tidak boleh dihapus
    if (target.is_system) {
      return NextResponse.json(
        { success: false, error: "Role bawaan sistem tidak dapat dihapus." },
        { status: 400 }
      );
    }

    const deleted = await db.delete("Roles", id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

