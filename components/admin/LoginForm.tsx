"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./Admin.module.css";

export function LoginForm() {
  const uid = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const code = String(form.get("code") ?? "").replace(/\s+/g, "");
    if (!password || !/^\d{6}$/.test(code)) {
      setError("Enter your password and the 6-digit code from your authenticator app.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code }),
        credentials: "same-origin",
      });
      if (res.ok) {
        window.location.assign("/admin");
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Sign-in failed.");
      if (codeRef.current) codeRef.current.value = "";
    } catch {
      setError("Couldn’t reach the server. Try again.");
    }
    setPending(false);
  }

  return (
    <form className={styles.loginForm} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor={`${uid}-pw`}>Password</label>
        <input
          id={`${uid}-pw`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={256}
          autoFocus
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-code`}>Authentication code</label>
        <input
          ref={codeRef}
          id={`${uid}-code`}
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          className={styles.code}
        />
      </div>
      <p className={styles.error} role="alert">
        {error}
      </p>
      <Button type="submit" loading={pending}>
        {pending ? "Verifying…" : "Sign in"}
      </Button>
    </form>
  );
}
