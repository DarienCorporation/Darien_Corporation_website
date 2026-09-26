import { NextResponse, type NextRequest } from "next/server";
import { normalizeContact, validateContact } from "@/lib/contact";
import { getContactDelivery } from "@/lib/contact-server";
import { audit } from "@/lib/security/audit";
import { clientIp } from "@/lib/security/client-ip";
import { createLimiter } from "@/lib/security/rate-limit";
import { isSameOrigin, readLimitedText } from "@/lib/security/request";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16 * 1024;

// 5 messages per client and 30 overall per 10 minutes (per server instance;
// use a shared store such as Redis/KV if you run several instances).
const limiter = createLimiter({ windowMs: 10 * 60 * 1000, perKey: 5, global: 30 });

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const delivery = getContactDelivery();
  if (!delivery) return json(503, { error: "The contact form is not available." });

  const ip = clientIp(req.headers);
  if (!isSameOrigin(req.headers)) {
    audit("contact.rejected", ip, "cross-origin");
    return json(403, { error: "Forbidden." });
  }
  if (!req.headers.get("content-type")?.includes("application/json"))
    return json(415, { error: "Unsupported content type." });

  if (limiter.hit(ip)) {
    audit("contact.rate_limited", ip);
    return json(429, { error: "Too many messages. Please try again later." });
  }

  const text = await readLimitedText(req, MAX_BODY_BYTES);
  if (text === null) return json(413, { error: "Message too large." });

  let raw: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    raw = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: "Invalid request." });
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success.
  if (typeof raw.website === "string" && raw.website.length > 0) return json(200, { ok: true });

  const input = normalizeContact(raw);
  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) return json(422, { error: "Please check the form.", errors });

  // Plain-text email only: user input is never interpreted as HTML.
  const body = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.organization ? `Organization: ${input.organization}` : null,
    "",
    input.message,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${delivery.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: delivery.from,
        to: [delivery.to],
        reply_to: input.email,
        subject: `${site.name} website: message from ${input.name.slice(0, 60)}`,
        text: body,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("Contact delivery failed", res.status);
      return json(502, { error: "We couldn’t send your message. Please try again later." });
    }
  } catch (err) {
    console.error("Contact delivery error", err instanceof Error ? err.name : "unknown");
    return json(502, { error: "We couldn’t send your message. Please try again later." });
  }

  return json(200, { ok: true });
}
