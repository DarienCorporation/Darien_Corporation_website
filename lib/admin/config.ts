import "server-only";

/**
 * Admin configuration from server-only environment variables (generate them
 * with `npm run admin:setup`). If anything is missing or weak, the admin area
 * is disabled entirely and /admin returns 404.
 */
export function getAdminConfig() {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const totpSecret = process.env.ADMIN_TOTP_SECRET?.trim();
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  const sessionVersion = process.env.ADMIN_SESSION_VERSION?.trim() || "1";
  if (!passwordHash?.startsWith("scrypt:") || !totpSecret || !sessionSecret || sessionSecret.length < 43) {
    return null;
  }
  return { passwordHash, totpSecret, sessionSecret, sessionVersion };
}

export const isAdminEnabled = () => getAdminConfig() !== null;
