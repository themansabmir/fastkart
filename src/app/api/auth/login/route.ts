import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { signAuthTokenEdge } from "@/lib/auth-edge";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signAuthTokenEdge({
      userId: String(user._id),
      role: user.role,
    });

    console.log("[LOGIN] token generated, length:", token.length);
    console.log("[LOGIN] setting cookie auth_token");

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
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log("[LOGIN] response cookies:", response.cookies.getAll().map(c => c.name));

    return response;
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
