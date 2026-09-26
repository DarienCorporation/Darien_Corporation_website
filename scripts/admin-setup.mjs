// Generates admin credentials: scrypt password hash, TOTP secret, session secret.
// Run with: npm run admin:setup
import { createHmac, randomBytes, scrypt as scryptCb } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { promisify } from "node:util";
import QRCode from "qrcode";

const scrypt = promisify(scryptCb);
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32(buf) {
  let bits = 0, value = 0, out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

function totp(secretBuf, counter) {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const mac = createHmac("sha1", secretBuf).update(msg).digest();
  const o = mac[mac.length - 1] & 0xf;
  return ((mac.readUInt32BE(o) & 0x7fffffff) % 1_000_000).toString().padStart(6, "0");
}

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(s);
        else rl.output.write("*");
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

console.log("\nDarien Corporation — admin setup\n");

const password = await ask("New admin password (min 14 characters): ", { hidden: true });
if (password.length < 14) {
  console.error("Password must be at least 14 characters. Nothing was changed.");
  process.exit(1);
}
const confirm = await ask("Confirm password: ", { hidden: true });
if (confirm !== password) {
  console.error("Passwords do not match. Nothing was changed.");
  process.exit(1);
}

const N = 2 ** 17, r = 8, p = 1;
const salt = randomBytes(16);
const hash = await scrypt(password, salt, 64, { N, r, p, maxmem: 256 * 1024 * 1024 });
const passwordHash = ["scrypt", N, r, p, salt.toString("base64url"), hash.toString("base64url")].join(":");

const totpBuf = randomBytes(20);
const totpSecret = base32(totpBuf);
const sessionSecret = randomBytes(32).toString("base64url");
const uri = `otpauth://totp/${encodeURIComponent("Darien Corporation:admin")}?secret=${totpSecret}&issuer=${encodeURIComponent("Darien Corporation")}&algorithm=SHA1&digits=6&period=30`;

console.log("\nScan this QR code with your authenticator app (1Password, Google Authenticator, Authy…):\n");
console.log(await QRCode.toString(uri, { type: "terminal", small: true }));
console.log(`Or enter this key manually: ${totpSecret}\n`);

const code = (await ask("Enter the 6-digit code your app shows to confirm: ")).trim();
const counter = Math.floor(Date.now() / 30000);
if (![counter - 1, counter, counter + 1].some((c) => totp(totpBuf, c) === code)) {
  console.error("That code didn't match. Nothing was changed. Run the setup again.");
  process.exit(1);
}

const vars = {
  ADMIN_PASSWORD_HASH: passwordHash,
  ADMIN_TOTP_SECRET: totpSecret,
  ADMIN_SESSION_SECRET: sessionSecret,
  ADMIN_SESSION_VERSION: String(Date.now()),
};

const file = ".env.local";
let content = existsSync(file) ? readFileSync(file, "utf8") : "";
for (const [k, v] of Object.entries(vars)) {
  const line = `${k}=${v}`;
  const re = new RegExp(`^${k}=.*$`, "m");
  content = re.test(content) ? content.replace(re, line) : `${content.trimEnd()}\n${line}\n`.trimStart();
}
writeFileSync(file, content, { mode: 0o600 });

console.log(`\n✓ Saved to ${file} (readable only by you).`);
console.log("For production, add the same four variables to your hosting provider's environment settings.");
console.log("Never commit them. Re-run this script any time to rotate credentials (this signs out all sessions).\n");
