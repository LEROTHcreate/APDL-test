import { Suspense } from "react";
import LentillesCalculateur from "@/app/(pro)/clair-vision/pro/components/optique/LentillesCalculateur";

export default function CalculateurLentillesPage({
  searchParams,
}: {
  searchParams: {
    od_sph?: string; od_cyl?: string; od_axe?: string;
    og_sph?: string; og_cyl?: string; og_axe?: string;
    add?: string; dossier?: string;
  };
}) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Chargement…</div>}>
      <LentillesCalculateur
        prefillOdSph={searchParams.od_sph}
        prefillOdCyl={searchParams.od_cyl}
        prefillOdAxe={searchParams.od_axe}
        prefillOgSph={searchParams.og_sph}
        prefillOgCyl={searchParams.og_cyl}
        prefillOgAxe={searchParams.og_axe}
        prefillAdd={searchParams.add}
        prefillDossier={searchParams.dossier}
      />
    </Suspense>
  );
}
