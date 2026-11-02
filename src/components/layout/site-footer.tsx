import Link from "next/link";
import { PerforationDivider } from "@/components/brand/perforation-divider";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import {
  CONTACT,
  COPYRIGHT_YEAR,
  FOOTER_NAV,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/config/site";

export function SiteFooter() {
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
                        className="inline-flex min-h-[36px] items-center text-sm text-brand-dark-muted transition-colors hover:text-brand-dark-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Column 3: Contact & Facility details */}
            <div className="lg:col-span-4 flex flex-col gap-5 text-sm">
              <p className="font-heading text-sm font-semibold tracking-wider text-brand-dark-foreground uppercase">
                Contact & Facilities
              </p>

              {/* Address */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent-light">
                  {CONTACT.address.label}
                </span>
                <p className="text-brand-dark-muted">{CONTACT.address.value}</p>
                {CONTACT.address.href ? (
                  <a
                    href={CONTACT.address.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[36px] items-center text-accent-light underline underline-offset-4 hover:opacity-90"
                  >
                    {CONTACT.address.mapsLabel}
                  </a>
                ) : null}
              </div>

              {/* Phone */}
              {CONTACT.phones.map((phone) => (
                <div key={phone.value} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-light">
                    {phone.label}
                  </span>
                  {phone.href ? (
                    <a
                      href={phone.href}
                      className="inline-flex min-h-[36px] items-center text-brand-dark-muted transition-colors hover:text-brand-dark-foreground underline underline-offset-4"
                    >
                      {phone.value}
                    </a>
                  ) : (
                    <p className="text-brand-dark-muted">{phone.value}</p>
                  )}
                </div>
              ))}

              {/* Email */}
              {CONTACT.email ? (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-light">
                    {CONTACT.email.label}
                  </span>
                  {CONTACT.email.href ? (
                    <a
                      href={CONTACT.email.href}
                      className="inline-flex min-h-[36px] items-center text-brand-dark-muted transition-colors hover:text-brand-dark-foreground underline underline-offset-4"
                    >
                      {CONTACT.email.value}
                    </a>
                  ) : (
                    <p className="text-brand-dark-muted">
                      {CONTACT.email.value}
                    </p>
                  )}
                </div>
              ) : null}

              {/* Working Hours */}
              {CONTACT.workingHours ? (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-light">
                    {CONTACT.workingHours.label}
                  </span>
                  <p className="text-brand-dark-muted">
                    {CONTACT.workingHours.value}
                  </p>
                </div>
              ) : null}
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
                  className="inline-flex min-h-[44px] items-center text-sm font-medium text-brand-dark-muted transition-colors hover:text-brand-dark-foreground"
                >
                  {social.label}
                </a>
              ))}
            </div>
          ) : null}

          {/* Bottom disclaimer and copyright row */}
          <div className="pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-brand-dark-muted">
            <p>
              © {COPYRIGHT_YEAR} {SITE_NAME}. All rights reserved.
            </p>
            <p className="max-w-xl text-[11px] leading-relaxed opacity-80">
              PLACEHOLDER: Pharma disclaimer text.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
