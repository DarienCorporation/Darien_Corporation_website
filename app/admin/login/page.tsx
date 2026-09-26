import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import styles from "@/components/admin/Admin.module.css";
import { Container } from "@/components/ui/Container";
import { isAdminEnabled } from "@/lib/admin/config";
import { getAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLoginPage() {
  if (!isAdminEnabled()) notFound();
  if (await getAdminSession()) redirect("/admin");
  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.loginCard}>
          <p className={`${styles.label} meta`}>
            <span className={styles.bar} aria-hidden="true" />
            Restricted
          </p>
          <h1 className={styles.loginTitle}>Admin sign-in</h1>
          <p className={styles.muted}>Password and a code from your authenticator app are both required.</p>
          <LoginForm />
        </div>
      </Container>
    </section>
  );
}
