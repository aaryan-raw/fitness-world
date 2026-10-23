import { Phone } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { finalCtaContent } from "@/data/home";
import { routes } from "@/data/navigation";
import { telHref } from "@/lib/contact";

export function FinalCta() {
  return (
    <CtaBand
      heading={finalCtaContent.heading}
      copy={finalCtaContent.copy}
      primary={{ label: "Explore Memberships", href: routes.memberships }}
      secondary={{
        label: "Call Fitness World",
        href: telHref(),
        icon: <Phone aria-hidden="true" className="size-4" />,
      }}
    />
  );
}
