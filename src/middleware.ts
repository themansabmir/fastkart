import { NextRequest, NextResponse } from "next/server";
import { verifyAuthTokenEdge } from "@/lib/auth-edge";

const publicPaths = [
  "/",
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/dev/seed-owner",
  "/api/public",
];

const publicPathPrefixes = ["/parcel/", "/api/public/"];

function isPublicPath(pathname: string): boolean {
  if (publicPaths.includes(pathname)) return true;
  for (const prefix of publicPathPrefixes) {
    if (pathname.startsWith(prefix)) return true;
  }
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("[MIDDLEWARE] pathname:", pathname);

  // Allow public paths
  if (isPublicPath(pathname)) {
    console.log("[MIDDLEWARE] public path, allowing");
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    console.log("[MIDDLEWARE] static/internal path, allowing");
    return NextResponse.next();
  }

  // Check auth token
  const token = req.cookies.get("auth_token")?.value;
  console.log("[MIDDLEWARE] auth_token exists:", !!token);
  console.log("[MIDDLEWARE] all cookies:", req.cookies.getAll().map(c => c.name));

  if (!token) {
    console.log("[MIDDLEWARE] no token, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyAuthTokenEdge(token);
  console.log("[MIDDLEWARE] token verification result:", payload);
  if (!payload) {
    console.log("[MIDDLEWARE] invalid token, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("[MIDDLEWARE] authenticated, allowing");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
