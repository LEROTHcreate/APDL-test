import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { verifySession } from "@/lib/session";
import { rateLimit, getIP } from "@/lib/rate-limit";

/** Échappe les caractères HTML pour éviter l'injection dans les emails */
function esc(str: string): string {
  return String(str ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c)
  );
}

/** Valide un format email basique */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export interface NotifyRdvPayload {
  patientNom: string;
  patientPrenom: string;
  telephone: string;
  email?: string;
  date: string;
  heure: string;
  type: string;
  notes?: string;
  centreEmail: string;
  centreNom: string;
  module: "vision" | "audition";
}

/* ── SMTP via variables d'environnement ──────────────────────────────────────
   Définir dans .env.local :
     SMTP_HOST=smtp.example.com
     SMTP_PORT=587
     SMTP_USER=user@example.com
     SMTP_PASS=secret
     SMTP_FROM=noreply@thor-sante.fr   (optionnel, défaut SMTP_USER)
   Si SMTP_HOST n'est pas défini, on simule l'envoi (log console) sans erreur.
─────────────────────────────────────────────────────────────────────────── */
function buildTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:12px 20px;font-size:13px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;width:40%;">${label}</td>
    <td style="padding:12px 20px;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${value}</td>
  </tr>`;
}

function buildHtml(p: NotifyRdvPayload): string {
  const accentColor = p.module === "vision" ? "#2D8CFF" : "#00C98A";
  const moduleLabel = p.module === "vision" ? "Optique – Vision" : "Audio – Audition";
  const accentRgb   = p.module === "vision" ? "45,140,255" : "0,201,138";

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Nouveau RDV en ligne</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr>
        <td style="background:${accentColor};padding:28px 36px;">
          <div style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">THOR</div>
          <div style="color:rgba(255,255,255,0.85);font-size:13px;margin-top:4px;">${moduleLabel}</div>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:32px 36px;">
          <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:8px;">
            Nouvelle demande de rendez-vous en ligne
          </div>
          <div style="font-size:14px;color:#64748b;margin-bottom:28px;">
            Un patient vient de réserver un créneau sur votre espace THOR. Voici les détails :
          </div>

          <!-- Info card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
            ${row("Patient", `${p.patientPrenom} ${p.patientNom}`)}
            ${row("Téléphone", p.telephone || "—")}
            ${p.email ? row("Email patient", p.email) : ""}
            ${row("Type", p.type)}
            ${row("Date", p.date)}
            ${row("Horaire", p.heure)}
            ${row("Centre", p.centreNom)}
            ${p.notes ? row("Notes", p.notes) : ""}
            ${row("Statut", "En attente de confirmation")}
          </table>

          <div style="margin-top:28px;padding:16px;background:rgba(${accentRgb},0.08);border-radius:10px;border-left:3px solid ${accentColor};">
            <div style="font-size:13px;color:#0f172a;font-weight:600;">Action requise</div>
            <div style="font-size:13px;color:#64748b;margin-top:4px;">
              Connectez-vous à votre espace praticien pour confirmer ou modifier ce rendez-vous dans votre agenda.
            </div>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:20px 36px;border-top:1px solid #f1f5f9;">
          <div style="font-size:11px;color:#94a3b8;text-align:center;">
            Cet email a été envoyé automatiquement par THOR · Logiciel de gestion santé<br>Ne pas répondre à cet email.
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
    // Auth : cookie de session valide requis
    const token = req.cookies.get("thor_pro")?.value;
    if (!token || !await verifySession(token)) {
      return NextResponse.json({ ok: false, error: "Non autorisé" }, { status: 401 });
    }

    // Rate limiting : max 20 emails / heure par IP
    const ip = getIP(req);
    if (!rateLimit(`notify-rdv:${ip}`, 20, 60 * 60 * 1000)) {
      return NextResponse.json({ ok: false, error: "Limite d'envoi atteinte" }, { status: 429 });
    }

    const payload = (await req.json()) as NotifyRdvPayload;

    // Validation des champs obligatoires
    if (!payload.centreEmail || !payload.patientNom) {
      return NextResponse.json({ ok: false, error: "Paramètres manquants" }, { status: 400 });
    }
    if (!isValidEmail(payload.centreEmail)) {
      return NextResponse.json({ ok: false, error: "Email destinataire invalide" }, { status: 400 });
    }

    // Sanitisation : échappe le HTML dans les données patient
    payload.patientNom    = esc(payload.patientNom);
    payload.patientPrenom = esc(payload.patientPrenom);
    payload.telephone     = esc(payload.telephone);
    payload.notes         = payload.notes ? esc(payload.notes) : payload.notes;
    payload.type          = esc(payload.type);

    const transport = buildTransport();
    const from    = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@thor-sante.fr";
    const subject = `[THOR] Nouvelle demande de RDV – ${payload.patientNom} ${payload.patientPrenom}`;
    const html    = buildHtml(payload);

    if (transport) {
      await transport.sendMail({ from, to: payload.centreEmail, subject, html });
      console.log(`[notify-rdv] Email envoyé à ${payload.centreEmail}`);
      return NextResponse.json({ ok: true });
    } else {
      // SMTP non configuré → log de démo
      console.log(`[notify-rdv] (SMTP non configuré) Email simulé → ${payload.centreEmail}`);
      console.log(`  Subject : ${subject}`);
      console.log(`  Patient : ${payload.patientPrenom} ${payload.patientNom} · ${payload.date} ${payload.heure}`);
      return NextResponse.json({ ok: true, simulated: true });
    }
  } catch (err) {
    console.error("[notify-rdv] Erreur:", err);
    return NextResponse.json({ ok: false, error: String(err) });
  }
}
