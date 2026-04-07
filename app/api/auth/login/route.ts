import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USERS } from "@/lib/users";
import { signSession } from "@/lib/session";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { verifyPassword } from "@/lib/password";

const COOKIE_MAX_AGE = 24 * 60 * 60; // 24h en secondes

export async function POST(req: NextRequest) {
  // Rate limiting : max 10 tentatives / 15 min par IP
  const ip = getIP(req);
  if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans 15 minutes." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = String(body.password ?? "");
  } catch {
    // Body absent ou malformé → autoriser (mode test sans mot de passe)
  }

  // Cherche l'utilisateur correspondant au mot de passe (comparaison HMAC sécurisée)
  const user = DEFAULT_USERS.find(u => verifyPassword(password, u.password));

  // En mode démo : si aucun mot de passe saisi, on connecte avec le gérant (fallback)
  const userId = user?.id ?? (password === "" ? DEFAULT_USERS[0].id : null);

  if (!userId) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const token = await signSession(userId);

  const res = NextResponse.json({ ok: true, userId });
  res.cookies.set("thor_pro", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
