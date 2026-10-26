import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { registerValidationSchema } from "@/lib/validations/yupAuth";
import logger from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let validData;
    try {
      validData = await registerValidationSchema.validate(body, { abortEarly: false });
    } catch (err: any) {
      const errors = err.inner?.reduce((acc: Record<string, string>, curr: any) => {
        if (curr.path) acc[curr.path] = curr.message;
        return acc;
      }, {}) || {};

      logger.warn("Registration failed validation", { errors });
      return NextResponse.json(
        { success: false, error: err.errors?.[0] || "Invalid input data", details: errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validData;

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      logger.warn("Registration rejected: Email already registered", { email });
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "customer",
    });

    const token = await signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: "customer",
    });

    logger.info("New customer registered successfully", {
      userId: newUser._id,
      email: newUser.email,
      role: "customer",
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: "customer",
        },
      },
      { status: 201 }
    );

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
    logger.error("Customer registration failed", { error: error.message, stack: error.stack });
    return NextResponse.json(
      { success: false, error: error.message || "Failed to register customer" },
      { status: 500 }
    );
  }
}
