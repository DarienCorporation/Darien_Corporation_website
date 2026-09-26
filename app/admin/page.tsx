import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import styles from "@/components/admin/Admin.module.css";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { NavLink } from "@/components/navigation/NavLink";
import { Container } from "@/components/ui/Container";
import { getAdminConfig } from "@/lib/admin/config";
import { getAdminSession } from "@/lib/admin/session";
import { isContactFormEnabled } from "@/lib/contact-server";
import { projects } from "@/lib/content";
import { recentEvents } from "@/lib/security/audit";
import { primaryNav, site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

const fmt = (d: Date) =>
  d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";

export default async function AdminPage() {
  const cfg = getAdminConfig();
  if (!cfg) notFound();
  // Defense in depth: verify the session here too, not only in the proxy.
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const nonce = (await headers()).get("x-nonce");
  const checks = [
    { label: "Two-factor sign-in (password + TOTP)", ok: true },
    { label: "Nonce-based Content Security Policy", ok: Boolean(nonce) },
    { label: "Production build", ok: process.env.NODE_ENV === "production" },
    { label: "HTTPS site URL configured", ok: site.url.startsWith("https://") },
    { label: "Strong session secret (≥ 256 bits)", ok: cfg.sessionSecret.length >= 43 },
    { label: "Trusted client-IP header set (TRUSTED_IP_HEADER)", ok: Boolean(process.env.TRUSTED_IP_HEADER) },
    { label: "Server contact form delivery (Resend)", ok: isContactFormEnabled(), optional: true },
  ];
  const events = recentEvents(30);

  return (
    <section className={styles.page}>
      <Container>
        <header className={styles.head}>
          <div>
            <p className={`${styles.label} meta`}>
              <span className={styles.bar} aria-hidden="true" />
              Admin
            </p>
            <h1 className={styles.title}>Control room</h1>
            <p className={styles.muted}>Signed in · session expires {fmt(new Date(session.exp * 1000))}</p>
          </div>
          <LogoutButton />
        </header>

        <div className={styles.grid}>
          <article className={styles.card}>
            <h2 className={`${styles.cardTitle} meta`}>Security checklist</h2>
            <ul role="list" className={styles.checks}>
              {checks.map((c) => (
                <li key={c.label} data-ok={c.ok || undefined} data-optional={c.optional || undefined}>
                  <span className={styles.dot} aria-hidden="true" />
                  <span>{c.label}</span>
                  <span className={`${styles.state} meta`}>
                    {c.ok ? "OK" : c.optional ? "Optional" : "Action needed"}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.card}>
            <h2 className={`${styles.cardTitle} meta`}>Site</h2>
            <dl className={styles.facts}>
              <div>
                <dt className="meta">URL</dt>
                <dd>{site.url}</dd>
              </div>
              <div>
                <dt className="meta">Contact email</dt>
                <dd>{site.contact.email}</dd>
              </div>
              <div>
                <dt className="meta">Pages</dt>
                <dd>
                  {primaryNav.map((n) => (
                    <NavLink key={n.href} href={n.href} className={styles.chipLink}>
                      {n.label}
                    </NavLink>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="meta">Projects</dt>
                <dd>
                  {projects.map((p) => (
                    <NavLink key={p.slug} href={`/projects/${p.slug}`} className={styles.chipLink}>
                      {p.name}
                    </NavLink>
                  ))}
                </dd>
              </div>
            </dl>
          </article>

          <article className={`${styles.card} ${styles.wide}`}>
            <h2 className={`${styles.cardTitle} meta`}>Recent security events</h2>
            {events.length === 0 ? (
              <p className={styles.muted}>No events since the server started.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Time (UTC)</th>
                      <th scope="col">Event</th>
                      <th scope="col">Source IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e, i) => (
                      <tr key={`${e.at}-${i}`} data-type={e.type}>
                        <td>{e.at.replace("T", " ").slice(0, 19)}</td>
                        <td>{e.type}</td>
                        <td>{e.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className={`${styles.muted} ${styles.small}`}>
              Events are kept in memory and reset on restart; they are also written to your server logs. To
              sign out every session immediately, change <code>ADMIN_SESSION_VERSION</code> and redeploy.
            </p>
          </article>
        </div>
      </Container>
    </section>
  );
}
