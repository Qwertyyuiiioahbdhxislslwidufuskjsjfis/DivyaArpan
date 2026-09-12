import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "../../../lib/auth";
import { addMobileCors } from "../../../lib/mobile-cors";
import { prisma } from "../../../../lib/prisma";

export async function OPTIONS() {
  return addMobileCors(
    new NextResponse(null, { status: 204 })
  );
}

export async function POST(request: Request) {
  try {
    const authorization =
      request.headers.get("authorization");

    let sessionId = "";

    if (authorization) {
      const [scheme, token] =
        authorization.trim().split(/\s+/, 2);

      if (
        scheme?.toLowerCase() === "bearer" &&
        token
      ) {
        sessionId = token;
      }
    }

    // Website logout continues to use the secure cookie.
    if (!sessionId) {
      const cookieStore = await cookies();

      sessionId =
        cookieStore.get(SESSION_COOKIE)?.value || "";
    }

    if (sessionId) {
      await prisma.$executeRaw`
        DELETE FROM "AuthSession"
        WHERE id = ${sessionId}
      `;
    }

    const response = addMobileCors(
      NextResponse.json({
        success: true,
      })
    );

    response.cookies.set(
      SESSION_COOKIE,
      "",
      {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return addMobileCors(
      NextResponse.json(
        {
          success: false,
          error: "Unable to sign out right now.",
        },
        { status: 500 }
      )
    );
  }
}
