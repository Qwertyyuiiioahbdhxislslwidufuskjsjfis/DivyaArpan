import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isRecoveryRequestAllowed } from "@/app/lib/recovery-rate-limit";
import { addMobileCors } from "../../../lib/mobile-cors";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const GENERIC_MESSAGE = "If an account matches the provided information, recovery instructions will be sent.";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function OPTIONS() {
  return addMobileCors(
    new NextResponse(null, { status: 204 })
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const identifier =
      typeof body.identifier === "string"
        ? body.identifier.trim()
        : "";

    if (!identifier || !isRecoveryRequestAllowed(request, "password")) {
      return addMobileCors(NextResponse.json({ success: true, message: GENERIC_MESSAGE }));
    }

    const normalizedEmail = identifier.toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: normalizedEmail,
              mode: "insensitive",
            },
          },
          {
            phone: identifier,
          },
        ],
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return addMobileCors(NextResponse.json({ success: true, message: GENERIC_MESSAGE }));
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const responseBody: {
      success: true;
      message: string;
      resetToken?: string;
    } = {
      success: true,
      message: GENERIC_MESSAGE,
    };

    // Development only:
    // allows us to test the complete password-reset flow
    // before an email/SMS provider is configured.
    if (process.env.NODE_ENV !== "production") {
      responseBody.resetToken = rawToken;
    }

    return addMobileCors(
      NextResponse.json(responseBody)
    );
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return addMobileCors(
      NextResponse.json(
        { success: true, message: GENERIC_MESSAGE },
      )
    );
  }
}
