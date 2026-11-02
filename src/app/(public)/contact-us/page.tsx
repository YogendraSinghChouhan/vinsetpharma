import { ROUTES } from "@/config/site";
import { ContactDetails } from "@/features/marketing/components/contact-details";
import { PageHeader } from "@/features/marketing/components/page-header";
import { PAGE_META } from "@/features/marketing/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: PAGE_META.contact.title,
  description: PAGE_META.contact.description,
  path: ROUTES.contactUs,
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title={PAGE_META.contact.title}
        description={PAGE_META.contact.description}
        crumbs={[
          { label: "Home", href: ROUTES.home },
          { label: PAGE_META.contact.title },
        ]}
      />
      <ContactDetails />
    </>
  );
}
