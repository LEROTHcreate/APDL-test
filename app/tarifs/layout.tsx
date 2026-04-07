import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs praticiens — THOR",
  description: "Découvrez les offres THOR pour opticiens et audioprothésistes. Logiciel certifié GIE SESAM-Vitale, hébergement HDS, sans engagement.",
};

export default function TarifsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
