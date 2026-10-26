import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: true, user: null }, { status: 200 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
