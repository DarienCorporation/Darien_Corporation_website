import "server-only";

/** Server-only contact delivery configuration. Never import from client code. */
export function getContactDelivery() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_FORM_TO?.trim();
  const from = process.env.CONTACT_FORM_FROM?.trim();
  if (!apiKey || !to || !from) return null;
  return { apiKey, to, from };
}

export function isContactFormEnabled(): boolean {
  return getContactDelivery() !== null;
}
