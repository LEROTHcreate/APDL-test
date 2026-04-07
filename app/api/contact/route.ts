import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, getIP } from "@/lib/rate-limit";

function esc(str: string): string {
  return String(str ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c)
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function buildTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const SUJET_LABELS: Record<string, string> = {
  demo:        "Demande de démo",
  tarifs:      "Information tarifs",
  support:     "Support technique",
  partenariat: "Partenariat / revendeur",
  autre:       "Autre demande",
};

function buildHtml(data: {
  prenom: string; nom: string; email: string; telephone?: string;
  sujet: string; specialite?: string; message?: string;
}): string {
  const sujetLabel = SUJET_LABELS[data.sujet] ?? data.sujet;
  const isDemo = data.sujet === "demo";
  const accentColor = isDemo ? "#2D8CFF" : "#0B1220";

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:11px 20px;font-size:13px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;width:38%;">${label}</td>
      <td style="padding:11px 20px;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Nouveau message – THOR</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <tr>
        <td style="background:${accentColor};padding:28px 36px;">
          <div style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">THOR</div>
          <div style="color:rgba(255,255,255,0.75);font-size:13px;margin-top:4px;">${sujetLabel}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 36px;">
          <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:6px;">Nouveau message reçu</div>
          <div style="font-size:14px;color:#64748b;margin-bottom:24px;">Via le formulaire de contact thor-sante.fr</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
            ${row("Sujet", sujetLabel)}
            ${row("Nom", `${data.prenom} ${data.nom}`)}
            ${row("Email", `<a href="mailto:${data.email}" style="color:#2D8CFF;">${data.email}</a>`)}
            ${data.telephone ? row("Téléphone", data.telephone) : ""}
            ${data.specialite ? row("Spécialité", data.specialite) : ""}
            ${data.message ? row("Message", data.message.replace(/\n/g, "<br>")) : ""}
          </table>
          ${isDemo ? `
          <div style="margin-top:24px;padding:14px 18px;background:rgba(45,140,255,0.07);border-radius:10px;border-left:3px solid #2D8CFF;">
            <div style="font-size:13px;color:#0f172a;font-weight:600;">Action requise</div>
            <div style="font-size:13px;color:#64748b;margin-top:4px;">Rappeler ce prospect dans les 4 heures ouvrées pour planifier la démo.</div>
          </div>` : ""}
        </td>
      </tr>
      <tr>
        <td style="padding:20px 36px;border-top:1px solid #f1f5f9;">
          <div style="font-size:11px;color:#94a3b8;text-align:center;">
            THOR · Logiciel de gestion santé · Formulaire de contact automatique
          </div>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ ok: false, error: "Trop de messages envoyés. Réessayez dans 1 heure." }, { status: 429 });
    }

    const body = await req.json();
    const { prenom, nom, email, telephone, sujet, specialite, message } = body;

    if (!prenom || !nom || !email || !sujet) {
      return NextResponse.json({ ok: false, error: "Champs obligatoires manquants." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Adresse email invalide." }, { status: 400 });
    }

    const safeData = {
      prenom:     esc(String(prenom)),
      nom:        esc(String(nom)),
      email:      esc(String(email)),
      telephone:  telephone ? esc(String(telephone)) : undefined,
      sujet:      esc(String(sujet)),
      specialite: specialite ? esc(String(specialite)) : undefined,
      message:    message ? esc(String(message)) : undefined,
    };

    const to   = process.env.CONTACT_EMAIL ?? process.env.SMTP_USER ?? "contact@thor.fr";
    const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@thor-sante.fr";
    const sujetLabel = SUJET_LABELS[sujet] ?? sujet;
    const subject = `[THOR Contact] ${sujetLabel} – ${safeData.prenom} ${safeData.nom}`;
    const html  = buildHtml(safeData);

    const transport = buildTransport();
    if (transport) {
      await transport.sendMail({ from, to, subject, html, replyTo: email });
      console.log(`[contact] Email envoyé → ${to}`);
    } else {
      console.log(`[contact] (SMTP non configuré) Simulation → ${to}`);
      console.log(`  Sujet : ${subject}`);
      console.log(`  De    : ${safeData.prenom} ${safeData.nom} <${safeData.email}>`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Erreur:", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}
