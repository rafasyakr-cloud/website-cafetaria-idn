import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, NewsRecord } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const article = await db.get<NewsRecord>("News", params.id);
    if (!article) {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, article });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const article = await db.get<NewsRecord>("News", params.id);
    if (!article) {
      return NextResponse.json({ success: false, error: "Artikel tidak ditemukan." }, { status: 404 });
    }

    const updates: Partial<NewsRecord> = {};
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.slug !== undefined) updates.slug = body.slug.trim();
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt.trim();
    if (body.content !== undefined) updates.content = body.content.trim();
    if (body.thumbnail_path !== undefined) updates.thumbnail_path = body.thumbnail_path;
    if (body.status !== undefined) updates.status = body.status;

    const updated = await db.update<NewsRecord>("News", params.id, updates);
    return NextResponse.json({ success: true, article: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const article = await db.get<NewsRecord>("News", params.id);
    if (article) {
      // Hapus file upload lokal jika ada
      if (article.thumbnail_path?.startsWith("/uploads/")) {
        await deleteFile(article.thumbnail_path);
      }
    }

    const deleted = await db.delete("News", params.id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

