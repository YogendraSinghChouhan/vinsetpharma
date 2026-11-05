/**
 * Every statement in this file must be confirmed by the client before launch.
 * Single source of truth for marketing copy across the public website.
 */

import {
  IconFileText,
  IconHeartHandshake,
  IconInfoCircle,
  IconMapPin,
  IconPhoneCall,
  IconPill,
  IconShieldCheck,
} from "@tabler/icons-react";
import { legalName, ROUTES } from "@/config/site";


const MISSION_STATEMENT =
  "We aim to connect healthcare professionals and trade partners with information about pharmaceutical products marketed under the Vinset name.";

export type FounderMessage = {
  text: string;
  attribution: string;
} | null;

export type Founder = {
  name: string;
  role: string;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
    personName: string;
    personRole: string;
  };
  intro: string[];
  principles: string;
  message: FounderMessage;
  bio: string | null;
};

export const FOUNDER: Founder = {
  name: "Anand Saini",
  role: "Founder",
  image: {
    src: "/images/about/vishnu-saini.jpg",
    width: 1086,
    height: 1448,
    alt: "Dr. Vishnu Saini, Chief Executive Officer of Vinset pharmaceuticals",
    personName: "Dr. Vishnu Saini",
    personRole: "Chief Executive Officer",
  },
  intro: [
    "VINSET Pharmaceuticals focuses on pharmaceutical marketing, developing business relationships and presenting a range of products through its marketing activities. Our products are manufactured by our manufacturing partners and marketed under the VINSET name.",
    "VINSET Pharmaceuticals is led by Co-Founder Anand Saini, along with Dr. Vishnu Saini, who serves as Chief Executive Officer. The leadership guides the company's pharmaceutical marketing activities, professional relationships and continued growth.",
  ],
  principles:
    "Our approach is shaped by clear communication, responsible business relationships and careful attention to the product information and enquiries shared with us.",
  message: null,
  bio: null,
};

export const HERO = {
  headline: "Think about your life",
  supportingLine:
    "Vinset Pharmaceuticals is a pharmaceutical marketing company sharing clear information about pharmaceutical products with healthcare professionals and trade partners.",
  primaryCta: {
    label: "Our Products",
    href: ROUTES.products,
  },
  secondaryCta: {
    label: "Contact Us",
    href: ROUTES.contactUs,
  },
} as const;

export const HOME_COPY = {
  bannerTitle: "Pharmaceutical product marketing",
  bannerIntro:
    "Browse pharmaceutical products marketed under the Vinset name and learn how to contact our team.",
  aboutTeaser:
    "Read how Vinset markets products and shares product information.",
  categoryIntro: "Browse pharmaceutical products by category.",
  featuredProductsIntro:
    "Browse selected pharmaceutical products marketed under the Vinset name.",
  mediaIntro:
    "A visual look at pharmaceutical products, packaging and marketing information.",
  blogIntro:
    "Read product information and company updates shared for healthcare professionals and trade partners.",
} as const;

