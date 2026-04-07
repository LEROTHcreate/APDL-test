import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — THOR",
  description: "Mentions légales du site THOR, éditeur du logiciel Clair Vision et Clair Audition.",
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-thor-bg">
      <div className="mx-auto max-w-[760px] px-6 py-16">
        <h1 className="text-3xl font-light tracking-tight text-thor-text h-title mb-8">Mentions légales</h1>

        <div className="space-y-8 text-sm text-thor-muted leading-[1.8]">
          <Section title="Éditeur du site">
            <p><strong className="text-thor-text">THOR SAS</strong></p>
            <p>12 rue de la Santé, 75014 Paris</p>
            <p>SIRET : 123 456 789 00011</p>
            <p>Capital social : 10 000 €</p>
            <p>Email : <a href="mailto:contact@thor.fr" className="text-vision-accent hover:underline">contact@thor.fr</a></p>
            <p>Directeur de la publication : Nicolas Garnier</p>
          </Section>

          <Section title="Hébergement">
            <p><strong className="text-thor-text">Netlify, Inc.</strong></p>
            <p>512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis</p>
            <p>Site : <a href="https://www.netlify.com" className="text-vision-accent hover:underline" target="_blank" rel="noopener noreferrer">www.netlify.com</a></p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>L'ensemble des contenus présents sur ce site (textes, images, logos, icônes) sont la propriété exclusive de THOR SAS et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
            <p>Toute reproduction, distribution ou utilisation sans autorisation écrite est interdite.</p>
          </Section>

          <Section title="Données personnelles">
            <p>Les données collectées sur ce site sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.</p>
            <p>Pour exercer vos droits (accès, rectification, suppression), contactez : <a href="mailto:privacy@thor.fr" className="text-vision-accent hover:underline">privacy@thor.fr</a></p>
          </Section>

          <Section title="Cookies">
            <p>Ce site utilise des cookies techniques nécessaires à son fonctionnement. Vous pouvez gérer vos préférences via notre <a href="/cookies" className="text-vision-accent hover:underline">politique cookies</a>.</p>
          </Section>

          <Section title="Limitation de responsabilité">
            <p>THOR SAS ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site. Les informations médicales présentes sont à titre indicatif et ne remplacent pas un avis professionnel de santé.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-large)] border border-thor-border bg-white p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-base font-semibold text-thor-text mb-3">{title}</h2>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
