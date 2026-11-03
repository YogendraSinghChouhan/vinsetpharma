import { Container } from "@/components/layout/container";
import { HeaderScrollShell } from "@/components/layout/header-scroll-shell";
import { Logo } from "@/components/layout/logo";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TopContactBar } from "@/components/layout/top-contact-bar";
import { SearchDialog } from "@/features/search/components/search-dialog";

/**
 * Server Component representing the top site header.
 * Composes the non-sticky TopContactBar with the sticky, auto-hiding HeaderScrollShell.
 */
export function SiteHeader() {
  return (
    <>
      <TopContactBar />
      <HeaderScrollShell>
        <Container>
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
            <Logo priority />

            {/* Desktop Nav (lg: 1024px+) */}
            <div className="hidden items-center gap-4 lg:flex">
              <MainNav />
              <SearchDialog />
            </div>

            {/* Mobile Nav (< lg: 1024px) */}
            <div className="flex items-center gap-2 lg:hidden">
              <SearchDialog />
              <MobileNav />
            </div>
          </div>
        </Container>
      </HeaderScrollShell>
    </>
  );
}
