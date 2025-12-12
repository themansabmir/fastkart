import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const seedSecret = process.env.SEED_SECRET;
  const headerSecret = req.headers.get("x-seed-secret");

  if (!seedSecret || headerSecret !== seedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const email = process.env.SEED_OWNER_EMAIL ?? "owner@example.com";
  const password = process.env.SEED_OWNER_PASSWORD ?? "changeme123";
  const name = process.env.SEED_OWNER_NAME ?? "Owner";

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { message: "Owner user already exists", email },
      { status: 200 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    name,
    passwordHash,
    role: "OWNER",
  });

  return NextResponse.json(
    {
      message: "Owner user created",
      email: user.email,
      defaultPassword: password,
    },
    { status: 201 }
  );
}
