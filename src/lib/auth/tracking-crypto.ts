import crypto from "node:crypto";

// Keep old versions configured while orders encrypted with them still exist.
// Values are base64-encoded, independently generated 32-byte keys.
function configuredKeys(): Record<string, Buffer> {
  const value = process.env.TRACKING_ENCRYPTION_KEYS;
  if (!value) return {};
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("TRACKING_ENCRYPTION_KEYS must be a JSON object");
  }
  const keys: Record<string, Buffer> = Object.create(null);
  for (const [version, encoded] of Object.entries(parsed)) {
    if (!/^[A-Za-z0-9_-]{1,32}$/.test(version) || typeof encoded !== "string") {
      throw new Error("Invalid tracking encryption key configuration");
    }
    const key = Buffer.from(encoded, "base64");
    if (key.length !== 32 || key.toString("base64") !== encoded) {
      throw new Error("Tracking encryption keys must be canonical base64-encoded 32-byte keys");
    }
    keys[version] = key;
  }
  return keys;
}

function legacyKey(): Buffer | null {
  // Retain the old JWT secret here before rotating JWT_SECRET.
  const secret = process.env.TRACKING_LEGACY_SECRET || process.env.JWT_SECRET;
  return secret
    ? crypto.createHash("sha256").update(`kharidly:tracking-token:v1:${secret}`).digest()
    : null;
}

export function encryptTrackingToken(token: string): string {
  const version = process.env.TRACKING_ENCRYPTION_ACTIVE_VERSION;
  const keys = configuredKeys();
  if (!version && Object.keys(keys).length > 0) {
    throw new Error("TRACKING_ENCRYPTION_ACTIVE_VERSION must select a configured key");
  }
  // Compatibility during rollout; configure a dedicated key before rotating JWT_SECRET.
  const key = version ? keys[version] : legacyKey();
  if (!key) throw new Error("Tracking encryption key is missing");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const payload = [iv, cipher.getAuthTag(), ciphertext].map(part => part.toString("base64url"));
  return (version ? [version, ...payload] : payload).join(".");
}

export function decryptTrackingToken(payload: string | null): string | null {
  if (!payload) return null;
  const parts = payload.split(".");
  if (parts.length !== 3 && parts.length !== 4) return null;
  const key = parts.length === 4 ? configuredKeys()[parts.shift()!] : legacyKey();
  if (!key) return null;
  try {
    const [iv, tag, ciphertext] = parts.map(part => Buffer.from(part, "base64url"));
    if (iv.length !== 12 || tag.length !== 16) return null;
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
