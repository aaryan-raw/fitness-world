import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteNav } from "@/components/layout/SiteNav";
import { Wordmark } from "@/components/layout/Wordmark";
import { enquiryAction, mainNav } from "@/data/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="-m-1 rounded-control p-1">
          <Wordmark />
        </Link>
        <SiteNav
          items={mainNav}
          headerCta={
            <Button href={enquiryAction.href} size="sm">
              {enquiryAction.label}
            </Button>
          }
          menuCta={
            <Button href={enquiryAction.href} fullWidth>
              {enquiryAction.label}
            </Button>
          }
        />
      </Container>
    </header>
  );
}
