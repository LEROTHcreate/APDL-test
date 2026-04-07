import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion — THOR",
  description: "Accédez à votre espace patient ou praticien THOR. Portail Clair Vision et Clair Audition.",
  robots: { index: false },
};

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
