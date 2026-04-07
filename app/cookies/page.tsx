import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique cookies — THOR",
  description: "Informations sur l'utilisation des cookies sur le site THOR.",
  robots: { index: false },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-thor-bg">
      <div className="mx-auto max-w-[760px] px-6 py-16">
        <h1 className="text-3xl font-light tracking-tight text-thor-text h-title mb-2">Politique cookies</h1>
        <p className="text-sm text-thor-muted mb-8">Dernière mise à jour : mars 2026</p>

        <div className="space-y-5 text-sm text-thor-muted leading-[1.8]">
          <div className="rounded-[var(--radius-large)] border border-thor-border bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold text-thor-text mb-3">Qu'est-ce qu'un cookie ?</h2>
            <p>Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, téléphone, tablette) lors de la consultation d'un site web. Il permet au site de mémoriser des informations sur votre visite.</p>
          </div>

          <div className="rounded-[var(--radius-large)] border border-thor-border bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold text-thor-text mb-4">Cookies utilisés sur THOR</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-thor-border">
                    <th className="text-left py-2 font-semibold text-thor-text pr-4">Nom</th>
                    <th className="text-left py-2 font-semibold text-thor-text pr-4">Type</th>
                    <th className="text-left py-2 font-semibold text-thor-text pr-4">Durée</th>
                    <th className="text-left py-2 font-semibold text-thor-text">Finalité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-thor-border">
                  {[
                    { name: "thor_patient",  type: "Session",    duration: "Session",  purpose: "Maintien de la session patient" },
                    { name: "thor_pro",      type: "Session",    duration: "Session",  purpose: "Maintien de la session praticien" },
                    { name: "thor_pref",     type: "Préférence", duration: "1 an",     purpose: "Préférences d'interface" },
                  ].map((c) => (
                    <tr key={c.name}>
                      <td className="py-2 font-mono text-thor-text pr-4">{c.name}</td>
                      <td className="py-2 text-thor-muted pr-4">{c.type}</td>
                      <td className="py-2 text-thor-muted pr-4">{c.duration}</td>
                      <td className="py-2 text-thor-muted">{c.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[var(--radius-large)] border border-thor-border bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold text-thor-text mb-3">Gérer vos préférences</h2>
            <p>Vous pouvez à tout moment désactiver les cookies via les paramètres de votre navigateur. Attention : la désactivation des cookies techniques peut altérer le fonctionnement du site.</p>
            <p className="mt-2">Guides par navigateur : <a href="https://support.google.com/chrome/answer/95647" className="text-vision-accent hover:underline" target="_blank" rel="noopener noreferrer">Chrome</a> · <a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" className="text-vision-accent hover:underline" target="_blank" rel="noopener noreferrer">Firefox</a> · <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" className="text-vision-accent hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
