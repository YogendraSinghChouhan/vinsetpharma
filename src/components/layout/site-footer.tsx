import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import Link from "next/link";
import { PerforationDivider } from "@/components/brand/perforation-divider";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import {
  CONTACT,
  CONTACT_FALLBACKS,
  COPYRIGHT_YEAR,
  FOOTER_NAV,
  LEGAL_NAV,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/config/site";

export function SiteFooter() {
  const primaryPhone = CONTACT.phones[0];

  return (
    <footer className="relative mt-auto">
      {/* Structural blister foil perforation edge transitioning into dark surface */}
      <PerforationDivider variant="transition-to-dark" />

      <div className="bg-brand-dark text-brand-dark-foreground pt-12 pb-16 sm:pt-16 sm:pb-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 pb-12 border-b border-[oklch(1_0_0/12%)]">
            {/* Column 1: Brand identity and blurb */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <Logo inverted />
              <p className="max-w-md text-sm text-brand-dark-muted leading-relaxed">
                Vinsent Pharma develops, prepares and supplies pharmaceutical
                products for healthcare providers and the communities they
                serve.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-3">
              <p className="font-heading text-sm font-semibold tracking-wider text-brand-dark-foreground uppercase">
                Quick Links
              </p>
              <nav aria-label="Footer Navigation" className="mt-4">
                <ul className="flex flex-col gap-2.5">
                  {FOOTER_NAV.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="inline-flex min-h-[44px] items-center text-sm text-brand-dark-muted transition-colors hover:text-brand-dark-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Column 3: Contact & Facility details */}
            <div className="lg:col-span-4 flex flex-col gap-6 text-sm">
              <p className="font-heading text-sm font-semibold tracking-wider text-brand-dark-foreground uppercase">
                Contact & Facilities
              </p>

              {/* Addresses */}
              <div className="flex flex-col gap-4">
                {CONTACT.addresses.map((address) => (
                  <div key={address.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-accent-light">
                      <IconMapPin
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {address.label}
                      </span>
                    </div>
                    <p className="text-brand-dark-muted leading-relaxed text-xs sm:text-sm">
                      {address.text}
                    </p>
                    <a
                      href={address.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${address.label} facility on Google Maps`}
                      className="inline-flex min-h-[44px] items-center text-xs text-accent-light underline underline-offset-4 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      View on Google Maps
                    </a>
                  </div>
                ))}
              </div>

              {/* Phone */}
              {primaryPhone ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-accent-light">
                    <IconPhone className="size-4 shrink-0" aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Phone
                    </span>
                  </div>
                  <a
                    href={primaryPhone.href}
                    className="inline-flex min-h-[44px] items-center text-sm text-brand-dark-muted transition-colors hover:text-brand-dark-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                  >
                    {primaryPhone.display}
                  </a>
                </div>
              ) : null}

              {/* Email */}
              {CONTACT.email ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-accent-light">
                    <IconMail className="size-4 shrink-0" aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Email
                    </span>
                  </div>
                  <a
                    href={CONTACT.email.href}
                    className="inline-flex min-h-[44px] items-center text-sm text-brand-dark-muted transition-colors hover:text-brand-dark-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light break-all sm:break-normal"
                  >
                    {CONTACT.email.value}
                  </a>
                </div>
              ) : null}

              {/* Working Hours */}
              <div className="flex flex-col gap-1 pt-2 border-t border-[oklch(1_0_0/10%)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent-light">
                  Working Hours
                </span>
                <p className="text-brand-dark-muted text-xs">
                  {CONTACT.workingHours?.value ??
                    CONTACT_FALLBACKS.workingHours}
                </p>
              </div>
            </div>
          </div>

          {/* Social Links if present */}
          {SOCIAL_LINKS.length > 0 ? (
            <div className="flex gap-4 py-6 border-b border-[oklch(1_0_0/10%)]">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-sm font-medium text-brand-dark-muted transition-colors hover:text-brand-dark-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                >
                  {social.label}
                </a>
              ))}
            </div>
          ) : null}

          {/* Neutral disclaimer line */}
          <div className="py-6 border-b border-[oklch(1_0_0/10%)] text-xs text-brand-dark-muted">
            <p className="max-w-3xl text-[12px] leading-relaxed opacity-80">
              The information on this website is for general informational
              purposes only and does not constitute medical advice.
            </p>
          </div>

          {/* Bottom row: copyright and legal navigation */}
          <div className="pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-brand-dark-muted">
            <p>
              © {COPYRIGHT_YEAR} {SITE_NAME}. All rights reserved.
            </p>
            <nav aria-label="Legal Navigation">
              <ul className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
                {LEGAL_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-[44px] items-center text-xs text-brand-dark-muted transition-colors hover:text-brand-dark-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </div>
    </footer>
  );
}
