import { Container } from "@/components/layout/container";
import { ROUTES } from "@/config/site";
import { PageHeader } from "@/features/marketing/components/page-header";
import type { LegalDocument as LegalDocumentType } from "../content";

interface LegalDocumentProps {
  document: LegalDocumentType;
}

export function LegalDocument({ document }: LegalDocumentProps) {
  return (
    <>
      <PageHeader
        title={document.title}
        description={document.description}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: document.title },
        ]}
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-[70ch]">
            {/* Last updated metadata */}
            <div className="mb-10 border-b border-border/70 pb-6">
              <p className="text-sm text-muted-foreground">
                Last updated:{" "}
                <time
                  dateTime="2026-11-02"
                  className="font-medium text-foreground"
                >
                  {document.lastUpdated}
                </time>
              </p>
            </div>

            {/* Document sections */}
            <div className="space-y-12">
              {document.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-heading`}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2
                    id={`${section.id}-heading`}
                    className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                  >
                    {section.heading}
                  </h2>

                  <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                    {section.blocks.map((block) => {
                      if (typeof block === "string") {
                        return (
                          <p key={`${section.id}-${block.slice(0, 32)}`}>
                            {block}
                          </p>
                        );
                      }
                      if (block.type === "paragraph") {
                        return (
                          <p key={`${section.id}-${block.text.slice(0, 32)}`}>
                            {block.text}
                          </p>
                        );
                      }
                      if (block.type === "list") {
                        const listKey = `${section.id}-list-${block.items[0]?.slice(0, 24) ?? "items"}`;
                        return (
                          <ul
                            key={listKey}
                            className="list-disc space-y-2 pl-6 marker:text-primary"
                          >
                            {block.items.map((item) => (
                              <li key={`${listKey}-${item.slice(0, 24)}`}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return null;
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
