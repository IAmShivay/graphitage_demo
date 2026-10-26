import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_production_ready_jwt_signing_key_ecommerce_2026";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const AUTH_COOKIE_NAME = "auth_session_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Authentication required." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const userRole = payload.role as string;

    if (userRole !== "admin") {
      if (isAdminApi) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden: Administrator permissions required.",
          },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", (payload.userId as string) || "");
    requestHeaders.set("x-user-email", (payload.email as string) || "");
    requestHeaders.set("x-user-role", userRole);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid or expired session." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
