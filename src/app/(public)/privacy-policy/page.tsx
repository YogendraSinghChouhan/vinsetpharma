import { ROUTES } from "@/config/site";
import { LegalDocument } from "@/features/legal/components/legal-document";
import { PRIVACY_POLICY } from "@/features/legal/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: PRIVACY_POLICY.title,
  description: PRIVACY_POLICY.description,
  path: ROUTES.privacyPolicy,
});

export default function PrivacyPolicyPage() {
  return <LegalDocument document={PRIVACY_POLICY} />;
}
