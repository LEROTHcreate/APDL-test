import HomeHero from "@/components/home/home-hero";
import { TrustBar } from "@/components/home/trust-bar";
import { EspacesDedies } from "@/components/home/espaces-dedies";
import { Expertises } from "@/components/home/expertises";
import { HowItWorks } from "@/components/home/how-it-works";
import CentresPreview from "@/components/home/centres-preview";
import { Avis } from "@/components/home/avis";
import { FinalCTA } from "@/components/home/final-cta";

export default function Page() {
  return (
    <>
      <HomeHero />
      <TrustBar />
      <EspacesDedies />
      <Expertises />
      <HowItWorks />
      <CentresPreview />
      <Avis />
      <FinalCTA />
    </>
  );
}
