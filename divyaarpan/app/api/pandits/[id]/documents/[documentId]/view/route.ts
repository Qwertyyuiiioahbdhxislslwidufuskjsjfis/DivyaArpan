import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/lib/auth";

type RouteContext = {
  params: Promise<{ id: string; documentId: string }>;
};

function getContentType(fileName: string) {
  if (fileName.endsWith(".pdf")) return "application/pdf";
  if (fileName.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const user = await requireRole("PANDIT", "ADMIN");
  if (!user) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  const { id, documentId } = await context.params;
  const panditId = Number(id);
  const parsedDocumentId = Number(documentId);
  if (!Number.isInteger(panditId) || !Number.isInteger(parsedDocumentId)) {
    return NextResponse.json({ message: "Document not found." }, { status: 404 });
  }

  if (user.role === "PANDIT" && user.panditId !== panditId) {
    return NextResponse.json({ message: "Document not found." }, { status: 404 });
  }

  const document = await prisma.panditDocument.findFirst({
    where: { id: parsedDocumentId, panditId },
    select: { documentUrl: true },
  });
  if (!document) {
    return NextResponse.json({ message: "Document not found." }, { status: 404 });
  }

  const isPrivate = document.documentUrl.startsWith("private://");
  const source = isPrivate
    ? document.documentUrl.slice("private://".length)
    : document.documentUrl.replace(/^\/uploads\/pandits\//, "");
  const fileName = path.basename(source);
  if (!fileName || fileName !== source) {
    return NextResponse.json({ message: "Document not found." }, { status: 404 });
  }

  const filePath = isPrivate
    ? path.join(process.cwd(), "uploads", "pandits", "private", fileName)
    : path.join(process.cwd(), "public", "uploads", "pandits", fileName);

  try {
    const file = await readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": getContentType(fileName),
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "Document not found." }, { status: 404 });
  }
}