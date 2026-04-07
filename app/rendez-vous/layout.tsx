import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prendre rendez-vous — THOR",
  description: "Prenez rendez-vous en ligne dans l'un de nos centres Clair Vision ou Clair Audition près de chez vous.",
};

export default function RendezVousLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
