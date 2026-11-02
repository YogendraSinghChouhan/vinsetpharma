import { Fragment } from "react";
import { Container } from "@/components/layout/container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/config/site";

export type BreadcrumbCrumb = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  description?: string;
  crumbs?: BreadcrumbCrumb[];
};

export function PageHeader({
  title,
  description,
  crumbs = [{ label: "Home", href: ROUTES.home }],
}: PageHeaderProps) {
  const items = crumbs;

  return (
    <header className="border-b border-border/80 bg-surface-tint/40">
      <Container className="py-10 sm:py-14">
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((crumb, index) => {
              const isCurrent = index === items.length - 1;
              return (
                <Fragment key={crumb.label}>
                  <BreadcrumbItem>
                    {crumb.href && !isCurrent ? (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isCurrent ? <BreadcrumbSeparator /> : null}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </Container>
    </header>
  );
}
