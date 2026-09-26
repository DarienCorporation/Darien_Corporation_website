# Security — Darien Corporation Website

Last assessed: September 26, 2026 (local production build, Next.js 16.3.6).

## Assessment summary

| # | Area | Result before | Status now |
|---|------|---------------|------------|
| 1 | Contact API rate limit could be bypassed by rotating the client-supplied `X-Forwarded-For` value | **Medium** | Fixed: trusted IP header or right-most proxy entry, plus a global cap |
| 2 | Content-Security-Policy allowed `'unsafe-inline'` scripts | **Medium** | Fixed: per-request nonce + `'strict-dynamic'` |
| 3 | Contact API buffered the whole body before checking its size | Low | Fixed: streamed reader with a hard byte limit |
| 4 | Admin global lockout could be triggered by anyone to lock out the owner (found while testing the new admin) | Medium | Fixed: per-IP lockout; high global ceiling |
| 5 | Admin events not visible on the dashboard (separate module instances) | Low (functional) | Fixed |

Checks that passed: security headers, clickjacking protection, HTTP method restrictions, no source maps or secrets in client bundles, image optimizer rejects remote/internal URLs, path traversal, legacy middleware-bypass header, cross-origin (CSRF) rejection, input validation and type confusion, email header injection, `npm audit` (0 vulnerabilities).

## Admin area (`/admin`)

- **Disabled by default.** Unless all admin variables are set, `/admin`, `/admin/login` and `/api/admin/*` return 404.
- **Two factors on every sign-in:** a password (stored only as an scrypt hash, N=2¹⁷) and a 6-digit TOTP code. Codes can't be reused.
- **Brute-force protection:** 5 failures per IP per 15 minutes, then lockout. Every response takes the same minimum time, and errors never say which factor failed.
- **Sessions:** HMAC-SHA256-signed cookie, `__Host-` prefixed, `HttpOnly`, `Secure`, `SameSite=Strict`, 4-hour absolute expiry, bound to the browser that signed in.
- **Defense in depth:** the proxy checks the session, and every admin page checks it again server-side.
- **Admin responses** carry `Cache-Control: no-store`, `X-Robots-Tag: noindex` and `Referrer-Policy: no-referrer`.
- **Audit log:** sign-ins, failures, lockouts and contact abuse are written to server logs as JSON and shown on the dashboard.

### Set up

```bash
npm run admin:setup   # prompts for a password, shows a QR code for your authenticator, writes .env.local
```

For production, copy the four `ADMIN_*` values into your host's environment settings. Never commit them.

### Sign out everywhere / rotate

Re-run `npm run admin:setup`, or change `ADMIN_SESSION_VERSION`, then redeploy.

## Deployment checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to your `https://` domain.
- [ ] Set `TRUSTED_IP_HEADER` for your host (Vercel: `x-vercel-forwarded-for`; Cloudflare: `cf-connecting-ip`).
- [ ] Add the `ADMIN_*` variables (only if you want the admin area).
- [ ] After launch, submit the domain to hstspreload.org (the header is already sent).
- [ ] If you run more than one server instance, move rate limits and the audit log to a shared store (e.g. Redis/KV).

## Known trade-offs

- Pages now render per request (needed for CSP nonces) instead of being prebuilt. At this site's size the cost is small.
- `style-src` allows inline styles because the design uses inline CSS custom properties. Styles cannot execute code.
- Rate limits and the event log are in memory per instance and reset on restart.

## Reporting a vulnerability

Email dariencorporation@gmail.com.
