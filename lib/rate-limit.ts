type Entry = { count: number; reset: number };

const store = new Map<string, Entry>();

/**
 * Rate limiting en mémoire (reset à chaque redémarrage — suffisant pour test/prod légère).
 * @returns true si la requête est autorisée, false si bloquée
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

/** Récupère l'IP réelle en tenant compte des proxies (Netlify, Vercel) */
export function getIP(req: Request): string {
  const headers = req instanceof Request ? req.headers : new Headers();
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
