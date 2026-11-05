import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { CONTACT } from "@/config/site";

export function ContactDetails() {
  const primaryPhone = CONTACT.phones[0];

  return (
    <section
      aria-labelledby="contact-details-heading"
      className="py-12 sm:py-16"
    >
      <h2 id="contact-details-heading" className="sr-only">
        Contact details
      </h2>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2 sm:px-6">
        {/* Addresses */}
        {CONTACT.addresses.map((address) => (
          <div
            key={address.id}
            className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-6 shadow-sm"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <IconMapPin
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                <p className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  {address.label} Office
                </p>
              </div>
              <p className="text-foreground leading-relaxed">{address.text}</p>
            </div>
          </div>
        ))}

        {/* Phone */}
        {primaryPhone ? (
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <IconPhone className="size-5 text-primary" aria-hidden="true" />
              <p className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Phone
              </p>
            </div>
            <div>
              <a
                href={primaryPhone.href}
                className="inline-flex min-h-[44px] items-center text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
              >
                {primaryPhone.display}
              </a>
            </div>
          </div>
        ) : null}

        {/* Email */}
        {CONTACT.email ? (
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <IconMail className="size-5 text-primary" aria-hidden="true" />
              <p className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Email
              </p>
            </div>
            <div>
              <a
                href={CONTACT.email.href}
                className="inline-flex min-h-[44px] items-center text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs break-all"
              >
                {CONTACT.email.value}
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
