import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { signAuthTokenEdge } from "@/lib/auth-edge";
import { logger } from "@/lib/logger";

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const start = Date.now();
  const ip = getClientIP(req);
  logger.api.request("POST", "/api/auth/login", { ip });

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      logger.warn("Login validation failed", { route: "/api/auth/login", ip });
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email }).lean();
    if (!user) {
      logger.warn("Login failed - user not found", { route: "/api/auth/login", ip, email });
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      logger.warn("Login failed - invalid password", { route: "/api/auth/login", ip, email });
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signAuthTokenEdge({
      userId: String(user._id),
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    logger.api.response("POST", "/api/auth/login", 200, Date.now() - start, {
      userId: String(user._id),
      email: user.email,
    });

    return response;
  } catch (error) {
    logger.api.error("POST", "/api/auth/login", error, { ip });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
