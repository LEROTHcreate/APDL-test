import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(145deg, #0B1220 0%, #0F1B2E 60%, #0B1220 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="w-full px-8 lg:px-16 xl:px-24 py-14">
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group" aria-label="THOR — Accueil">
              <div
                className="relative h-9 w-9 rounded-xl grid place-items-center overflow-hidden transition-transform duration-200 group-hover:scale-[1.04]"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}
              >
                <svg className="w-4 h-4 text-white/90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 7h12M12 7v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16.8 9.2c.9.9 1.4 2.1 1.4 3.4 0 2.7-2.2 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  <circle cx="17.7" cy="9.1" r="1.1" fill="currentColor" opacity="0.9" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white tracking-tight">THOR</div>
                <div className="text-[11px]">
                  <span className="font-medium" style={{ color: "#60AAFF" }}>Clair Vision</span>
                  <span className="text-white/30">{" · "}</span>
                  <span className="font-medium" style={{ color: "#3DCBA8" }}>Clair Audition</span>
                </div>
              </div>
            </Link>

            <p className="text-sm leading-[1.7] text-white/45">
              Votre expérience premium en santé visuelle et auditive. Parcours clairs, suivi structuré, prise de rendez-vous simplifiée.
            </p>

            {/* Badges marques */}
            <div className="flex gap-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
                style={{ background: "rgba(45,140,255,0.12)", border: "1px solid rgba(45,140,255,0.25)", color: "#7DC4FF" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7DC4FF]" />
                Clair Vision
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
                style={{ background: "rgba(0,193,148,0.10)", border: "1px solid rgba(0,193,148,0.22)", color: "#3DCBA8" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3DCBA8]" />
                Clair Audition
              </span>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-white/30">Services</div>
            <ul className="space-y-2.5">
              {[
                { href: "/clair-vision",   label: "Optique — Clair Vision" },
                { href: "/clair-audition", label: "Audition — Clair Audition" },
                { href: "/rendez-vous",    label: "Prendre rendez-vous" },
                { href: "/nos-centres",    label: "Nos centres" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/45 transition-colors duration-200 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-white/30">Informations</div>
            <ul className="space-y-2.5">
              {[
                { href: "/connexion",        label: "Connexion" },
                { href: "/contact",          label: "Contact" },
                { href: "/tarifs",           label: "Tarifs praticiens" },
                { href: "/mentions-legales", label: "Mentions légales" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/45 hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-white/30">Contact</div>
            <div className="space-y-3 text-sm text-white/45">
              <div className="leading-relaxed">
                12 rue de la Santé<br />
                75014 Paris
              </div>
              <a href="mailto:contact@thor.fr" className="block hover:text-white transition-colors duration-200">
                contact@thor.fr
              </a>
              <Link
                href="/rendez-vous"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #2D8CFF, #1A72E8)", boxShadow: "0 4px 16px rgba(45,140,255,0.22)" }}
              >
                Prendre rendez-vous →
              </Link>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div
          className="mt-10 mb-6 flex flex-wrap gap-4 items-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "24px" }}
        >
          {[
            { label: "Hébergement HDS certifié", dot: "#2D8CFF" },
            { label: "Partenaire GIE SESAM-Vitale", dot: "#00C98A" },
            { label: "100% Santé — Classe A", dot: "#059669" },
            { label: "Données hébergées en France", dot: "#A78BFA" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-[11px] text-white/30">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: b.dot }} />
              {b.label}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/25">
            © {year} THOR — Made in Marseille
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/30">
            {[
              { href: "/confidentialite",  label: "Confidentialité" },
              { href: "/mentions-legales", label: "Mentions légales" },
              { href: "/cookies",          label: "Cookies" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white/70 transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
