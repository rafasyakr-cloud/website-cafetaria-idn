import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET || "cafetaria-idn-super-secret-key-2026-secure-jwt";
const secretKey = new TextEncoder().encode(AUTH_SECRET);
const COOKIE_NAME = "cafetaria_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isCustomerOrderRoute = pathname.startsWith("/pesanan") || pathname.startsWith("/checkout");

  if (!isDashboardRoute && !isAdminApiRoute && !isCustomerOrderRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Anda belum masuk." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const role = (payload as any).role;

    // Untuk rute dashboard dan api admin, hanya role 'admin' yang diizinkan
    if (isDashboardRoute || isAdminApiRoute) {
      if (role !== "admin") {
        if (isAdminApiRoute) {
          return NextResponse.json(
            { success: false, error: "Akses terlarang: Khusus administrator." },
            { status: 403 }
          );
        }
        // User biasa diarahkan ke beranda
        return NextResponse.redirect(new URL("/?access=denied", request.url));
      }
    }

    // Untuk rute /pesanan dan /checkout, semua pengguna terautentikasi (admin & user) diizinkan
    return NextResponse.next();
  } catch (err) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak valid atau telah kedaluwarsa." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*", "/pesanan", "/checkout"],
};
