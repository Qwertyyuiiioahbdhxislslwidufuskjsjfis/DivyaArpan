import { cookies } from "next/headers";
import { prisma } from "../../lib/prisma";
import {
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
export const SESSION_COOKIE = "divyaarpan_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export type AuthRole = "ADMIN" | "PANDIT" | "DEVOTEE";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: AuthRole;
  panditId: number | null;
  devoteeId: number | null;
};

type UserRow = AuthUser & { passwordHash?: string };

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, key] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !key) return false;

  const expected = Buffer.from(key, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function findUserByEmail(email: string) {
  const rows = await prisma.$queryRaw<UserRow[]>`
    SELECT u.id, u.name, u.email, u.phone, u.role::text AS role,
      u."passwordHash", p.id AS "panditId", d.id AS "devoteeId"
    FROM "User" u
    LEFT JOIN "Pandit" p ON p."userId" = u.id
    LEFT JOIN "Devotee" d ON d."userId" = u.id
    WHERE LOWER(u.email) = LOWER(${email})
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createSession(userId: number) {
  const sessionId = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.$executeRaw`
    INSERT INTO "AuthSession" (id, "userId", "expiresAt")
    VALUES (${sessionId}, ${userId}, ${expiresAt})
  `;
  return { sessionId, expiresAt };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const rows = await prisma.$queryRaw<AuthUser[]>`
    SELECT u.id, u.name, u.email, u.phone, u.role::text AS role,
      p.id AS "panditId", d.id AS "devoteeId"
    FROM "AuthSession" s
    JOIN "User" u ON u.id = s."userId"
    LEFT JOIN "Pandit" p ON p."userId" = u.id
    LEFT JOIN "Devotee" d ON d."userId" = u.id
    WHERE s.id = ${sessionId} AND s."expiresAt" > NOW()
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function requireRole(...roles: AuthRole[]) {
  const user = await getCurrentUser();
  if (!user || !roles.includes(user.role)) return null;
  return user;
}