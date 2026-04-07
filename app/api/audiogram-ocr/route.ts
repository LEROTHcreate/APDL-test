import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { rateLimit, getIP } from "@/lib/rate-limit";

/* ── Fréquences attendues ──────────────────────────────────────────────── */
const FREQS = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000];

export async function POST(req: NextRequest) {
  try {
    // Auth requise (route pro uniquement)
    const token = req.cookies.get("thor_pro")?.value;
    if (!token || !await verifySession(token)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Rate limiting : max 10 OCR / heure par IP (appels coûteux)
    const ip = getIP(req);
    if (!rateLimit(`ocr:${ip}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Limite atteinte" }, { status: 429 });
    }

    const { image } = await req.json() as { image: string };
    if (!image) return NextResponse.json({ error: "image manquante" }, { status: 400 });

    // Limite la taille de l'image (max ~5 Mo en base64)
    if (image.length > 7_000_000) {
      return NextResponse.json({ error: "Image trop volumineuse (max 5 Mo)" }, { status: 413 });
    }

    // Normalise : accepte "data:image/...;base64,..." ou base64 pur
    const base64 = image.includes(",") ? image : image;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Clé API Groq manquante" }, { status: 500 });
    const groq = new Groq({ apiKey });

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: base64, detail: "high" },
            },
            {
              type: "text",
              text: `Tu es un expert en audiométrie. Analyse cet audiogramme et extrais les seuils auditifs.

RÈGLES :
- Axe X = fréquences en Hz : 250, 500, 1000, 2000, 3000, 4000, 6000, 8000
- Axe Y = dB HL, 0 en haut (normal), 120 en bas (surdité profonde)
- OD (oreille droite) = symboles ronds O ou croix rouges
- OG (oreille gauche) = symboles X ou croix bleues
- Si une fréquence est absente ou illisible, utilise null
- Arrondis chaque valeur au multiple de 5 le plus proche (0, 5, 10, 15...)

Réponds UNIQUEMENT avec ce JSON, sans texte supplémentaire :
{
  "od": { "250": 20, "500": 25, "1000": 30, "2000": 40, "3000": 45, "4000": 50, "6000": 55, "8000": 60 },
  "og": { "250": 15, "500": 20, "1000": 25, "2000": 35, "3000": 40, "4000": 45, "6000": 50, "8000": 55 }
}`,
            },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0,
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? "";

    // Extraire le JSON même si le modèle ajoute du texte
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Impossible de lire l'audiogramme", raw }, { status: 422 });
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      od: Record<string, number | null>;
      og: Record<string, number | null>;
    };

    // Valider et normaliser
    const result: Record<string, { od: string; og: string }> = {};
    for (const f of FREQS) {
      const key = String(f);
      const odVal = parsed.od?.[key];
      const ogVal = parsed.og?.[key];
      result[key] = {
        od: odVal != null && !isNaN(Number(odVal)) ? String(Math.round(Number(odVal) / 5) * 5) : "",
        og: ogVal != null && !isNaN(Number(ogVal)) ? String(Math.round(Number(ogVal) / 5) * 5) : "",
      };
    }

    return NextResponse.json({ mesures: result });
  } catch (err) {
    console.error("[audiogram-ocr]", err);
    return NextResponse.json({ error: "Erreur lors de l'analyse" }, { status: 500 });
  }
}
