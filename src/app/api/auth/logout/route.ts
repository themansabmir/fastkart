import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  logger.api.request("POST", "/api/auth/logout", { ip });

  const response = NextResponse.json({ success: true });

  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  logger.info("User logged out", { route: "/api/auth/logout", ip });

  return response;
}
