"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./Contact.module.css";

const topics = [
  { id: "general", label: "General inquiry" },
  { id: "projects", label: "Our projects" },
  { id: "collaboration", label: "Collaboration" },
  { id: "press", label: "Press" },
] as const;

const MAX_MESSAGE = 2000; // keeps the mailto URL within safe limits

/**
 * Composes an email in the visitor's own mail app. Nothing is sent to or
 * stored by this website — it only prepares a mailto: link.
 */
export function MailComposer({ email }: { email: string }) {
  const uid = useId();
  const [topic, setTopic] = useState<(typeof topics)[number]["id"]>("general");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const topicLabel = topics.find((t) => t.id === topic)?.label ?? "General inquiry";

  function buildHref() {
    const cleanName = name
      .replace(/[\r\n]+/g, " ")
      .trim()
      .slice(0, 100);
    const subject = `${topicLabel}${cleanName ? ` from ${cleanName}` : ""}`;
    const body = `${message.trim()}\n\n${cleanName ? `— ${cleanName}` : ""}`.trim();
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (message.trim().length < 10) {
      setError("Please write a short message first (at least 10 characters).");
      document.getElementById(`${uid}-message`)?.focus();
      return;
    }
    setError(null);
    setOpened(true);
    window.location.href = buildHref();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.composerHead}>
        <p className={`${styles.channelLabel} meta`}>Write to us</p>
        <p className={styles.note}>Opens in your email app. Nothing is stored on this website.</p>
      </div>

      <fieldset className={styles.topicSet}>
        <legend className={styles.label}>Topic</legend>
        <div className={styles.topicChips}>
          {topics.map((t) => (
            <label key={t.id} className={styles.chip}>
              <input
                type="radio"
                name="topic"
                value={t.id}
                checked={topic === t.id}
                onChange={() => setTopic(t.id)}
              />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={`${uid}-name`} className={styles.label}>
          Your name
          <span className={styles.optional}>Optional</span>
        </label>
        <input
          id={`${uid}-name`}
          type="text"
          autoComplete="name"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.field} data-invalid={error ? "" : undefined}>
        <label htmlFor={`${uid}-message`} className={styles.label}>
          Message
          <span className={styles.optional} aria-live="polite">
            {message.length}/{MAX_MESSAGE}
          </span>
        </label>
        <textarea
          id={`${uid}-message`}
          rows={6}
          maxLength={MAX_MESSAGE}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${uid}-error` : undefined}
          placeholder={`What would you like to talk about?`}
        />
        {error ? (
          <p id={`${uid}-error`} className={styles.error}>
            {error}
          </p>
        ) : null}
      </div>

      <div className={styles.preview} aria-hidden="true">
        <span className="meta">To</span>
        <span>{email}</span>
        <span className="meta">Subject</span>
        <span>
          {topicLabel}
          {name.trim() ? ` from ${name.trim()}` : ""}
        </span>
      </div>

      <div className={styles.submitRow}>
        <p className={styles.note} role="status">
          {opened ? "Your email app should open now. If it didn’t, email us at the address shown." : ""}
        </p>
        <Button type="submit">Open in email app</Button>
      </div>
    </form>
  );
}
