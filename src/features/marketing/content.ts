/**
 * Every statement in this file must be confirmed by the client before launch.
 * Single source of truth for marketing copy across the public website.
 */

import {
  IconCheck,
  IconCompass,
  IconFileText,
  IconFlask,
  IconHeartHandshake,
  IconInfoCircle,
  IconMapPin,
  IconPhoneCall,
  IconPill,
  IconShieldCheck,
  IconTarget,
} from "@tabler/icons-react";
import { ROUTES } from "@/config/site";

const COMPANY_HISTORY =
  "In 2015, with a vision of making pharmaceutical product information more accessible and helping healthcare buyers connect with the right commercial partners, Vinset pharmaceuticals began its journey as a pharmaceutical marketing company.";

const MISSION_STATEMENT =
  "To make pharmaceutical product information easier to discover and help healthcare buyers connect with qualified commercial partners.";

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
  };
  intro: string;
  principles: string;
  message: FounderMessage;
  bio: string | null;
};

export const FOUNDER: Founder = {
  name: "Dr. Vishnu Saini",
  role: "Chief Executive Officer",
  image: {
    src: "/images/about/vishnu-saini.jpg",
    width: 1086,
    height: 1448,
    alt: "Dr. Vishnu Saini, Chief Executive Officer of Vinset pharmaceuticals",
  },
  intro:
    "Dr. Vishnu Saini leads Vinset pharmaceuticals as Chief Executive Officer. He helps guide the company's pharmaceutical marketing focus and relationships with healthcare partners.",
  principles:
    "We believe in clear communication, careful attention to every enquiry and straightforward dealings with the people we work with.",
  message: null,
  bio: null,
};

export const HERO = {
  headline: "Think about your life",
  supportingLine:
    "Vinset pharmaceuticals presents pharmaceutical products clearly and helps healthcare buyers begin informed commercial conversations.",
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
  header: {
    title: "About Vinset pharmaceuticals",
    tagline: "Careful science for pharmaceutical care.",
    intro:
      "Vinset pharmaceuticals is a pharmaceutical marketing company that presents product information clearly and helps healthcare buyers connect with qualified commercial partners.",
  },
  introduction: {
    heading: "About Us",
    text: "Vinset pharmaceuticals is a dedicated pharmaceutical marketing company focused on presenting product information to healthcare institutions, clinics, and professional procurement teams across regional networks.",
    history: COMPANY_HISTORY,
    linkLabel: "More about our company",
  },
  whoWeAre: {
    heading: "Who We Are",
    subheading:
      "Research-based formulation insight with a clear focus on pharmaceutical marketing.",
    paragraphs: [
      "Vinset pharmaceuticals is a pharmaceutical marketing company focused on helping healthcare institutions, clinics, and professional procurement teams discover relevant product information and begin clear commercial conversations.",
      "Our work is informed by research-based formulation thinking. We study therapeutic categories, dosage forms, ingredient information, intended use, packaging requirements, and the practical questions healthcare buyers raise when evaluating pharmaceutical products.",
      "This research perspective helps us organize and communicate product information with greater clarity. It also helps us identify the details that matter to clinics, procurement teams, distributors, and other professional audiences before they begin a commercial conversation.",
      "Our catalogue presents a diverse selection of solid oral dosage forms, liquid preparations, and specialized therapeutic formulations. Through this digital platform, buyers can review product specifications, examine packaging formats, and submit structured enquiries for follow-up with the appropriate commercial partner.",
],
    history: COMPANY_HISTORY,
  },
  missionVision: {
    heading: "Mission & Vision",
    mission: {
      title: "Our Mission",
      statement: MISSION_STATEMENT,
      supporting:
        "We focus on clear product information, responsible marketing communication, and helpful conversations with every partner.",
    },
    vision: {
      title: "Our Vision",
      statement:
        "To build enduring relationships with healthcare professionals through honest marketing and useful product information.",
      supporting:
        "We aspire to be recognized for reliable information, transparent cooperation, and attentive service across every commercial enquiry.",
    },
  },
  whatWeDo: {
    heading: "What We Do",
    subheading: "Helping healthcare buyers make informed product enquiries.",
    items: [
      {
        icon: "productRange",
        title: "Showcase our product range",
        text: "We maintain an up-to-date online catalogue detailing formulations, active strengths, packaging configurations, and therapeutic categories. Each product entry provides clear, verified facts regarding presentation and composition.",
      },
      {
        icon: "quoteRequests",
        title: "Handle your quote requests",
        text: "We provide an intuitive quotation system allowing buyers to specify order requirements, pack preferences, and delivery destinations. Every submission generates a dedicated enquiry record reviewed promptly by our team.",
      },
      {
        icon: "directContact",
        title: "Stay in touch directly",
        text: "We follow up on every enquiry by telephone or email from our Mumbai team to clarify product information and connect buyers with the appropriate commercial contact.",
      },
      {
        icon: "clearInformation",
        title: "Keep information clear",
        text: "We communicate openly regarding product information, enquiry steps, and commercial discussions so you can proceed with clarity.",
      },
    ],
  },
  values: {
    heading: "Our Values",
    subheading:
      "Principles guiding our marketing approach and client relationships.",
    items: [
      {
        title: "Integrity",
        text: "We build every professional relationship on honesty, accountability, and respect. Clear information about our products and processes helps healthcare partners make confident decisions.",
      },
      {
        title: "Quality focus",
        text: "We present product information thoughtfully and encourage clear documentation so buyers can review formulations and packaging with confidence.",
      },
      {
        title: "Reliability",
        text: "We aim for steady communication and organized enquiry handling that healthcare buyers and commercial partners can count on.",
      },
      {
        title: "Transparency",
        text: "We present clear specifications, straightforward terms, and honest guidance regarding our product catalogue. We provide unambiguous information so every commercial discussion begins with clarity.",
      },
      {
        title: "Responsibility",
        text: "We recognize the vital role pharmaceuticals play in healthcare and approach every request with diligence, clarity, and respect for professional requirements.",
      },
    ],
  },
  workflow: {
    heading: "How Working With Us Looks",
    subheading:
      "A straightforward four-step process from enquiry to consultation.",
    steps: [
      {
        number: 1,
        title: "Browse the products",
        text: "Explore our online catalogue to review available formulations, strengths, and pack formats suited to your clinical needs. Filter by category or search by active ingredients to locate appropriate options.",
      },
      {
        number: 2,
        title: "Request a quote on the product you need",
        text: "Submit a concise quotation enquiry specifying your requested volume, organization details, and contact preferences. The form is straightforward and takes only moments to complete.",
      },
      {
        number: 3,
        title: "We contact you by phone or email",
        text: "A representative reviews your enquiry and reaches out directly using your preferred channel to clarify product details and explain the next commercial discussion.",
      },
      {
        number: 4,
        title: "Discuss your requirements",
        text: "We help clarify your requirements, product information, and next steps through direct, personalized consultation. Any commercial agreement is handled separately by the relevant authorized parties.",
      },
    ],
  },
  contactPoints: {
    heading: "Where to Find Us",
    subheading: "Direct contact established to support procurement.",
    intro:
      "Vinset pharmaceuticals coordinates marketing enquiries from our Mumbai office. Whether discussing product information, wholesale requirements, or institutional procurement needs, our team provides prompt attention and helps connect interested buyers with appropriate commercial partners.",
  },
} as const;

