import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { getAdminConfig } from "./config";
import { sign, unsign } from "./crypto";

export const SESSION_TTL_SECONDS = 4 * 60 * 60; // 4 hours, absolute

const isProd = process.env.NODE_ENV === "production";
// __Host- prefix: Secure, Path=/, no Domain — cannot be set by subdomains.
export const SESSION_COOKIE = isProd ? "__Host-darien-admin" : "darien-admin";

type SessionPayload = { v: string; sid: string; iat: number; exp: number; ua: string };

const uaHash = (ua: string | null) =>
  createHash("sha256")
    .update(ua ?? "")
    .digest("base64url")
    .slice(0, 16);

export function createSessionToken(userAgent: string | null) {
  const cfg = getAdminConfig();
  if (!cfg) throw new Error("Admin disabled");
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    v: cfg.sessionVersion,
    sid: randomUUID(),
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    ua: uaHash(userAgent),
  };
  return { token: sign(payload, cfg.sessionSecret), payload };
}

/** Verifies a raw token. Used by both the proxy and server components. */
export function verifySessionToken(token: string | undefined, userAgent: string | null) {
  const cfg = getAdminConfig();
  if (!cfg || !token) return null;
  const p = unsign<SessionPayload>(token, cfg.sessionSecret);
  if (!p) return null;
  const now = Math.floor(Date.now() / 1000);
  if (p.v !== cfg.sessionVersion || p.exp <= now || p.iat > now + 60) return null;
  if (p.ua !== uaHash(userAgent)) return null; // bound to the browser that signed in
  return p;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

/** Server-side session check for pages and route handlers (never rely on the proxy alone). */
export async function getAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const ua = (await headers()).get("user-agent");
  return verifySessionToken(token, ua);
}
