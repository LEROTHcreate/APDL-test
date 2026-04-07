import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-[#f8fafc]">
      <div className="mx-auto max-w-[1240px] px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-large)] bg-slate-900 px-8 py-16 md:px-16 text-center shadow-[0_24px_60px_rgba(11,18,32,0.18)]">

            {/* Halos décoratifs */}
            <div
              className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(45,140,255,0.15)" }}
            />
            <div
              className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(0,201,138,0.15)" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 mb-5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00C98A] animate-pulse" />
                Disponible du lundi au samedi
              </span>

              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white h-title">
                Prêt à prendre soin <span className="font-semibold">de vous ?</span>
              </h2>

              <p className="mt-4 text-white/70 max-w-lg mx-auto text-sm leading-[1.7]">
                Nos experts vous accueillent dans l'un de nos 25 centres partout en France.
                Prenez rendez-vous en quelques clics.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/rendez-vous"
                  className="
                    inline-flex items-center justify-center
                    rounded-[var(--radius-pill)] px-7 py-3.5 text-sm font-semibold
                    bg-white text-slate-800
                    shadow-[0_4px_20px_rgba(0,0,0,0.20)]
                    transition-all duration-200
                    hover:shadow-[0_8px_32px_rgba(0,0,0,0.28)] hover:scale-[1.02]
                  "
                >
                  Prendre rendez-vous
                </Link>

                <Link
                  href="/connexion"
                  className="
                    inline-flex items-center justify-center
                    rounded-[var(--radius-pill)] px-7 py-3.5 text-sm font-semibold
                    text-white/80 hover:text-white
                    border border-white/20 hover:border-white/40 hover:bg-white/8
                    transition-all duration-200
                  "
                >
                  Créer un compte →
                </Link>
              </div>

              {/* Marques */}
              <div className="mt-10 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2D8CFF]" />
                  <span className="text-xs text-white/60 font-medium">Clair Vision</span>
                </div>
                <div className="w-px h-4 bg-white/15" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00C98A]" />
                  <span className="text-xs text-white/60 font-medium">Clair Audition</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
