// components/ui/footer-gate.tsx
"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

export default function FooterGate() {
  const pathname = usePathname();

  // On masque le footer sur toutes les pages d’auth
  const hide =
    pathname.startsWith("/connexion") ||
    pathname.startsWith("/inscription") ||
    pathname.startsWith("/clair-vision") ||
    pathname.startsWith("/clair-audition");

  if (hide) return null;
  return <Footer />;
}
