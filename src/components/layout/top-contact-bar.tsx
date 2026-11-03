import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { CONTACT, ROUTES } from "@/config/site";

export function formatCities(
  addresses: readonly { label: string }[] | { label: string }[],
): string {
  const cities = addresses.map((a) => a.label.trim()).filter(Boolean);
  if (cities.length === 0) return "";
  if (cities.length === 1) return cities[0] ?? "";
  if (cities.length === 2) return `${cities[0]} and ${cities[1]}`;
  return `${cities.slice(0, -1).join(", ")} and ${cities[cities.length - 1]}`;
}

/**
 * Top contact bar rendered in normal document flow (NOT sticky).
 * Scrolls away with the page. Bookends the deep dark footer.
 */
export function TopContactBar() {
  const phone = CONTACT.phones[0];
  const email = CONTACT.email;
  const addresses = CONTACT.addresses;

  const hasPhone = Boolean(phone?.href && phone?.display);
  const hasEmail = Boolean(email?.href && email?.value);

  // If neither phone nor email is configured, do not render the contact bar
  if (!hasPhone && !hasEmail) {
    return null;
  }

  const citiesText = addresses.length > 0 ? formatCities(addresses) : "";

  return (
    <div className="w-full bg-brand-dark text-brand-dark-foreground">
      {/* Desktop and Tablet view (md: 768px and up) */}
      <div className="hidden md:block border-b border-white/10">
        <Container>
          <div className="flex h-9 items-center justify-between text-xs">
            {/* Left side: Phone and Email */}
            <div className="flex items-center gap-6">
              {hasPhone && phone ? (
                <a
                  href={phone.href}
                  className="inline-flex items-center gap-1.5 text-brand-dark-muted transition-colors hover:text-brand-dark-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light rounded-xs"
                >
                  <IconPhone
                    className="size-3.5 shrink-0 text-accent-light"
                    aria-hidden="true"
                  />
                  <span>{phone.display}</span>
                </a>
              ) : null}

              {hasEmail && email ? (
                <a
                  href={email.href}
                  aria-label={`Email ${email.value}`}
                  className="inline-flex items-center gap-1.5 text-brand-dark-muted transition-colors hover:text-brand-dark-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light rounded-xs"
                >
                  <IconMail
                    className="size-3.5 shrink-0 text-accent-light"
                    aria-hidden="true"
                  />
                  <span>{email.value}</span>
                </a>
              ) : null}
            </div>

            {/* Right side: Location link (only if addresses configured) */}
            {citiesText ? (
              <Link
                href={ROUTES.contactUs}
                className="inline-flex items-center gap-1.5 text-brand-dark-muted transition-colors hover:text-brand-dark-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light rounded-xs"
              >
                <IconMapPin
                  className="size-3.5 shrink-0 text-accent-light"
                  aria-hidden="true"
                />
                <span>{citiesText}</span>
              </Link>
            ) : null}
          </div>
        </Container>
      </div>

      {/* Small screens (below md: 768px): full-width row */}
      {hasPhone && hasEmail && phone && email ? (
        <div className="grid grid-cols-2 divide-x divide-white/10 md:hidden border-b border-white/10">
          <a
            href={phone.href}
            className="flex min-h-[44px] items-center justify-center gap-1.5 px-1 min-[360px]:px-2 text-[0.6875rem] min-[360px]:text-[0.75rem] font-medium text-brand-dark-foreground transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-inset"
          >
            <IconPhone
              className="size-3.5 shrink-0 text-accent-light"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap">{phone.display}</span>
          </a>

          <a
            href={email.href}
            aria-label={`Email ${email.value}`}
            className="flex min-h-[44px] items-center justify-center gap-1.5 px-1 min-[360px]:px-2 text-[0.6875rem] min-[360px]:text-[0.75rem] font-medium text-brand-dark-foreground transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-inset"
          >
            <IconMail
              className="size-3.5 shrink-0 text-accent-light"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap sm:hidden">Email us</span>
            <span className="hidden whitespace-nowrap sm:inline">
              {email.value}
            </span>
          </a>
        </div>
      ) : hasPhone && phone ? (
        <div className="flex md:hidden border-b border-white/10">
          <a
            href={phone.href}
            className="flex min-h-[44px] w-full items-center justify-center gap-1.5 px-2 text-[0.75rem] font-medium text-brand-dark-foreground transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-inset"
          >
            <IconPhone
              className="size-3.5 shrink-0 text-accent-light"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap">{phone.display}</span>
          </a>
        </div>
      ) : hasEmail && email ? (
        <div className="flex md:hidden border-b border-white/10">
          <a
            href={email.href}
            aria-label={`Email ${email.value}`}
            className="flex min-h-[44px] w-full items-center justify-center gap-1.5 px-2 text-[0.75rem] font-medium text-brand-dark-foreground transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-inset"
          >
            <IconMail
              className="size-3.5 shrink-0 text-accent-light"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap sm:hidden">Email us</span>
            <span className="hidden whitespace-nowrap sm:inline">
              {email.value}
            </span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
