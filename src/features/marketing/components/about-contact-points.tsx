import {
  IconArrowRight,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { CONTACT, ROUTES } from "@/config/site";
import { ABOUT } from "../content";

export function AboutContactPoints() {
  const primaryPhone = CONTACT.phones[0];
  const email = CONTACT.email;

  return (
    <section className="py-12 sm:py-16 border-t border-border/60 bg-card">
      <Container>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Regional Presence
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {ABOUT.contactPoints.heading}
            </h2>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              {ABOUT.contactPoints.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">
            {CONTACT.addresses.map((address) => (
              <div
                key={address.id}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface-tint/50 p-6 sm:p-7 shadow-2xs"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-primary font-heading font-semibold text-lg">
                    <IconMapPin
                      className="size-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{address.label} Contact Point</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {address.text}
                  </p>
                </div>

              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-border/80 bg-surface-tint p-6">
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              {primaryPhone ? (
                <a
                  href={primaryPhone.href}
                  className="inline-flex min-h-[44px] items-center gap-2 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  <IconPhone
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                  <span>{primaryPhone.display}</span>
                </a>
              ) : null}
              {email ? (
                <a
                  href={email.href}
                  className="inline-flex min-h-[44px] items-center gap-2 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  <IconMail
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                  <span>{email.value}</span>
                </a>
              ) : null}
            </div>

            <Button
              nativeButton={false}
              render={
                <Link href={ROUTES.contactUs}>
                  <span>Full Contact Page</span>
                  <IconArrowRight
                    className="size-4 ml-1.5"
                    aria-hidden="true"
                  />
                </Link>
              }
              variant="outline"
              className="min-h-[44px] rounded-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
