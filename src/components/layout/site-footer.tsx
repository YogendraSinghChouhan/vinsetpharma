import {
  IconArrowRight,
  IconArrowUp,
  IconExternalLink,
  IconFileCertificate,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShieldCheck,
  IconTruck,
} from "@tabler/icons-react";
import Link from "next/link";
import { PerforationDivider } from "@/components/brand/perforation-divider";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import {
  CONTACT,
  COPYRIGHT_YEAR,
  LEGAL_NAV,
  ROUTES,
  SITE_NAME,
} from "@/config/site";

export function SiteFooter() {
  const primaryPhone = CONTACT.phones[0];

  return (
    <footer className="relative mt-auto">
      {/* Structural blister foil perforation edge transitioning into dark surface */}
      <PerforationDivider variant="transition-to-dark" />

      <div className="bg-brand-dark text-brand-dark-foreground pt-12 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
        <Container>
          {/* 1. Quality & Trust Pillars Ribbon */}
          <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-12 border-b border-[oklch(1_0_0/10%)]">
            <div className="flex items-start gap-3.5 rounded-2xl bg-[oklch(1_0_0/3%)] p-4 border border-[oklch(1_0_0/8%)] transition-colors hover:border-accent-light/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-accent-light border border-primary/30">
                <IconShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-brand-dark-foreground">
                  Quality Formulations
                </span>
                <span className="text-xs text-brand-dark-muted leading-relaxed mt-0.5">
                  Formulated to meet rigorous pharmaceutical and clinical
                  standards.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl bg-[oklch(1_0_0/3%)] p-4 border border-[oklch(1_0_0/8%)] transition-colors hover:border-accent-light/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-accent-light border border-primary/30">
                <IconTruck className="size-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-brand-dark-foreground">
                  Pan-India Supply
                </span>
                <span className="text-xs text-brand-dark-muted leading-relaxed mt-0.5">
                  Direct logistics network connecting healthcare providers and
                  pharmacies.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl bg-[oklch(1_0_0/3%)] p-4 border border-[oklch(1_0_0/8%)] transition-colors hover:border-accent-light/30 sm:col-span-2 lg:col-span-1">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-accent-light border border-primary/30">
                <IconFileCertificate className="size-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-brand-dark-foreground">
                  Batch Documentation
                </span>
                <span className="text-xs text-brand-dark-muted leading-relaxed mt-0.5">
                  Detailed batch records and technical specifications upon
                  request.
                </span>
              </div>
            </div>
          </div>

          {/* 2. Main 12-Column Responsive Information Grid */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 pb-14 border-b border-[oklch(1_0_0/10%)]">
            {/* Column 1: Brand identity, blurb & Quick Actions (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <Logo inverted />
              <p className="text-sm text-brand-dark-muted leading-relaxed pr-2">
                Vinsent Pharma develops, prepares and supplies pharmaceutical
                products for healthcare providers and the communities they
                serve.
              </p>

              {/* Direct Enquiry CTA Button */}
              <div className="pt-2">
                <Link
                  href={ROUTES.contactUs}
                  className="group inline-flex min-h-[44px] items-center justify-between gap-3 rounded-full bg-accent-light px-5 py-2.5 text-xs font-semibold tracking-wider text-brand-dark uppercase shadow-sm transition-all hover:bg-white hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                >
                  <span>Request Product Quote</span>
                  <IconArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>

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

            {/* Column 2: Products & Categories (2 cols) */}
            <div className="lg:col-span-2 sm:col-span-6 flex flex-col gap-4">
              <p className="font-heading text-xs font-semibold tracking-widest text-brand-dark-foreground uppercase">
                Products
              </p>
              <nav aria-label="Products Navigation">
                <ul className="flex flex-col gap-1.5">
                  <li>
                    <Link
                      href={ROUTES.products}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      All Formulations
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.products}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Tablets & Capsules
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.products}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Oral Syrups
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.products}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Sterile Injections
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.products}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Dry Powders & Sachets
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Column 3: Company & Quick Links (2 cols) */}
            <div className="lg:col-span-2 sm:col-span-6 flex flex-col gap-4">
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
                      href={ROUTES.blog}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Articles & Insights
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.contactUs}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Contact & Inquiries
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.adminLogin}
                      className="inline-flex min-h-[40px] items-center text-sm text-brand-dark-muted/70 transition-colors hover:text-brand-dark-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                    >
                      Staff Portal
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Column 4: Facilities & Operations Hubs (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <p className="font-heading text-xs font-semibold tracking-widest text-brand-dark-foreground uppercase">
                Facilities & Operating Hubs
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
                          {address.label} Hub
                        </span>
                      </div>
                      <a
                        href={address.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${address.label} facility on Google Maps`}
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
              The pharmaceutical details and educational articles on this
              website are provided for institutional, healthcare professional,
              and informational reference only. They do not constitute
              personalized medical advice. Product specifications, packaging
              availability, and supply agreements are subject to commercial
              documentation.
            </p>
          </div>

          {/* 4. Bottom Utility Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2 text-xs text-brand-dark-muted">
            <p className="text-xs">
              © {COPYRIGHT_YEAR} {SITE_NAME}. All rights reserved.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <nav aria-label="Legal Navigation">
                <ul className="flex items-center gap-6">
                  {LEGAL_NAV.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="inline-flex min-h-[44px] items-center text-xs text-brand-dark-muted transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

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
