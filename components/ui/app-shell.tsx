"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import FooterGate from "@/components/footer-gate";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isModuleSite =
    pathname.startsWith("/clair-vision") || pathname.startsWith("/clair-audition");

  return (
    <>
      {/* Header THOR uniquement sur le site THOR */}
      {!isModuleSite && <Header />}

      {/* Padding top uniquement si header THOR visible */}
      <div className={!isModuleSite ? "pt-20" : ""}>{children}</div>

      {/* Footer THOR uniquement sur le site THOR */}
      {!isModuleSite && <FooterGate />}
    </>
  );
}
