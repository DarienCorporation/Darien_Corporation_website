import { NextResponse, type NextRequest } from "next/server";
import { isAdminEnabled } from "@/lib/admin/config";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

const isDev = process.env.NODE_ENV !== "production";

function buildCsp(nonce: string) {
  return [
    "default-src 'self'",
    // Only scripts carrying this request's nonce (and what they load) may run.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Inline style attributes are used for CSS custom properties; styles cannot execute code.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${isDev ? " ws:" : ""}`,
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---- Admin gate (the admin pages re-check the session server-side too) ----
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAdminEnabled()) {
      return new NextResponse("Not Found", { status: 404 });
    }
    const isLogin = pathname === "/admin/login";
    const session = verifySessionToken(
      request.cookies.get(SESSION_COOKIE)?.value,
      request.headers.get("user-agent"),
    );
    if (!isLogin && !session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url, 303);
    }
    if (isLogin && session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url, 303);
    }
  }

  // ---- Per-request nonce CSP ----
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  if (pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("Referrer-Policy", "no-referrer");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|brand/|icon.png|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image).*)",
  ],
};
