import { CONTACT, LEGAL, LOGO_ASSET, SOCIAL_LINKS } from "../src/config/site";
import { ABOUT } from "../src/features/marketing/content";

interface CheckItem {
  key: string;
  label: string;
  isSet: boolean;
  value?: string | number | null;
}

const items: CheckItem[] = [
  {
    key: "address",
    label: "Company Address",
    isSet: CONTACT.addresses.length > 0,
    value:
      CONTACT.addresses.map((a) => `${a.label}: ${a.text}`).join(" | ") || null,
  },
  {
    key: "phones",
    label: "Phone Numbers",
    isSet: CONTACT.phones.length > 0,
    value: CONTACT.phones.map((p) => p.display).join(", ") || null,
  },
  {
    key: "email",
    label: "Business Email",
    isSet: Boolean(CONTACT.email?.value),
    value: CONTACT.email?.value,
  },
  {
    key: "workingHours",
    label: "Working Hours",
    isSet: Boolean(CONTACT.workingHours?.value),
    value: CONTACT.workingHours?.value,
  },
  {
    key: "companyHistory",
    label: "Company History",
    isSet: Boolean(ABOUT.introduction.history),
    value: ABOUT.introduction.history,
  },
  {
    key: "jurisdiction",
    label: "Legal Jurisdiction",
    isSet: Boolean(LEGAL.jurisdiction),
    value: LEGAL.jurisdiction,
  },
  {
    key: "socialLinks",
    label: "Social Links",
    isSet: SOCIAL_LINKS.length > 0,
    value: SOCIAL_LINKS.map((s) => s.label).join(", ") || null,
  },
  {
    key: "logoAsset",
    label: "Real Logo Asset",
    isSet: Boolean(LOGO_ASSET),
    value: LOGO_ASSET,
  },
];

console.log("\n--- Client Content Configuration Checklist ---\n");
for (const item of items) {
  const marker = item.isSet ? "[✓] Set  " : "[ ] Unset";
  const detail = item.isSet
    ? `(${item.value})`
    : "(Not configured - neutral fallback will display)";
  console.log(`${marker}  ${item.label}: ${detail}`);
}

const unsetCount = items.filter((item) => !item.isSet).length;
const setCount = items.length - unsetCount;
console.log(
  `\nSummary: ${setCount}/${items.length} configured. (${unsetCount} unset)\n`,
);

const isStrict = process.argv.includes("--strict");

if (isStrict && unsetCount > 0) {
  console.error(
    `[STRICT MODE FAIL] ${unsetCount} client detail(s) remain unset.\n`,
  );
  process.exit(1);
}

process.exit(0);
