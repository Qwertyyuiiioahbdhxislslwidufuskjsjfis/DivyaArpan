import { NextResponse } from "next/server";
import { createSession, hashPassword, SESSION_COOKIE } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function isMobile(value: string) {
  return /^\+?[0-9]{10,15}$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const city = typeof body.city === "string" && body.city.trim() ? body.city.trim() : null;
    const state = typeof body.state === "string" && body.state.trim() ? body.state.trim() : null;

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ success: false, error: "Enter your full name." }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ success: false, error: "Enter a valid email address." }, { status: 400 });
    }
    if (!isMobile(mobile)) {
      return NextResponse.json({ success: false, error: "Enter a valid mobile number." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingDevotee = await prisma.devotee.findUnique({ where: { mobile } });
    if (existingUser || existingDevotee) {
      return NextResponse.json(
        { success: false, error: "An account with that email or mobile number already exists." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: mobile,
        passwordHash: await hashPassword(password),
        role: "DEVOTEE",
        devotee: { create: { name, email, mobile, city, state } },
      },
    });
    const session = await createSession(user.id);
    const response = NextResponse.json(
      { success: true, user: { id: user.id, name: user.name, role: user.role } },
      { status: 201 }
    );
    response.cookies.set(SESSION_COOKIE, session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expiresAt,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ success: false, error: "Unable to create your account right now." }, { status: 500 });
  }
}
