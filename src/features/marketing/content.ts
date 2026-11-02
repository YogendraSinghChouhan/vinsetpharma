import {
  IconCheck,
  IconCompass,
  IconFlask,
  IconHeartHandshake,
  IconShieldCheck,
  IconTarget,
} from "@tabler/icons-react";
import { ROUTES } from "@/config/site";

const COMPANY_HISTORY = "PLACEHOLDER: Add the company history here.";

const MISSION_STATEMENT =
  "PLACEHOLDER: Add the company mission statement here.";

export const HERO = {
  headline: "Reliable pharmaceutical products, built on careful science.",
  supportingLine:
    "Vinsent Pharma develops, prepares and supplies pharmaceutical products for healthcare providers and the people they serve.",
  primaryCta: {
    label: "Our Products",
    href: ROUTES.products,
  },
  secondaryCta: {
    label: "Contact Us",
    href: ROUTES.contactUs,
  },
} as const;

export const ABOUT = {
  introduction: {
    heading: "About Us",
    text: "Vinsent Pharma is a pharmaceutical company focused on careful preparation and quality of its products.",
    history: COMPANY_HISTORY,
    linkLabel: "More about our company",
  },
  mission: {
    heading: "Our Mission",
    statement: MISSION_STATEMENT,
  },
  values: {
    heading: "Our Values",
    items: [
      {
        title: "Quality",
        text: "Quality is applied consistently across preparation and review.",
      },
      {
        title: "Integrity",
        text: "Commitments are communicated clearly and followed carefully.",
      },
      {
        title: "Care",
        text: "Attention to detail reflects the responsibility of the work.",
      },
    ],
  },
  whatWeDo: {
    heading: "What We Do",
    text: "Vinsent Pharma focuses on the preparation and supply of pharmaceutical products.",
  },
} as const;

export const WHY_US_ICONS = {
  qualityAssurance: IconCheck,
  qualityIngredients: IconFlask,
  trustAndCommitment: IconShieldCheck,
  mission: IconTarget,
  reach: IconCompass,
  customerFocus: IconHeartHandshake,
} as const;

export const WHY_US = {
  heading: "Why Vinsent Pharma",
  points: [
    {
      icon: "qualityAssurance",
      title: "Quality Assurance",
      shortDescription:
        "Defined quality practices are applied at each preparation step.",
      detailedDescription:
        "Vinsent Pharma applies documented quality assurance practices across product preparation and before release.",
    },
    {
      icon: "qualityIngredients",
      title: "Quality Ingredients",
      shortDescription:
        "Ingredients are identified before they are used in preparation.",
      detailedDescription:
        "Raw materials are checked for identity as part of the preparation process.",
    },
    {
      icon: "trustAndCommitment",
      title: "Trust and Commitment",
      shortDescription: "Commitments are stated openly and kept visible.",
      detailedDescription:
        "The company publishes its commitments and reviews them over time.",
    },
    {
      icon: "mission",
      title: "Mission",
      shortDescription: "The mission guides the company decisions.",
      detailedDescription: MISSION_STATEMENT,
    },
    {
      icon: "reach",
      title: "Reach",
      shortDescription: "The company service scope is clearly defined.",
      detailedDescription:
        "The scope of the company operations is defined and communicated.",
    },
    {
      icon: "customerFocus",
      title: "Customer Focus",
      shortDescription: "Customer requirements guide preparation priorities.",
      detailedDescription:
        "Requirements communicated by customers shape how products are prepared.",
    },
  ],
} as const;

export type WhyUsPoint = (typeof WHY_US.points)[number];

export const CTA = {
  heading: "Browse our products and request a quote.",
  text: "Explore the Vinsent Pharma product range and send a request for a quote for the products you need.",
  primaryCta: {
    label: "Browse Products",
    href: ROUTES.products,
  },
  secondaryCta: {
    label: "Contact Us",
    href: ROUTES.contactUs,
  },
} as const;

export const PAGE_META = {
  home: {
    title: "Home",
    description:
      "Vinsent Pharma develops, prepares and supplies pharmaceutical products for healthcare providers and the people they serve.",
  },
  about: {
    title: "About Us",
    description:
      "Learn about Vinsent Pharma, its preparation and quality approach, mission and values.",
  },
  whyUs: {
    title: "Why Us",
    description:
      "The reasons Vinsent Pharma applies quality assurance, careful ingredients and customer focus to its products.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Contact Vinsent Pharma for address, phone, email and working hours.",
  },
} as const;
