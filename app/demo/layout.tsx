import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Démo — THOR",
  description: "Découvrez THOR en situation réelle. Demandez une démo gratuite et personnalisée pour votre centre Clair Vision ou Clair Audition.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
