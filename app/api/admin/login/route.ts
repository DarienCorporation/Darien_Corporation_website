import { NextResponse, type NextRequest } from "next/server";
import { getAdminConfig } from "@/lib/admin/config";
import { verifyPassword, verifyTotp } from "@/lib/admin/crypto";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin/session";
import { audit } from "@/lib/security/audit";
import { clientIp } from "@/lib/security/client-ip";
import { createLimiter } from "@/lib/security/rate-limit";
import { isSameOrigin, readLimitedText } from "@/lib/security/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Failed attempts: 5 per IP per 15 minutes, then that IP is locked out.
// The global ceiling is deliberately high: a low one would let anyone lock the
// real admin out, and guessing is already futile because a valid TOTP code is
// also required on every attempt.
const failures = createLimiter({ windowMs: 15 * 60 * 1000, perKey: 5, global: 100 });
const MIN_RESPONSE_MS = 900;

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

async function padTo(start: number) {
  const wait = MIN_RESPONSE_MS - (Date.now() - start);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  const cfg = getAdminConfig();
  if (!cfg) return new NextResponse(null, { status: 404 });

  const ip = clientIp(req.headers);
  if (!isSameOrigin(req.headers)) return json(403, { error: "Forbidden." });
  if (!req.headers.get("content-type")?.includes("application/json"))
    return json(415, { error: "Unsupported content type." });

  if (failures.blocked(ip)) {
    audit("admin.login.locked", ip);
    await padTo(start);
    return json(429, { error: "Too many attempts. Try again in 15 minutes." });
  }

  const text = await readLimitedText(req, 2048);
  let password = "";
  let code = "";
  try {
    const body = JSON.parse(text ?? "") as Record<string, unknown>;
    password = typeof body.password === "string" ? body.password.slice(0, 256) : "";
    code = typeof body.code === "string" ? body.code.replace(/\s+/g, "") : "";
  } catch {
    /* treated as a failed attempt below */
  }

  // Always run both checks so timing doesn't reveal which factor failed.
  const [passwordOk, codeOk] = await Promise.all([
    password ? verifyPassword(password, cfg.passwordHash) : Promise.resolve(false),
    Promise.resolve(verifyTotp(cfg.totpSecret, code)),
  ]);

  if (!passwordOk || !codeOk) {
    failures.hit(ip);
    audit("admin.login.failure", ip);
    await padTo(start);
    return json(401, { error: "Invalid credentials." });
  }

  failures.reset(ip);
  const { token } = createSessionToken(req.headers.get("user-agent"));
  audit("admin.login.success", ip);
  await padTo(start);
  const res = json(200, { ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
