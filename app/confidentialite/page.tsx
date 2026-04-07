import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — THOR",
  description: "Politique de confidentialité et traitement des données personnelles sur THOR.",
  robots: { index: false },
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-thor-bg">
      <div className="mx-auto max-w-[760px] px-6 py-16">
        <h1 className="text-3xl font-light tracking-tight text-thor-text h-title mb-2">Politique de confidentialité</h1>
        <p className="text-sm text-thor-muted mb-8">Dernière mise à jour : mars 2026</p>

        <div className="space-y-5 text-sm text-thor-muted leading-[1.8]">
          {[
            {
              title: "Responsable du traitement",
              content: "THOR SAS, 12 rue de la Santé, 75014 Paris. Contact DPO : privacy@thor.fr",
            },
            {
              title: "Données collectées",
              content: "Nous collectons les données que vous nous fournissez lors de la création de votre compte (nom, prénom, date de naissance, email, téléphone), lors de vos prises de rendez-vous, et lors de vos échanges avec nos praticiens.",
            },
            {
              title: "Finalités du traitement",
              content: "Gestion de votre espace patient, prise de rendez-vous, suivi médical, communication avec votre praticien, amélioration de nos services.",
            },
            {
              title: "Base légale",
              content: "Exécution du contrat (Art. 6(1)(b) RGPD), intérêt légitime, et pour les données de santé : consentement explicite (Art. 9 RGPD).",
            },
            {
              title: "Durée de conservation",
              content: "Données de compte : 3 ans après la dernière activité. Données de santé : 20 ans conformément à la réglementation française.",
            },
            {
              title: "Vos droits",
              content: "Vous disposez d'un droit d'accès, de rectification, de suppression, de portabilité et d'opposition. Pour exercer ces droits : privacy@thor.fr ou par courrier à notre adresse.",
            },
            {
              title: "Cookies",
              content: "Nous utilisons uniquement des cookies techniques nécessaires au fonctionnement du service. Aucun cookie publicitaire n'est déposé.",
            },
            {
              title: "Transferts hors UE",
              content: "Certains de nos prestataires techniques (hébergement) sont situés aux États-Unis. Les transferts sont encadrés par des clauses contractuelles types (CCT) approuvées par la Commission européenne.",
            },
            {
              title: "Réclamation",
              content: "Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (www.cnil.fr).",
            },
          ].map((s) => (
            <div key={s.title} className="rounded-[var(--radius-large)] border border-thor-border bg-white p-6 shadow-[var(--shadow-soft)]">
              <h2 className="text-base font-semibold text-thor-text mb-2">{s.title}</h2>
              <p>{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