export const ABOUT_ICONS = {
  productRange: IconPill,
  quoteRequests: IconFileText,
  directContact: IconPhoneCall,
  clearInformation: IconInfoCircle,
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
  heading: "Why Vinset pharmaceuticals",
  intro:
    "Healthcare providers and procurement teams choose Vinset pharmaceuticals for clear product information, open communication, and attentive enquiry support. We help visitors move from initial discovery to a well-prepared commercial enquiry.",
  points: [
    {
      icon: "qualityAssurance",
      title: "Quality Assurance",
      shortDescription:
        "Product information is presented clearly and responsibly.",
      detailedDescription:
        "We aim to present product specifications, packaging details, and category information clearly. Our approach prioritizes careful communication so healthcare buyers can review information responsibly before beginning a commercial discussion.",
    },
    {
      icon: "qualityIngredients",
      title: "Clear Product Information",
      shortDescription:
        "Product information helps buyers understand listed ingredients.",
      detailedDescription:
        "Our catalogue helps buyers review listed active ingredients and product details supplied through relevant commercial channels. We encourage healthcare professionals to confirm current specifications and documentation with authorized product representatives.",
    },
    {
      icon: "trustAndCommitment",
      title: "Trust and Commitment",
      shortDescription: "Commitments are stated openly and kept visible.",
      detailedDescription:
        "We value transparent relationships built on honest dialogue and clear expectations. When you contact us for product details, we share straightforward information and help direct your enquiry to the appropriate commercial contact.",
    },
    {
      icon: "mission",
      title: "Clear Mission",
      shortDescription: "The mission guides company decisions.",
      detailedDescription:
        "Our mission centers on helping healthcare providers discover relevant pharmaceutical products through clear information and responsible marketing communication. We aim to make the first step of every enquiry straightforward and useful.",
    },
    {
      icon: "reach",
      title: "Convenient Reach Through Mumbai",
      shortDescription: "The company service scope is clearly defined.",
      detailedDescription:
        "With our contact point established in Mumbai, we facilitate accessible communication for healthcare buyers and commercial partners. Interested organizations can connect with our personnel by phone or email for prompt enquiry support and clear next steps.",
    },
    {
      icon: "customerFocus",
      title: "Customer Focus",
      shortDescription: "Customer requirements guide marketing priorities.",
      detailedDescription:
        "We listen closely to the requirements of distributors, clinics, and healthcare institutions to shape our marketing support. Our team records product interests, packaging preferences, and documentation questions to make the commercial discussion efficient and collaborative.",
    },
  ],
  expectations: {
    heading: "What to Expect When You Work With Us",
    subheading: "A collaborative partnership built on four foundational aims.",
    items: [
      {
        title: "Clear Communication",
        text: "We aim to respond promptly to your enquiries and keep discussions direct, polite, and transparent.",
      },
      {
        title: "Formulation Clarity",
        text: "We aim to provide comprehensive product sheets, accurate ingredient disclosures, and clear packaging descriptions.",
      },
      {
        title: "Operational Consistency",
        text: "We aim to maintain clear catalogue information and honor the communication commitments agreed during consultation.",
      },
      {
        title: "Attentive Follow-Up",
        text: "We aim to verify your satisfaction following order fulfilment and assist with subsequent replenishment needs.",
      },
    ],
  },
  commitments: {
    heading: "Our Commitments",
    subheading: "Guiding principles governing our everyday operations.",
    items: [
      "We commit to honest representations of our product catalogue and marketing role.",
      "We commit to safeguarding buyer confidentiality throughout quote consultations.",
      "We commit to respectful, prompt, and professional communication on every enquiry.",
      "We commit to continuous refinement of our handling, storage, and service practices.",
    ],
  },
  faq: {
    heading: "Frequently Asked Questions",
    subheading:
      "Answers regarding our enquiry process, marketing role, and communication.",
    items: [
      {
        question: "How do I request a quote for a product?",
        answer:
          "Navigate to the Our Products page, select the specific product you require, and complete the quotation request form with your estimated quantity and contact details.",
      },
      {
        question: "Can I purchase products or place orders directly online?",
        answer:
          "No. The website is an informational catalogue and enquiry platform. We do not process online transactions, take credit card payments, or conclude binding sales online. All orders are finalised through separate written agreement and direct consultation.",
      },
      {
        question: "What information should I include in a quote request?",
        answer:
          "We recommend providing your name, organization or practice name, phone number, email address, and the product, pack format, or volume you wish to discuss.",
      },
      {
        question:
          "How will Vinset pharmaceuticals get in touch with me after I submit a quote?",
        answer:
          "A member of our team will contact you directly via the telephone number or email address provided in your form, typically within standard business hours.",
      },
      {
        question: "Where can I reach Vinset pharmaceuticals directly?",
        answer:
          "You can reach us through our Mumbai office. Our phone number, email address, and map link are available on our Contact Us page and in the website footer.",
      },
      {
        question:
          "What should I do if a product I need is not listed in the catalogue?",
        answer:
          "Please reach out to us directly by phone or email. Our team can clarify the requested product information and connect your enquiry with the appropriate commercial contact.",
      },
      {
        question:
          "Does this website provide medical advice or patient diagnoses?",
        answer:
          "No. Information presented on this website is intended solely for healthcare professionals and commercial buyers. It is not medical advice. Patients seeking medical guidance should always consult a qualified healthcare professional.",
      },
    ],
  },
} as const;

export type WhyUsPoint = (typeof WHY_US.points)[number];

export const CTA = {
  heading: "Browse our products and request a quote.",
  text: "Explore the Vinset pharmaceuticals product range and send a request for a quote for the products you need.",
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
      "Vinset pharmaceuticals showcases pharmaceutical products and helps healthcare buyers begin informed commercial conversations.",
  },
  about: {
    title: "About Us",
    description:
      "Learn about Vinset pharmaceuticals, our focus on pharmaceutical quality, mission and values, and how healthcare buyers request direct product quotes.",
  },
  whyUs: {
    title: "Why Us",
    description:
      "Explore why healthcare buyers choose Vinset pharmaceuticals for clear product information, responsible marketing, contact support, and direct communication.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Contact Vinset pharmaceuticals for address, phone, email and working hours.",
  },
  media: {
    title: "Media Showcase",
    description:
      "Explore photos and videos of Vinset pharmaceuticals products, packaging, and marketing activities.",
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
    description: "Find our contact details and map links.",
    href: ROUTES.contactUs,
    icon: "locations",
  },
] as const;

export const FOOTER_PILLAR_ICONS = {
  requestQuote: IconFileText,
  talkToUs: IconPhoneCall,
  locations: IconMapPin,
} as const;
