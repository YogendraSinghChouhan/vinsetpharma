import type { ReactNode } from "react";
import { SectionHeading } from "@/components/brand/section-heading";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  heading?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  heading,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-12 sm:py-16 lg:py-20", className)}>
      <Container>
        {heading || description ? (
          <div className="mb-10">
            <SectionHeading title={heading ?? ""} description={description} />
          </div>
        ) : null}
        <div>{children}</div>
      </Container>
    </section>
  );
}
