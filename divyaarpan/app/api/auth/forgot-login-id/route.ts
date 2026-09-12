import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isRecoveryRequestAllowed } from "@/app/lib/recovery-rate-limit";
import { addMobileCors } from "../../../lib/mobile-cors";

const GENERIC_MESSAGE = "If an account matches the provided information, recovery instructions will be sent.";
const RECOVERY_TOKEN_TTL_MS = 15 * 60 * 1000;

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

    if (!identifier || !isRecoveryRequestAllowed(request, "login-id")) {
      return addMobileCors(NextResponse.json({ success: true, message: GENERIC_MESSAGE }));
    }

    const normalizedEmail = identifier.toLowerCase();

    const pandit = await prisma.pandit.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: normalizedEmail,
              mode: "insensitive",
            },
          },
          {
            mobile: identifier,
          },
          {
            user: {
              email: {
                equals: normalizedEmail,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      select: {
        userId: true,
      },
    });

    if (pandit?.userId) {
      const rawToken = randomBytes(32).toString("hex");
      await prisma.loginIdRecoveryToken.updateMany({
        where: { userId: pandit.userId, usedAt: null },
        data: { usedAt: new Date() },
      });
      await prisma.loginIdRecoveryToken.create({
        data: {
          userId: pandit.userId,
          tokenHash: hashToken(rawToken),
          expiresAt: new Date(Date.now() + RECOVERY_TOKEN_TTL_MS),
        },
      });
    }

    return addMobileCors(NextResponse.json({
      success: true,
      message: GENERIC_MESSAGE,
    }));
  } catch (error) {
    console.error("FORGOT LOGIN ID ERROR:", error);

    return addMobileCors(
      NextResponse.json(
        { success: true, message: GENERIC_MESSAGE },
      )
    );
  }
}