export const ABOUT = {
  header: {
    title: "About Vinset pharmaceuticals",
    tagline: "Committed to healthcare. Focused on product information. Driven by relationships.",
    intro: `${legalName} is a pharmaceutical marketing company.`,
  },
  introduction: {
    heading: "About Us",
    text: "Vinset Pharmaceuticals is a pharmaceutical marketing company focused on presenting a range of pharmaceutical products and sharing product information with healthcare professionals and trade partners.",
    linkLabel: "More about our company",
  },
  whoWeAre: {
    heading: "Who We Are",
    subheading:
      "A pharmaceutical marketing company focused on clear product information and professional relationships.",
    paragraphs: [
      `${legalName} is a pharmaceutical marketing company.`,
      "Our range covers tablets, capsules, syrups and suspensions, injectables, nutraceuticals and personal care products. Each category represents a different part of the portfolio we bring to professional attention. We share information about these products with doctors and other healthcare professionals, while trade partners can contact us to discuss their requirements.",
      "Our work centres on product presentation, responsible communication and direct follow-up. We provide the product name, composition line and pack details available for professional reference. Product pages and quote requests help start a conversation, and our team replies by phone or email using the details provided.",
      "The intended audience is healthcare professionals and trade partners. This audience statement is an assumption and must be confirmed by the client. We aim to build professional relationships through useful information, respectful communication and consistent follow-up from our Mumbai contact point.",
      "Vinset brings together a defined product range, product information, quote-request support and direct contact. We aim to keep our marketing role clear, understand the requirements shared with us and maintain steady professional relationships through thoughtful communication.",
      "We value careful listening, clear product conversations and reliable follow-up. These principles help us understand professional requirements and keep our business relationships focused, respectful and useful over time in practice.",
    ],
  },
  missionVision: {
    heading: "Mission & Vision",
    mission: {
      title: "Our Mission",
      statement: MISSION_STATEMENT,
      supporting:
        "We aim to support professional conversations with clear information and direct communication.",
    },
    vision: {
      title: "Our Vision",
      statement:
        "We aim to present pharmaceutical products responsibly and support useful professional conversations.",
      supporting:
        "We aim to work with consistency, respect and attentive follow-up.",
    },
  },
  whatWeDo: {
    heading: "What We Do",
    subheading: "Four practical parts of our marketing role.",
    items: [
      {
        icon: "productRange",
        title: "Market a range of pharmaceutical products",
        text: "We market tablets, capsules, syrups and suspensions, injectables, nutraceuticals and personal care products under the Vinset name.",
      },
      {
        icon: "quoteRequests",
        title: "Share product information",
        text: "We share product information with doctors and other healthcare professionals.",
      },
      {
        icon: "directContact",
        title: "Handle quote requests",
        text: "We receive quote requests from product pages and follow up directly with the details provided.",
      },
      {
        icon: "clearInformation",
        title: "Stay in touch by phone and email",
        text: "We reply directly by phone or email using the contact details provided by the visitor.",
      },
    ],
  },
  values: {
    heading: "Our Values",
    subheading: "Principles that guide our professional relationships.",
    items: [
      {
        title: "Clarity",
        text: "We aim to present product details and enquiry steps in an organised way.",
      },
      {
        title: "Responsibility",
        text: "We aim to present our marketing role accurately and keep product information connected to the details supplied with each product.",
      },
      {
        title: "Respect",
        text: "We aim to respect healthcare professionals, trade partners and the decisions they make.",
      },
      {
        title: "Partnership",
        text: "We aim to build constructive working relationships with healthcare professionals, trade partners and manufacturing partners.",
      },
      {
        title: "Follow-up",
        text: "We aim to respond directly by phone or email and keep conversations moving.",
      },
    ],
  },
  workflow: {
    heading: "How Working With Us Looks",
    subheading:
      "A straightforward sequence from product information to follow-up.",
    steps: [
      {
        number: 1,
        title: "Manufacturing partners produce the products",
        text: "Our manufacturing partners produce the products.",
      },
      {
        number: 2,
        title: "Vinset markets them under its name",
        text: "Vinset markets the products under the Vinset name, and the pack states “Marketed by Vinset Pharmaceuticals”.",
      },
      {
        number: 3,
        title: "Enquiries reach us",
        text: "Enquiries reach us through the website, phone or email.",
      },
      {
        number: 4,
        title: "We follow up directly",
        text: "We follow up directly by phone or email.",
      },
    ],
  },
  contactPoints: {
    heading: "Where to Find Us",
    subheading: "Our contact point is shown from site configuration.",
    intro:
      "Use the configured Mumbai contact point. For product information or a quote enquiry, our team replies by phone or email.",
  },
} as const;

