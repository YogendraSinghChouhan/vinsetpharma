import { IconMail, IconPhone } from "@tabler/icons-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CONTACT } from "@/config/site";

export function SiteHeader() {
  const primaryPhone = CONTACT.phones[0];
  const email = CONTACT.email;
  const hasUtilityContact = Boolean(primaryPhone || email);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/80 shadow-2xs">
      {/* Top utility contact bar: phone and email only, short, no overflow at 360px */}
      {hasUtilityContact ? (
        <div className="border-b border-border/60 bg-surface-tint/70 text-xs text-muted-foreground">
          <Container>
            <div className="flex flex-col gap-1 py-1.5 sm:flex-row sm:items-center sm:justify-between text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 truncate">
                {primaryPhone ? (
                  <a
                    href={primaryPhone.href}
                    className="inline-flex items-center gap-1.5 truncate transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
                  >
                    <IconPhone
                      className="size-3 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="truncate">{primaryPhone.display}</span>
                  </a>
                ) : null}
              </div>
              <div className="flex items-center gap-2 truncate">
                {email ? (
                  <a
                    href={email.href}
                    className="inline-flex items-center gap-1.5 truncate transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-xs"
                  >
                    <IconMail
                      className="size-3 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="truncate">{email.value}</span>
                  </a>
                ) : null}
              </div>
            </div>
          </Container>
        </div>
      ) : null}

      {/* Main navigation bar */}
      <Container>
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          <Logo priority />

          {/* Desktop Nav (lg: 1024px+) */}
          <div className="hidden items-center gap-6 lg:flex">
            <MainNav />
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
