import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos centres — THOR",
  description: "Trouvez votre centre Clair Vision ou Clair Audition le plus proche. Optique et audioprothèse en France.",
};

export default function NosCentresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
