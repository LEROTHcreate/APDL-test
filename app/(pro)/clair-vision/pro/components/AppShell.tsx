import type { ReactNode } from "react";
import ProHeader from "@/app/(pro)/clair-vision/pro/components/ProHeader";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <ProHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-24">{children}</main>
    </div>
  );
}
