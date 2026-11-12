import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, NewsRecord } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const news = await db.list<NewsRecord>("News");
    // Sort descending by created_at
    news.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, news });
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
    const { title, slug, excerpt, content, thumbnail_path, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Judul dan isi artikel wajib diisi." },
        { status: 400 }
      );
    }

    const finalSlug = slug ? generateSlug(slug) : generateSlug(title);
    const newArticle = await db.insert<NewsRecord>("News", {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() || title.trim(),
      content: content.trim(),
      thumbnail_path: thumbnail_path || "/images/menu/v60-gayo.jpg",
      status: status === "draft" ? "draft" : "published",
      author_id: session.id,
    });

    return NextResponse.json({ success: true, article: newArticle });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

