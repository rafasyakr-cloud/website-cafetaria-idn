import { NextResponse } from "next/server";
import { db, NewsRecord } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // List all and filter defensively to handle case differences in Google Spreadsheet
    const all = await db.list<NewsRecord>("News");
    const published = all.filter((item) => {
      const s = String(item.status || "").toLowerCase().trim();
      return s === "published" || s === "";
    });

    published.sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });

    return NextResponse.json(
      { success: true, articles: published },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
