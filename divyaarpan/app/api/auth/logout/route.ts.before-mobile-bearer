import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../../lib/prisma";
import { SESSION_COOKIE } from "../../../lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await prisma.$executeRaw`DELETE FROM "AuthSession" WHERE id = ${sessionId}`;
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}