export const ABOUT_ICONS = {
  productRange: IconPill,
  quoteRequests: IconFileText,
  directContact: IconPhoneCall,
  clearInformation: IconInfoCircle,
} as const;

export const WHY_US_ICONS = {
  clearInformation: IconInfoCircle,
  range: IconPill,
  quoteRequests: IconFileText,
  directContact: IconPhoneCall,
  healthcareProfessionals: IconHeartHandshake,
  marketingRole: IconShieldCheck,
} as const;

export const WHY_US = {
  heading: "Why Vinset pharmaceuticals",
  intro:
    "Choosing a pharmaceutical marketing partner involves understanding its product range, communication and approach to professional relationships. Vinset brings these elements together through a focused portfolio, product information and direct follow-up.",
  reasonsIntro:
    "Six parts of the Vinset approach to product marketing and professional communication.",
  points: [
    {
      icon: "clearInformation",
      title: "Clear Product Information",
      shortDescription:
        "Product pages show the key information available on the site.",
      detailedDescription:
        "Each product listing presents the name, composition line and pack details available for professional reference. These details help healthcare professionals and trade partners begin a focused product conversation.",
    },
    {
      icon: "range",
      title: "A Range Across Dosage Forms",
      shortDescription: "Browse the range by category.",
      detailedDescription:
        "Our range includes tablets, capsules, syrups and suspensions, injectables, nutraceuticals and personal care products. The categories reflect the different dosage forms and product areas marketed under the Vinset name.",
    },
    {
      icon: "quoteRequests",
      title: "Quote Requests From Product Pages",
      shortDescription: "Start an enquiry where you find a product.",
      detailedDescription:
        "A quote request gives healthcare professionals and trade partners a direct way to discuss a product and share the details needed for a reply. It helps the team understand the enquiry and respond to the specific requirement.",
    },
    {
      icon: "directContact",
      title: "Direct Contact by Phone and Email",
      shortDescription: "Two contact points are available.",
      detailedDescription:
        "Our configured Mumbai contact point gives professional visitors a direct way to reach the team. We reply by phone or email and keep the conversation connected to the original enquiry.",
    },
    {
      icon: "healthcareProfessionals",
      title: "Written for Healthcare Professionals",
      shortDescription:
        "Plain product information for healthcare professionals.",
      detailedDescription:
        "We share product information with healthcare professionals and keep the discussion connected to the product label and prescribing information supplied with the product.",
    },
    {
      icon: "marketingRole",
      title: "Clear About Who We Are",
      shortDescription: "Our marketing role is stated plainly.",
      detailedDescription: `Vinset markets the products, our manufacturing partners produce them, and the pack says “Marketed by ${legalName}”. This clear distinction is central to how we present the company and communicate with professional contacts.`,
    },
  ],
  expectations: {
    heading: "What to Expect",
    subheading: "Communication, clarity, consistency and follow-up shape our approach.",
    items: [
      {
        title: "Communication",
        text: "We aim to keep contact direct, respectful and useful when a professional asks about a product.",
      },
      {
        title: "Clarity",
        text: "We aim to present product information and enquiry details in an organised way.",
      },
      {
        title: "Consistency",
        text: "We aim to keep Vinset's marketing role consistent across our product information and conversations.",
      },
      {
        title: "Follow-up",
        text: "We aim to reply by phone or email and keep the next step connected to the enquiry.",
      },
    ],
  },
  commitments: {
    heading: "Our Commitments",
    subheading: "How we aim to work with professional contacts.",
    items: [
      "We aim to describe Vinset as a pharmaceutical marketing company and keep that description consistent.",
      "We aim to share product information with healthcare professionals and trade partners.",
      "We aim to make quote requests a useful starting point for direct conversations with our team.",
      "We aim to follow up directly by phone or email using the contact details provided in the enquiry.",
      "We aim to connect each conversation to the product information and requirements shared with us.",
      "We aim to build professional relationships through consistency, respect and attentive communication.",
    ],
  },
  faq: {
    heading: "Frequently Asked Questions",
    subheading:
      "Answers about products, quote requests and our marketing role.",
    items: [
      {
        question: "How do I request a quote for a product?",
        answer:
          "Open the product page and use the quote request form. You can request a quote from any product page, then provide the contact details the team should use.",
      },
      {
        question: "How are product enquiries handled?",
        answer:
          "Product enquiries begin with a quote request from a product page. Our team replies by phone or email using the contact details provided.",
      },
      {
        question: "What should I include in a quote request?",
        answer:
          "Include your name, organisation or practice, phone number, email address and the product or pack details you want to discuss. A clear message helps us understand your enquiry.",
      },
      {
        question: "Who makes the products?",
        answer: `Our manufacturing partners make the products. Vinset markets them under the Vinset name, and the pack states “Marketed by ${legalName}”.`,
      },
      {
        question: "Where can I reach Vinset pharmaceuticals?",
        answer:
          "Use the Mumbai contact point shown on the Contact Us page. Our configured phone and email details are also shown there for direct follow-up.",
      },
      {
        question: "Are these prescription medicines?",
        answer:
          "Many products are prescription medicines. Use prescription medicines only as directed by a registered medical practitioner. Always refer to the product label and the prescribing information supplied with the product.",
      },
      {
        question: "How can I ask about a product?",
        answer:
          "Contact us by phone or email and tell us what product information you need. Our team can then reply directly about the enquiry.",
      },
    ],
  },
} as const;

