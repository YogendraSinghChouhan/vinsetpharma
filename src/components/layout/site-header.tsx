import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CONTACT, ROUTES } from "@/config/site";

export function SiteHeader() {
  const primaryPhone = CONTACT.phones[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/80 shadow-2xs">
      {/* Top utility contact bar */}
      <div className="border-b border-border/60 bg-surface-tint/70 text-xs text-muted-foreground">
        <Container>
          <div className="flex flex-col gap-1 py-1.5 sm:flex-row sm:items-center sm:justify-between text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 truncate">
              {primaryPhone ? (
                primaryPhone.href ? (
                  <a
                    href={primaryPhone.href}
                    className="truncate transition-colors hover:text-foreground"
                  >
                    {primaryPhone.value}
                  </a>
                ) : (
                  <span className="truncate">{primaryPhone.value}</span>
                )
              ) : null}
            </div>
            <div className="flex items-center gap-2 truncate">
              {CONTACT.email ? (
                CONTACT.email.href ? (
                  <a
                    href={CONTACT.email.href}
                    className="truncate transition-colors hover:text-foreground"
                  >
                    {CONTACT.email.value}
                  </a>
                ) : (
                  <span className="truncate">{CONTACT.email.value}</span>
                )
              ) : null}
            </div>
          </div>
        </Container>
      </div>

      {/* Main navigation bar */}
      <Container>
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          <Logo />

          {/* Desktop Nav (lg: 1024px+) */}
          <div className="hidden items-center gap-6 lg:flex">
            <MainNav />
            <Link
              href={ROUTES.products}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Our Products
            </Link>
          </div>

          {/* Mobile Nav (< lg: 1024px) */}
          <div className="flex items-center gap-2 lg:hidden">
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
