import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { hashPassword } from "@/app/lib/auth";
import { addMobileCors } from "../../../lib/mobile-cors";

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

    const token =
      typeof body.token === "string"
        ? body.token.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!token) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            error: "Invalid or missing password reset token.",
          },
          { status: 400 }
        )
      );
    }

    if (password.length < 8) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            error: "Password must be at least 8 characters long.",
          },
          { status: 400 }
        )
      );
    }

    const tokenHash = hashToken(token);

    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          tokenHash,
        },
        select: {
          id: true,
          userId: true,
          expiresAt: true,
          usedAt: true,
        },
      });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt <= new Date()
    ) {
      return addMobileCors(
        NextResponse.json(
          {
            success: false,
            error: "This password reset link is invalid or has expired.",
          },
          { status: 400 }
        )
      );
    }

    const passwordHash = await hashPassword(password);

    /*
     * Change the password and invalidate all existing
     * login sessions in one transaction.
     */
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          passwordHash,
        },
      }),

      prisma.passwordResetToken.update({
        where: {
          id: resetToken.id,
        },
        data: {
          usedAt: new Date(),
        },
      }),

      prisma.authSession.deleteMany({
        where: {
          userId: resetToken.userId,
        },
      }),
    ]);

    return addMobileCors(
      NextResponse.json({
        success: true,
        message:
          "Your password has been reset successfully. You can now log in.",
      })
    );
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return addMobileCors(
      NextResponse.json(
        {
          success: false,
          error: "Unable to reset your password right now.",
        },
        { status: 500 }
      )
    );
  }
}
