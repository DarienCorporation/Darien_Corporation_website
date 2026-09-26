import type { Metadata } from "next";
import { NavLink } from "@/components/navigation/NavLink";
import { PageTransition } from "@/components/navigation/PageTransition";
import { LegalPage } from "@/components/layout/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles information on this website.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PageTransition>
      <LegalPage title="Privacy Policy" updated="September 26, 2026">
        <p>
          This policy explains how {site.name} (“we”, “us”) handles information when you visit this website or
          contact us through it.
        </p>

        <h2>Information we collect</h2>
        <p>
          This website does not use analytics, advertising, or tracking cookies. We only collect information
          you choose to send us:
        </p>
        <ul>
          <li>
            If you use the contact form or email us, we receive the details you provide, such as your name,
            email address, organization, and message.
          </li>
          <li>
            The “Write to us” composer on our contact page only prepares a message in your own email app.
            Nothing you type there is sent to or stored by this website unless you choose to send the email.
          </li>
          <li>
            Like most websites, our hosting infrastructure may process technical data such as IP addresses and
            request logs so that the site can be delivered and protected from abuse.
          </li>
        </ul>

        <h2>How we use it</h2>
        <p>
          We use information you send us only to read and reply to your message. We do not sell your
          information or use it for advertising.
        </p>

        <h2>Service providers</h2>
        <p>
          We rely on third-party providers to host this website and to deliver contact form messages to us by
          email. They process information only as needed to provide those services.
        </p>

        <h2>Retention</h2>
        <p>
          We keep messages only as long as we need them to respond and to keep reasonable records of our
          correspondence.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us to access, correct, or delete information you have sent us. To make a request,{" "}
          <NavLink href="/contact">contact us</NavLink>.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes, we will post the updated version on this page and revise the date above.
        </p>
      </LegalPage>
    </PageTransition>
  );
}