export type WhyUsPoint = (typeof WHY_US.points)[number];

export const CTA = {
  heading: "Browse our products and request a quote.",
  text: "Browse the range and send a quote enquiry from any product page.",
  primaryCta: { label: "Browse Products", href: ROUTES.products },
  secondaryCta: { label: "Contact Us", href: ROUTES.contactUs },
} as const;

export const FOOTER_COPY = {
  blurb:
    "Vinset Pharmaceuticals markets pharmaceutical products and shares product information with healthcare professionals.",
  disclaimer:
    "Information on this website is intended for healthcare professionals and trade partners. It provides general product information for professional reference.",
} as const;

export const PRODUCT_NOTICE =
  "Always refer to the product label. Prescription medicines are to be used only as directed by a registered medical practitioner. Images are for representation only.";

export const PAGE_META = {
  home: {
    title: "Home",
    description:
      "Vinset Pharmaceuticals markets pharmaceutical products and shares product information with healthcare professionals.",
  },
  about: {
    title: "About Us",
    description:
      "Learn how Vinset Pharmaceuticals markets products made by manufacturing partners and shares product information.",
  },
  whyUs: {
    title: "Why Us",
    description:
      "See how Vinset Pharmaceuticals presents products, handles quote enquiries and stays in touch.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Find the Vinset Pharmaceuticals contact point in Mumbai and send a product enquiry.",
  },
  media: {
    title: "Media Showcase",
    description:
      "View product and packaging media shared by Vinset Pharmaceuticals.",
  },
} as const;

export type FooterPillar = {
  title: string;
  description: string;
  href: string;
  icon: "requestQuote" | "talkToUs" | "locations";
};

export const FOOTER_PILLARS: readonly FooterPillar[] = [
  {
    title: "Request a quote",
    description: "Send an enquiry from any product page.",
    href: ROUTES.products,
    icon: "requestQuote",
  },
  {
    title: "Talk to us",
    description: "Call or email the team directly.",
    href: ROUTES.contactUs,
    icon: "talkToUs",
  },
  {
    title: "Mumbai",
    description: "Find our configured contact points.",
    href: ROUTES.contactUs,
    icon: "locations",
  },
] as const;

export const FOOTER_PILLAR_ICONS = {
  requestQuote: IconFileText,
  talkToUs: IconPhoneCall,
  locations: IconMapPin,
} as const;
