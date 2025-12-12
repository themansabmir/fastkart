import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifyAuthToken, AuthTokenPayload } from "@/lib/auth";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload) return null;

  await connectDB();

  const user = await User.findById(payload.userId)
    .select("_id email name role")
    .lean();

  if (!user) return null;

  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export function getAuthPayloadFromRequest(
  cookieValue: string | undefined
): AuthTokenPayload | null {
  if (!cookieValue) return null;
  return verifyAuthToken(cookieValue);
}
