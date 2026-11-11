import { NextResponse } from "next/server";
import { db, NewsRecord } from "@/lib/db";

export async function GET() {
  try {
    const all = await db.find<NewsRecord>("News", { status: "published" });
    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return NextResponse.json({ success: true, articles: all });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

