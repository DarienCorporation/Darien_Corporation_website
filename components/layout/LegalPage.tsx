import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { LegalSwitch, LegalToc } from "./LegalNav";
import styles from "./LegalPage.module.css";

type Props = { title: string; updated: string; children: ReactNode };

export function LegalPage({ title, updated, children }: Props) {
  return (
    <article className={styles.page}>
      <Container>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <p className={`${styles.label} meta`}>
              <span className={styles.bar} aria-hidden="true" />
              Legal
            </p>
            <LegalSwitch />
          </div>
          <h1 className={styles.title}>{title}</h1>
          <p className={`${styles.updated} meta`}>Last updated {updated}</p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.aside}>
            <LegalToc />
          </aside>
          <div>
            <div className={styles.prose} data-legal-prose="">
              {children}
            </div>
            <div className={styles.contactCard}>
              <p className="meta">Questions?</p>
              <p>
                Email{" "}
                <a href={`mailto:${site.contact.email}`} className={styles.contactEmail}>
                  {site.contact.email}
                </a>{" "}
                and we’ll get back to you.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
