import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProRoute =
    pathname.startsWith("/clair-vision/pro") ||
    pathname.startsWith("/clair-audition/pro");

  const isAdminRoute = pathname.startsWith("/admin");

  if (!isProRoute && !isAdminRoute) return NextResponse.next();

  const token = req.cookies.get("thor_pro")?.value;

  if (!token || !await verifySession(token)) {
    const url = req.nextUrl.clone();
    url.pathname = "/connexion/praticien";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/clair-vision/pro/:path*", "/clair-audition/pro/:path*", "/admin/:path*", "/admin"],
};
