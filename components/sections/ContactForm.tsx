"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import {
  CONTACT_LIMITS,
  normalizeContact,
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "@/lib/contact";
import styles from "./Contact.module.css";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const fieldId = (name: keyof ContactInput) => `${uid}-${name}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const input = normalizeContact(data);
    const found = validateContact(input);
    setErrors(found);
    setServerError(null);
    const firstInvalid = Object.keys(found)[0] as keyof ContactInput | undefined;
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website: data.website ?? "" }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; errors?: ContactErrors };
      if (!res.ok) {
        if (body.errors) setErrors(body.errors);
        setServerError(body.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      formRef.current?.reset();
      setStatus("sent");
    } catch {
      setServerError("We couldn’t reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.success} role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <span className={styles.successMark} aria-hidden="true" />
        <p className={styles.successTitle}>Message sent.</p>
        <p className={styles.successBody}>Thank you for getting in touch. We read every message.</p>
        <Button variant="secondary" onClick={() => setStatus("idle")} icon={false}>
          Send another message
        </Button>
      </div>
    );
  }

  const describedBy = (name: keyof ContactInput) => (errors[name] ? `${fieldId(name)}-error` : undefined);

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${uid}-note`}
    >
      <div className={styles.row}>
        <Field id={fieldId("name")} label="Name" error={errors.name}>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name.max}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
          />
        </Field>
        <Field id={fieldId("email")} label="Email" error={errors.email}>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={CONTACT_LIMITS.email.max}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
          />
        </Field>
      </div>
      <Field id={fieldId("organization")} label="Organization" optional error={errors.organization}>
        <input
          id={fieldId("organization")}
          name="organization"
          type="text"
          autoComplete="organization"
          maxLength={CONTACT_LIMITS.organization.max}
          aria-invalid={errors.organization ? true : undefined}
          aria-describedby={describedBy("organization")}
        />
      </Field>
      <Field id={fieldId("message")} label="Message" error={errors.message}>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={6}
          required
          maxLength={CONTACT_LIMITS.message.max}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message")}
        />
      </Field>

      {/* Honeypot — hidden from people and assistive tech. */}
      <div className={styles.hp} aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={styles.submitRow}>
        <p id={`${uid}-note`} className={styles.note}>
          Your details are used only to reply to your message.
        </p>
        <Button type="submit" loading={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
      </div>

      <p className={styles.serverError} role="alert">
        {serverError}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field} data-invalid={error ? "" : undefined}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional ? <span className={styles.optional}>Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
