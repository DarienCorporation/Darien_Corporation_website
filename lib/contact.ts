/**
 * Contact form validation shared by the client (instant feedback) and the
 * server route (authoritative). Keep limits in sync by using this module only.
 */

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  organization: { max: 120 },
  message: { min: 20, max: 4000 },
} as const;

export type ContactInput = {
  name: string;
  email: string;
  organization: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Strip control characters (keeps newlines/tabs in the message) and trim. */
function sanitize(value: unknown, multiline = false): string {
  if (typeof value !== "string") return "";
  const pattern = multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(pattern, "").trim();
}

export function normalizeContact(raw: Record<string, unknown>): ContactInput {
  return {
    name: sanitize(raw.name),
    email: sanitize(raw.email).toLowerCase(),
    organization: sanitize(raw.organization),
    message: sanitize(raw.message, true),
  };
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const { name, email, organization, message } = CONTACT_LIMITS;

  if (input.name.length < name.min) errors.name = "Please enter your name.";
  else if (input.name.length > name.max) errors.name = `Please keep your name under ${name.max} characters.`;

  if (!input.email) errors.email = "Please enter your email address.";
  else if (input.email.length > email.max || !EMAIL_RE.test(input.email))
    errors.email = "Please enter a valid email address.";

  if (input.organization.length > organization.max)
    errors.organization = `Please keep this under ${organization.max} characters.`;

  if (input.message.length < message.min) errors.message = `Please write at least ${message.min} characters.`;
  else if (input.message.length > message.max)
    errors.message = `Please keep your message under ${message.max} characters.`;

  return errors;
}
