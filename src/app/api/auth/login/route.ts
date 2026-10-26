import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { comparePassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { loginValidationSchema } from "@/lib/validations/yupAuth";
import logger from "@/lib/logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();

    let validData;
    try {
      validData = await loginValidationSchema.validate(body, { abortEarly: false });
    } catch (err: any) {
      const errors = err.inner?.reduce((acc: Record<string, string>, curr: any) => {
        if (curr.path) acc[curr.path] = curr.message;
        return acc;
      }, {}) || {};

      logger.warn("Login failed validation", { errors });
      return NextResponse.json(
        { success: false, error: err.errors?.[0] || "Invalid input data", details: errors },
        { status: 400 }
      );
    }

    const { email, password } = validData;

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      logger.warn("Failed login attempt - user not found", { email });
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password as string);
    if (!isMatch) {
      logger.warn("Failed login attempt - invalid password", { email: user.email, userId: user._id });
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const duration = Date.now() - startTime;
    logger.info("User authenticated successfully", {
      userId: user._id,
      email: user.email,
      role: user.role,
      durationMs: duration,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    logger.error("Error during authentication process", { error: error.message, stack: error.stack });
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
