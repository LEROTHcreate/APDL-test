const SECRET = process.env.SESSION_SECRET ?? "thor-dev-secret-change-in-production";
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24h

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): ArrayBuffer {
  const pairs = hex.match(/.{1,2}/g) ?? [];
  const arr = new Uint8Array(pairs.map((b) => parseInt(b, 16)));
  return arr.buffer as ArrayBuffer;
}

/** Génère un token signé HMAC : "<userId>:<timestamp>.<signature>" */
export async function signSession(userId: string): Promise<string> {
  const payload = `${userId}:${Date.now()}`;
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${toHex(sig)}`;
}

/**
 * Vérifie la signature et l'expiration.
 * @returns userId si valide, null sinon
 */
export async function verifySession(token: string): Promise<string | null> {
  if (!token) return null;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);

  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromHex(sig),
      new TextEncoder().encode(payload)
    );
    if (!valid) return null;
  } catch {
    return null;
  }

  const parts = payload.split(":");
  if (parts.length < 2) return null;
  const ts = parseInt(parts[parts.length - 1], 10);
  if (isNaN(ts) || Date.now() - ts > MAX_AGE_MS) return null;

  return parts.slice(0, -1).join(":");
}
