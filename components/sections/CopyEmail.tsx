"use client";

import { useEffect, useState } from "react";
import styles from "./Contact.module.css";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      /* Clipboard unavailable; the mailto link still works. */
    }
  }

  return (
    <button type="button" className={styles.copy} onClick={copy} data-copied={copied || undefined}>
      <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
      <span className="visually-hidden" aria-live="polite">
        {copied ? "Email address copied" : `Copy ${email}`}
      </span>
    </button>
  );
}
