import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getAuthUser } from "@/lib/auth";
import logger from "@/lib/logger";

export async function POST() {
  const user = await getAuthUser();
  if (user) {
    logger.info("User logged out", { userId: user.userId, email: user.email });
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
