import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/FinalCta";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { MembershipPreview } from "@/components/sections/MembershipPreview";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { TrainingSection } from "@/components/sections/TrainingSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhySection } from "@/components/sections/WhySection";
import { siteConfig } from "@/data/site";

// The title comes from the root layout. `robots: noindex` is inherited from it too.
export const metadata: Metadata = {
  description: `An independent concept website for ${siteConfig.name}, a gym in Vazhayila, Enikkara, ${siteConfig.address.city}. Member feedback, location and phone. Not the official website.`,
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <IntroSection />
      <TrainingSection />
      <WhySection />
      <MembershipPreview />
      <ReviewsSection />
      <LocationSection />
      <FinalCta />
    </>
  );
}
