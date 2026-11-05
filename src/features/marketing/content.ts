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

const COMPANY_HISTORY = `${legalName} is a pharmaceutical marketing company. Products are made by our manufacturing partners and marketed under the Vinset name. The packs state “Marketed by ${legalName}”.`;

const MISSION_STATEMENT =
  "We aim to make pharmaceutical product information clear for healthcare professionals and trade partners.";

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
  intro: string;
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
  intro:
    "Vinset pharmaceuticals was founded by Anand Saini. Dr. Vishnu Saini serves as Chief Executive Officer, helping lead the company's pharmaceutical marketing focus and relationships with healthcare partners.",
  principles:
    "We believe in clear communication, careful attention to every enquiry and straightforward dealings with the people we work with.",
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
    tagline: "Clear information from a pharmaceutical marketing company.",
    intro: `${legalName} is a pharmaceutical marketing company. Products are made by our manufacturing partners and marketed under the Vinset name.`,
  },
  introduction: {
    heading: "About Us",
    text: "We share information about our pharmaceutical products with healthcare professionals and trade partners. The website supports product browsing and quote requests, with our team available to reply by phone or email.",
    history: COMPANY_HISTORY,
    linkLabel: "More about our company",
  },
  whoWeAre: {
    heading: "Who We Are",
    subheading:
      "A pharmaceutical marketing company sharing product information with healthcare professionals.",
    paragraphs: [
      `${legalName} is a pharmaceutical marketing company. Our manufacturing partners produce the products, which are marketed under the Vinset name. The packs state “Marketed by ${legalName}”.`,
      "Our role is to present product information in a clear, plain and useful way. We share information about tablets, capsules, syrups and suspensions, injectables, nutraceuticals and personal care products with doctors and other healthcare professionals. Trade partners can also browse the range and contact us about a product.",
      "The website is a product information and enquiry platform. Visitors can browse categories, open product pages and request a quote from a product page. Our team replies by phone or email so the next conversation can be handled directly.",
      "We keep the distinction between marketing and manufacturing clear. Product pages help professional visitors find the product name, composition line and pack details available on the site. Always refer to the product label and the prescribing information supplied with the product. The website provides general product information.",
      "The intended audience is healthcare professionals and trade partners. This audience statement is an assumption and must be confirmed by the client. We aim to write for professional readers with clear descriptions of the website and Vinset. When a visitor needs more information, the contact page provides the configured Mumbai and Jaipur contact points, together with the configured phone and email details.",
      "Vinset's work is therefore straightforward: market a range of pharmaceutical products, share product information with healthcare professionals, receive quote requests and stay in touch by phone and email. We aim to make each step easy to understand while leaving clinical decisions to registered medical practitioners and the product information supplied with the product.",
    ],
    history: COMPANY_HISTORY,
  },
  missionVision: {
    heading: "Mission & Vision",
    mission: {
      title: "Our Mission",
      statement: MISSION_STATEMENT,
      supporting:
        "We aim to keep product information, quote requests and contact steps straightforward.",
    },
    vision: {
      title: "Our Vision",
      statement:
        "We aim to be a clear and useful point of contact for pharmaceutical product information.",
      supporting:
        "We aim to communicate modestly and follow up directly when a professional visitor contacts us.",
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
    subheading: "Intentions that guide how we present information.",
    items: [
      {
        title: "Clarity",
        text: "We aim to use plain language and keep product and enquiry information easy to follow.",
      },
      {
        title: "Honesty",
        text: "We aim to describe Vinset's marketing role accurately and distinguish it from the manufacturing role of our partners.",
      },
      {
        title: "Respect",
        text: "We aim to respect healthcare professionals, trade partners and the decisions they make.",
      },
      {
        title: "Consistency",
        text: "We aim to keep the website, product pages and contact steps consistent.",
      },
      {
        title: "Follow-up",
        text: "We aim to respond directly by phone or email when a visitor sends an enquiry.",
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
    subheading: "Two contact points are shown from site configuration.",
    intro:
      "Use the configured Mumbai or Jaipur contact point. For product information or a quote enquiry, our team replies by phone or email.",
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
    "We aim to make product information and quote enquiries clear for healthcare professionals and trade partners. The page explains what visitors can expect from the website.",
  reasonsIntro:
    "Six reasons to use the website for product information and quote enquiries.",
  points: [
    {
      icon: "clearInformation",
      title: "Clear Product Information",
      shortDescription:
        "Product pages show the key information available on the site.",
      detailedDescription:
        "Each product page lists the name, composition line and pack details. This gives a visitor a straightforward place to review the information shown on the site before sending an enquiry.",
    },
    {
      icon: "range",
      title: "A Range Across Dosage Forms",
      shortDescription: "Browse the range by category.",
      detailedDescription:
        "The range includes tablets, capsules, syrups and suspensions, injectables, nutraceuticals and personal care. These categories help visitors browse the products shown on the website.",
    },
    {
      icon: "quoteRequests",
      title: "Quote Requests From Product Pages",
      shortDescription: "Start an enquiry where you find a product.",
      detailedDescription:
        "You can request a quote from any product page. Include the product and contact details you want the team to use when replying.",
    },
    {
      icon: "directContact",
      title: "Direct Contact by Phone and Email",
      shortDescription: "Two contact points are available.",
      detailedDescription:
        "The website shows contact points in Mumbai and Jaipur from site configuration. Our team replies by phone or email. The configured details give professional visitors a direct way to continue a product conversation.",
    },
    {
      icon: "healthcareProfessionals",
      title: "Written for Healthcare Professionals",
      shortDescription:
        "Plain product information for healthcare professionals.",
      detailedDescription:
        "We share plain product information with healthcare professionals. Always refer to the product label and the prescribing information supplied with the product.",
    },
    {
      icon: "marketingRole",
      title: "Clear About Who We Are",
      shortDescription: "Our marketing role is stated plainly.",
      detailedDescription: `Vinset markets the products, our manufacturing partners produce them, and the pack says “Marketed by ${legalName}”. Keeping this role clear helps visitors understand what Vinset does and what the website is for.`,
    },
  ],
  expectations: {
    heading: "What to Expect",
    subheading:
      "Communication, clarity, consistency and follow-up are our aims.",
    items: [
      {
        title: "Communication",
        text: "We aim to keep contact direct, polite and easy to follow when a professional visitor asks about a product.",
      },
      {
        title: "Clarity",
        text: "We aim to present product and enquiry information plainly, with the product page as the starting point for the conversation.",
      },
      {
        title: "Consistency",
        text: "We aim to keep the same marketing role clear across the website, from the product catalogue through the contact page.",
      },
      {
        title: "Follow-up",
        text: "We aim to reply by phone or email after an enquiry and keep the next step connected to the information requested.",
      },
    ],
  },
  commitments: {
    heading: "Our Commitments",
    subheading: "How we aim to communicate.",
    items: [
      "We aim to describe Vinset as a pharmaceutical marketing company and keep that description consistent.",
      "We aim to share product information in plain language for healthcare professionals and trade partners.",
      "We aim to make quote requests a clear starting point for direct conversations with our team.",
      "We aim to follow up directly by phone or email using the contact details provided in the enquiry.",
      "We aim to keep each conversation connected to the product information and contact details shared by the visitor.",
      "We aim to make the website a clear starting point for professional product conversations.",
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
          "Use the Mumbai or Jaipur contact point shown on the Contact Us page. Our configured phone and email details are also shown there for direct follow-up.",
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
      "Find Vinset Pharmaceuticals contact points in Mumbai and Jaipur and send a product enquiry.",
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
    title: "Mumbai and Jaipur",
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
