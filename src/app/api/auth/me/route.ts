import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifyAuthTokenEdge } from "@/lib/auth-edge";
import { logger } from "@/lib/logger";

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

export async function GET(req: NextRequest) {
  const start = Date.now();
  const ip = getClientIP(req);
  logger.api.request("GET", "/api/auth/me", { ip });

  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      logger.warn("Unauthorized request - no token", { route: "/api/auth/me", method: "GET", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthTokenEdge(token);
    if (!payload) {
      logger.warn("Unauthorized request - invalid token", { route: "/api/auth/me", method: "GET", ip });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(payload.userId)
      .select("_id email name role")
      .lean();

    if (!user) {
      logger.warn("User not found", { route: "/api/auth/me", method: "GET", ip, userId: payload.userId });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.api.response("GET", "/api/auth/me", 200, Date.now() - start, { userId: payload.userId });

    return NextResponse.json({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.api.error("GET", "/api/auth/me", error, { ip });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
