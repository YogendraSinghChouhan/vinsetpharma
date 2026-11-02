import { ROUTES } from "@/config/site";
import { LegalDocument } from "@/features/legal/components/legal-document";
import { TERMS_AND_CONDITIONS } from "@/features/legal/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: TERMS_AND_CONDITIONS.title,
  description: TERMS_AND_CONDITIONS.description,
  path: ROUTES.termsAndConditions,
});

export default function TermsAndConditionsPage() {
  return <LegalDocument document={TERMS_AND_CONDITIONS} />;
}
