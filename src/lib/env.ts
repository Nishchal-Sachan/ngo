/**
 * Centralized environment variable validation and access.
 * Required vars are validated on first access or via validateEnv() at app start.
 */

const REQUIRED = ["MONGODB_URI", "JWT_SECRET"] as const;
const INSECURE_SECRETS = [
  "fallback-secret-change-in-production",
  "your-super-secret-jwt-key-change-in-production",
  "super_secure_secret",
  "CHANGE_ME_generate_strong_secret",
];

let validated = false;

function assertRequired(): void {
  if (validated) return;

  const missing: string[] = [];
  for (const key of REQUIRED) {
    const val = process.env[key];
    if (!val || (key === "JWT_SECRET" && INSECURE_SECRETS.includes(val))) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing or invalid required environment variables: ${missing.join(", ")}. ` +
        "Copy .env.example to .env and set all required values."
    );
  }
  validated = true;
}

/**
 * Call at app startup (e.g. instrumentation.ts) to fail fast if env is invalid.
 */
export function validateEnv(): void {
  assertRequired();
}

export function getMongoDbUri(): string {
  assertRequired();
  return process.env.MONGODB_URI!;
}

export function getJwtSecret(): string {
  assertRequired();
  const secret = process.env.JWT_SECRET!;
  if (INSECURE_SECRETS.includes(secret)) {
    throw new Error("JWT_SECRET must be a strong, unique value in production");
  }
  return secret;
}

export function getRazorpayConfig(): { keyId: string; keySecret: string } | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

export function getSmtpConfig(): {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
} | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@example.com";
  return { host, port, user, pass, from };
}

export function getOrgName(): string {
  return process.env.ORG_NAME ?? "Our Organization";
}

export const isProd = process.env.NODE_ENV === "production";
