export function assertSafeDestructiveTestEnvironment() {
  const nodeEnv = process.env.NODE_ENV?.toLowerCase();
  const vercelEnv = process.env.VERCEL_ENV?.toLowerCase();
  const allow = process.env.ALLOW_DESTRUCTIVE_TESTS === "true";
  const databaseUrl = process.env.DATABASE_URL || "";

  if (nodeEnv === "production" || vercelEnv === "production") {
    throw new Error("Refusing to run destructive tests in a production environment.");
  }

  if (!allow) {
    throw new Error(
      "Destructive test blocked. Set ALLOW_DESTRUCTIVE_TESTS=true only for an isolated staging/test database."
    );
  }

  let databaseName = "";
  try {
    databaseName = new URL(databaseUrl).pathname.replace(/^\//, "").toLowerCase();
  } catch {
    throw new Error("Destructive test blocked: DATABASE_URL is missing or invalid.");
  }

  const looksLikeTestDatabase =
    databaseName.includes("staging") ||
    databaseName.includes("test") ||
    databaseName.includes("qa");

  if (!looksLikeTestDatabase) {
    throw new Error(
      `Destructive test blocked: database '${databaseName || "unknown"}' is not clearly a staging/test database.`
    );
  }
}
