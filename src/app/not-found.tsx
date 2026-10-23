import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section spacing="lg">
      <Heading variant="page">Page not found</Heading>
      <p className="type-lead mt-6 max-w-xl">
        This page does not exist. Try the home page, or use the menu to find what you need.
      </p>
      <Button href="/" className="mt-10">
        Back to Home
      </Button>
    </Section>
  );
}
