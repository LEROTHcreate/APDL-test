import { NextRequest, NextResponse } from "next/server";

export interface Article {
  title: string;
  link: string;
  date: string;
  summary: string;
  image?: string;
  source?: string;
}

const FEEDS: Record<string, { url: string; label: string }[]> = {
  vision: [
    { url: "https://www.acuite.fr/feed",                              label: "Acuité" },
    { url: "https://www.acuite.fr/feed/rss",                          label: "Acuité" },
    { url: "https://www.snof.org/feed",                               label: "SNOF" },
    { url: "https://www.lequotidiendumedecin.fr/rss/ophtalmologie",   label: "Quotidien du Médecin" },
  ],
  audition: [
    { url: "https://www.audio-infos.fr/rss.xml",                      label: "Audio Infos" },
    { url: "https://www.audio-infos.fr/feed",                         label: "Audio Infos" },
    { url: "https://www.unsono.fr/feed",                              label: "Unsono" },
    { url: "https://www.lequotidiendumedecin.fr/rss/orl-audiologie",  label: "Quotidien du Médecin" },
  ],
};

/* ── XML helpers ─────────────────────────────────────────────────────── */
function extractText(tag: string, xml: string): string {
  const cdata = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  if (cdata?.[1]) return cdata[1].trim();
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return plain?.[1]?.trim() ?? "";
}
function extractAttr(tag: string, attr: string, xml: string): string {
  const patterns = [
    new RegExp(`<${tag}[^>]*\\s${attr}="([^"]+)"[^>]*>`, "i"),
    new RegExp(`<${tag}[^>]*\\s${attr}='([^']+)'[^>]*>`, "i"),
  ];
  for (const p of patterns) { const m = xml.match(p); if (m?.[1]) return m[1]; }
  return "";
}
function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ").trim();
}

/* ── Image extraction (multi-pattern) ───────────────────────────────── */
function extractImage(item: string): string | undefined {
  // 1. media:content (standard media RSS)
  const mc = item.match(/<media:content[^>]+url="([^"]+\.(jpg|jpeg|png|webp|gif)[^"]*)"[^>]*/i);
  if (mc?.[1]) return mc[1];

  // 2. media:thumbnail
  const mt = item.match(/<media:thumbnail[^>]+url="([^"]+\.(jpg|jpeg|png|webp|gif)[^"]*)"[^>]*/i);
  if (mt?.[1]) return mt[1];

  // 3. media:content any url (no extension check)
  const mc2 = item.match(/<media:content[^>]+url="(https?:\/\/[^"]+)"/i);
  if (mc2?.[1]) return mc2[1];

  // 4. enclosure with image mime
  const enc = item.match(/<enclosure[^>]+url="([^"]+)"[^>]*type="image\/[^"]*"/i);
  if (enc?.[1]) return enc[1];

  // 5. enclosure any (could be image)
  const enc2 = item.match(/<enclosure[^>]+url="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
  if (enc2?.[1]) return enc2[1];

  // 6. og:image in item content
  const og = item.match(/og:image[^>]+content="(https?:\/\/[^"]+)"/i);
  if (og?.[1]) return og[1];

  // 7. First <img src> in description/content:encoded
  const img = item.match(/<img[^>]+src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp|gif)[^"]*)"/i);
  if (img?.[1]) return img[1];

  // 8. First <img src> any URL
  const img2 = item.match(/<img[^>]+src="(https?:\/\/[^"]+)"/i);
  if (img2?.[1]) return img2[1];

  // 9. Featured image / thumbnail tags
  const featured = item.match(/<(?:featured_image|thumbnail|post-thumbnail)[^>]*>(https?:\/\/[^<]+)<\//i);
  if (featured?.[1]) return featured[1].trim();

  // 10. wp:attachment_url
  const wp = item.match(/<wp:attachment_url[^>]*>(https?:\/\/[^<]+)<\//i);
  if (wp?.[1]) return wp[1].trim();

  return undefined;
}

function parseItems(xml: string, sourceLabel: string, seen: Set<string>): Article[] {
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  return itemMatches
    .map(m => {
      const item    = m[1] ?? "";
      const title   = stripHtml(extractText("title", item));
      const link    = extractText("link", item).trim() ||
                      extractAttr("link", "href", item) ||
                      extractText("guid", item).trim();
      const date    = extractText("pubDate", item) || extractText("dc:date", item) || extractText("published", item);
      const rawDesc = extractText("content:encoded", item) || extractText("description", item) || extractText("summary", item);
      const summary = stripHtml(rawDesc).slice(0, 320);
      const image   = extractImage(item);
      return { title, link, date, summary, source: sourceLabel, ...(image ? { image } : {}) } satisfies Article;
    })
    .filter(a => {
      if (!a.title || !a.link) return false;
      if (seen.has(a.link)) return false;
      seen.add(a.link);
      return true;
    });
}

/* ── Handler ─────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const module = req.nextUrl.searchParams.get("module") ?? "vision";
  const feeds  = FEEDS[module] ?? FEEDS.vision!;

  const seen = new Set<string>();

  const results = await Promise.allSettled(
    feeds.map(async feed => {
      const res = await fetch(feed.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; THOR-RSSReader/2.0)",
          Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      return parseItems(xml, feed.label, seen);
    })
  );

  const articles: Article[] = results
    .flatMap(r => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    })
    .slice(0, 30);

  if (!articles.length) {
    return NextResponse.json(
      { articles: [], error: "Flux indisponibles" },
      { headers: { "Cache-Control": "no-store" }, status: 200 }
    );
  }

  return NextResponse.json(
    { articles, fetchedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
  );
}
