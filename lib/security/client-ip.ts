import "server-only";

/**
 * Resolve the client IP for rate limiting.
 *
 * The left-most X-Forwarded-For value is supplied by the client and trivially
 * spoofed, so it is never trusted. Prefer a header set by your platform
 * (configure TRUSTED_IP_HEADER, e.g. "x-vercel-forwarded-for" on Vercel or
 * "cf-connecting-ip" behind Cloudflare). Otherwise fall back to the right-most
 * X-Forwarded-For entry, which is appended by the nearest proxy.
 */
export function clientIp(headers: Headers): string {
  const trusted = process.env.TRUSTED_IP_HEADER?.trim().toLowerCase();
  if (trusted) {
    const v = headers.get(trusted)?.split(",")[0]?.trim();
    if (v) return v.slice(0, 64);
  }
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last.slice(0, 64);
  }
  return headers.get("x-real-ip")?.trim().slice(0, 64) || "unknown";
}
