import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isContactFormEnabled } from "@/lib/contact-server";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";
import { MailComposer } from "./MailComposer";
import styles from "./Contact.module.css";

type Props = { variant?: "home" | "page" };

function EmailChannel({ email }: { email: string }) {
  return (
    <div className={styles.channel}>
      <p className={`${styles.channelLabel} meta`}>Email</p>
      <div className={styles.emailRow}>
        <a href={`mailto:${email}`} className={styles.email}>
          <span>{email}</span>
          <ArrowUpRight className={styles.emailIcon} />
        </a>
        <CopyEmail email={email} />
      </div>
    </div>
  );
}

export function Contact({ variant = "home" }: Props) {
  const email = site.contact.email;
  const isPage = variant === "page";

  if (!isPage) {
    return (
      <section id="contact" className={styles.section} aria-labelledby="contact-title">
        <Container>
          <SectionHeading
            index="05"
            label="Contact"
            titleId="contact-title"
            title="Start a conversation."
            lead="Questions about Darien Corporation or its projects, or ideas for working together: we’d like to hear from you."
          />
          <div className={styles.band} data-reveal="">
            <EmailChannel email={email} />
            <Button href="/contact">Write to us</Button>
          </div>
        </Container>
      </section>
    );
  }

  const formEnabled = isContactFormEnabled();

  return (
    <section id="contact" className={`${styles.section} ${styles.page}`} aria-labelledby="contact-title">
      <Container>
        <SectionHeading
          index="05"
          label="Contact"
          titleId="contact-title"
          level={1}
          title="Start a conversation."
          lead="If you have a question about Darien Corporation or its projects, or want to work with us, we’d like to hear from you."
        />

        <div className={styles.layout}>
          <aside className={`${styles.channels} page-rise`} style={{ ["--rise-delay" as string]: "480ms" }}>
            <EmailChannel email={email} />

            <div className={styles.channel}>
              <p className={`${styles.channelLabel} meta`}>Company</p>
              <p className={styles.channelText}>
                {site.name}
                <br />
                Founded by {site.founder}
              </p>
            </div>

            {site.social.length > 0 ? (
              <div className={styles.channel}>
                <p className={`${styles.channelLabel} meta`}>Elsewhere</p>
                <ul role="list" className={styles.social}>
                  {site.social.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        {s.label}
                        <ArrowUpRight />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>

          <div className={`${styles.panel} page-rise`} style={{ ["--rise-delay" as string]: "580ms" }}>
            {formEnabled ? <ContactForm /> : <MailComposer email={email} />}
          </div>
        </div>
      </Container>
    </section>
  );
}
