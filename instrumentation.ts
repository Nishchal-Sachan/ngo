/**
 * Runs when the Next.js server starts. Validates required env vars before accepting requests.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("./src/lib/env");
    validateEnv();
  }
}
