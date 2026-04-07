import type { ReactNode } from "react";

export default function OptiqueLayout({ children }: { children: ReactNode }) {
  // Wrapper dédié optique (accent bleu dans les composants)
  return <>{children}</>;
}
