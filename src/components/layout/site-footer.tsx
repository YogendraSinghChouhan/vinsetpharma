import {
  IconArrowUp,
  IconExternalLink,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { CONTACT, COPYRIGHT_YEAR, legalName, ROUTES } from "@/config/site";
import { FOOTER_COPY } from "@/features/marketing/content";

export function SiteFooter() {
  const primaryPhone = CONTACT.phones[0];

  return (
    <footer className="relative mt-auto">
      <div className="bg-brand-dark text-brand-dark-foreground pt-12 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
        <Container>
          {/* Main 12-Column Responsive Information Grid */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 pb-14 border-b border-[oklch(1_0_0/10%)]">
            {/* Column 1: Brand identity, blurb & Quick Actions (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <Logo inverted />
              <p className="text-sm text-brand-dark-muted leading-relaxed pr-2">
                {FOOTER_COPY.blurb}
              </p>

              {/* Instant Contact Badges */}
              <div className="flex flex-col gap-2 pt-2 text-xs">
                {primaryPhone ? (
                  <a
                    href={primaryPhone.href}
                    className="inline-flex min-h-[44px] items-center gap-2.5 text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[oklch(1_0_0/6%)] text-accent-light">
                      <IconPhone className="size-3.5" aria-hidden="true" />
                    </span>
                    <span>Direct Call: {primaryPhone.display}</span>
                  </a>
                ) : null}

                {CONTACT.email ? (
                  <a
                    href={CONTACT.email.href}
                    className="inline-flex min-h-[44px] items-center gap-2.5 text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light break-all sm:break-normal"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[oklch(1_0_0/6%)] text-accent-light">
                      <IconMail className="size-3.5" aria-hidden="true" />
                    </span>
                    <span>Email: {CONTACT.email.value}</span>
                  </a>
                ) : null}
              </div>
            </div>

            {/* Column 2: Company & Quick Links */}
            <div className="lg:col-span-4 sm:col-span-6 flex flex-col gap-4">
              <p className="font-heading text-xs font-semibold tracking-widest text-brand-dark-foreground uppercase">
                Company
              </p>
              <nav aria-label="Company Navigation">
                <ul className="flex flex-col gap-1.5">
                  <li>
                    <Link
                      href={ROUTES.aboutUs}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.whyUs}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Why Choose Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.contactUs}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.privacyPolicy}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.termsAndConditions}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Terms & Conditions
                    </Link>
                  </li>                </ul>
              </nav>
            </div>

            {/* Column 4: Locations & Contact Points (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <p className="font-heading text-xs font-semibold tracking-widest text-brand-dark-foreground uppercase">
                Locations & Contact Points
              </p>

              <div className="flex flex-col gap-3">
                {CONTACT.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex flex-col gap-2 rounded-2xl bg-[oklch(1_0_0/3%)] p-4 border border-[oklch(1_0_0/8%)] transition-colors hover:border-accent-light/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-accent-light">
                        <IconMapPin
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          {address.label}
                        </span>
                      </div>
                      <a
                        href={address.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${address.label} office on Google Maps`}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-accent-light underline underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-light"
                      >
                        <span>Directions</span>
                        <IconExternalLink
                          className="size-3"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                    <p className="text-xs text-brand-dark-muted leading-relaxed">
                      {address.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Regulatory Disclaimer Card */}
          <div className="my-8 rounded-2xl bg-[oklch(1_0_0/2%)] p-4 border border-[oklch(1_0_0/6%)]">
            <p className="text-[11px] leading-relaxed text-brand-dark-muted/80">
              <strong className="text-brand-dark-foreground/90 font-medium">
                Healthcare Disclaimer:
              </strong>{" "}
              {FOOTER_COPY.disclaimer}
            </p>
          </div>

          {/* 4. Bottom Utility Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2 text-xs text-brand-dark-muted">
            <div className="flex flex-col gap-1">
              <p className="text-xs">
                © {COPYRIGHT_YEAR} {legalName}. All rights reserved.
              </p>
              <p className="text-xs">
                Designed and developed by{" "}
                <a
                  href="https://vedbit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                >
                  Vedbit
                </a>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              {/* Smooth Back to Top Link */}
              <a
                href="#top"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-xs text-brand-dark-muted hover:text-brand-dark-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                aria-label="Back to top of page"
              >
                <span>Back to top</span>
                <IconArrowUp className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
