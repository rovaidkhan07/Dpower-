import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  return secret ? new TextEncoder().encode(secret) : null;
}

export const ADMIN_COOKIE_NAME = "Kharidly_admin_session";
export const CUSTOMER_COOKIE_NAME = "Kharidly_customer_session";

// Backwards compatibility
export const AUTH_COOKIE_NAME = ADMIN_COOKIE_NAME;

export interface UserSessionPayload {
  id: string;
  sessionVersion: number;
  email: string;
  name: string;
  phone?: string | null;
  role: "customer" | "admin";
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: UserSessionPayload): Promise<string> {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable. Cannot create session securely.");
  }

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  const secret = getJwtSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (typeof payload.id !== "string" || !payload.id) return null;
    // Existing sessions are version 0 until the first password reset.
    const version = payload.sessionVersion ?? 0;
    if (typeof version !== "number" || !Number.isSafeInteger(version) || version < 0) return null;
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, phone: true, role: true, sessionVersion: true },
    });
    if (!user || user.sessionVersion !== version || (user.role !== "admin" && user.role !== "customer")) {
      return null;
    }
    return {
      id: user.id, email: user.email, name: user.name, phone: user.phone,
      role: user.role, sessionVersion: user.sessionVersion,
    };
  } catch {
    return null;
  }
}

// ---------------- Admin Session Helpers ----------------

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function removeAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  cookieStore.delete(CUSTOMER_COOKIE_NAME);
}

export async function getAdminSession(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
    }
    if (!token) return null;
    const session = await verifySessionToken(token);
    if (!session || session.role !== "admin") return null;
    return session;
  } catch {
    return null;
  }
}

// ---------------- Customer Session Helpers ----------------

export async function setCustomerSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 14 * 24 * 60 * 60, // 14 days
  });
}

export async function removeCustomerSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE_NAME);
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getCustomerSession(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
    if (!token) {
      token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    }
    if (!token) return null;
    const session = await verifySessionToken(token);
    if (!session) return null;
    return session;
  } catch {
    return null;
  }
}

