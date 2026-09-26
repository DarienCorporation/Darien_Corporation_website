import "server-only";

/**
 * Security event log. Events are written to stdout as structured JSON (which
 * your hosting platform retains) and kept in a small in-memory ring buffer
 * for the admin dashboard. The buffer resets when the server restarts.
 */
export type AuditEvent = {
  at: string;
  type:
    | "admin.login.success"
    | "admin.login.failure"
    | "admin.login.locked"
    | "admin.logout"
    | "admin.session.invalid"
    | "contact.rate_limited"
    | "contact.rejected";
  ip: string;
  detail?: string;
};

const MAX = 200;
// Shared on globalThis: route handlers and pages are bundled separately, so a
// module-level array would give each its own copy.
const g = globalThis as typeof globalThis & { __darienAudit?: AuditEvent[] };
const store: AuditEvent[] = (g.__darienAudit ??= []);

export function audit(type: AuditEvent["type"], ip: string, detail?: string) {
  const event: AuditEvent = { at: new Date().toISOString(), type, ip, detail: detail?.slice(0, 200) };
  store.push(event);
  if (store.length > MAX) store.shift();
  console.log(JSON.stringify({ level: "security", ...event }));
}

export function recentEvents(limit = 50): AuditEvent[] {
  return store.slice(-limit).reverse();
}
