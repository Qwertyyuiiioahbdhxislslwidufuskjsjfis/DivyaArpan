import { NextResponse } from "next/server";
import {
  createSession,
  findUserByEmail,
  SESSION_COOKIE,
  verifyPassword,
} from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !/^\S+@\S+\.\S+$/.test(email) || !password) {
      return NextResponse.json(
        { success: false, error: "Enter a valid email and password." },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const session = await createSession(user.id);
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
    });
    response.cookies.set(SESSION_COOKIE, session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expiresAt,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Unable to sign in right now." },
      { status: 500 }
    );
  }
}