import { NavLink } from "@/components/navigation/NavLink";
import { Container } from "@/components/ui/Container";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { legalNav, primaryNav, site } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <NavLink href="/" className={styles.logoLink} aria-label={`${site.name} — home`}>
              <Logo width={150} alt="" />
            </NavLink>
            <p className={styles.tagline}>{site.tagline}</p>
          </div>

          <nav className={styles.cols} aria-label="Footer">
            <div className={styles.col}>
              <p className={`${styles.colTitle} meta`}>Company</p>
              <ul role="list">
                {primaryNav.map((item) => (
                  <li key={item.id}>
                    <NavLink href={item.href} className={styles.link}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.col}>
              <p className={`${styles.colTitle} meta`}>Contact</p>
              <ul role="list">
                {site.contact.email ? (
                  <li>
                    <a href={`mailto:${site.contact.email}`} className={styles.link}>
                      {site.contact.email}
                    </a>
                  </li>
                ) : null}
                <li>
                  <NavLink href="/contact" className={styles.link}>
                    Get in touch
                  </NavLink>
                </li>
                {site.social.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                      {s.label}
                      <ArrowUpRight className={styles.ext} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.col}>
              <p className={`${styles.colTitle} meta`}>Legal</p>
              <ul role="list">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <NavLink href={item.href} className={styles.link}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <a href="#top" className={styles.backTop}>
            Back to top
            <span aria-hidden="true" className={styles.backTopIcon}>
              ↑
            </span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
