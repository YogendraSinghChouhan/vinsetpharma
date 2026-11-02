import {
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { CONTACT } from "@/config/site";

export function ContactDetails() {
  return (
    <section
      aria-labelledby="contact-details-heading"
      className="py-12 sm:py-16"
    >
      <h2 id="contact-details-heading" className="sr-only">
        Contact details
      </h2>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2 sm:px-6">
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <IconMapPin className="size-5 text-primary" />
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {CONTACT.address.label}
            </p>
          </div>
          <p className="text-foreground">{CONTACT.address.value}</p>
          {CONTACT.address.href ? (
            <a
              href={CONTACT.address.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary underline underline-offset-4 hover:underline"
            >
              {CONTACT.address.mapsLabel}
            </a>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <IconPhone className="size-5 text-primary" />
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {CONTACT.phones[0]?.label}
            </p>
          </div>
          {CONTACT.phones[0]?.href ? (
            <a
              href={CONTACT.phones[0].href}
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              {CONTACT.phones[0].value}
            </a>
          ) : (
            <p className="text-foreground">{CONTACT.phones[0]?.value}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <IconMail className="size-5 text-primary" />
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {CONTACT.email.label}
            </p>
          </div>
          {CONTACT.email.href ? (
            <a
              href={CONTACT.email.href}
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              {CONTACT.email.value}
            </a>
          ) : (
            <p className="text-foreground">{CONTACT.email.value}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <IconClock className="size-5 text-primary" />
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {CONTACT.workingHours.label}
            </p>
          </div>
          <p className="text-foreground">{CONTACT.workingHours.value}</p>
        </div>
      </div>
    </section>
  );
}
