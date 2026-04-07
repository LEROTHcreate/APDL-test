import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — THOR",
  description: "Contactez l'équipe THOR pour une démo, une question technique ou toute demande liée à Clair Vision et Clair Audition.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
