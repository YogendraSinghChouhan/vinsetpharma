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
  IconPhoneCall,
  IconPill,
  IconShieldCheck,
  IconTarget,
} from "@tabler/icons-react";
import { ROUTES } from "@/config/site";

const COMPANY_HISTORY: string | null = null;

const MISSION_STATEMENT =
  "To supply dependable pharmaceutical products that support patient wellbeing and serve as a reliable partner to healthcare providers.";

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
  name: "Vishnu Saini",
  role: "Founder",
  image: {
    src: "/images/about/vishnu-saini.jpg",
    width: 1086,
    height: 1448,
    alt: "Vishnu Saini, founder of Vinsent Pharma",
  },
  intro:
    "Vinsent Pharma was founded by Vishnu Saini. The company aims to make it simple for buyers to find the products they need, request a quote and reach the team directly by phone or email.",
  principles:
    "We believe in clear communication, careful attention to every enquiry and straightforward dealings with the people we work with.",
  message: null,
  bio: null,
};

export const HERO = {
  headline: "Think about your life",
  supportingLine:
    "Vinset Pharma develops, prepares and supplies pharmaceutical products for healthcare providers and the people they serve.",
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
    title: "About Vinset Pharma",
    tagline: "Careful science for pharmaceutical care.",
    intro:
      "Vinset Pharma develops, prepares, and supplies pharmaceutical products for healthcare providers and the communities they serve. We combine structured formulation oversight with direct, attentive customer communication to facilitate reliable product supply.",
  },
  introduction: {
    heading: "About Us",
    text: "Vinset Pharma operates as a dedicated pharmaceutical supplier focused on providing dependable, carefully formulated medications to healthcare institutions, clinics, and professional procurement teams across regional networks.",
    history: COMPANY_HISTORY,
    linkLabel: "More about our company",
  },
  whoWeAre: {
    heading: "Who We Are",
    subheading: "A focused approach to pharmaceutical supply and partnership.",
    paragraphs: [
      "Vinset Pharma operates as a dedicated pharmaceutical supplier focused on providing dependable, carefully formulated medications to healthcare institutions, clinics, and professional procurement teams. We believe that dependable healthcare delivery begins with consistent product integrity, accurate labelling, and straightforward commercial cooperation.",
      "Our catalogue encompasses a diverse selection of solid oral dosage forms, liquid preparations, and specialized therapeutic formulations. Through this digital platform, buyers can review detailed product specifications, examine packaging formats, and submit structured quotation requests directly to our supply personnel without cumbersome administrative friction.",
      "We believe in accessible, personal service tailored to institutional schedules. Rather than navigating automated order queues, every quotation submitted through our platform connects you directly with a representative who coordinates pricing, availability, and dispatch logistics according to your clinical requirements.",
      "Our operations prioritize transparent dialogue, continuous batch oversight, and thorough record-keeping from initial consultation through delivery. By aligning formulation selection with regional health requirements, we support healthcare professionals with medications they can prescribe and dispense with quiet assurance.",
    ],
    history: COMPANY_HISTORY,
  },
  missionVision: {
    heading: "Mission & Vision",
    mission: {
      title: "Our Mission",
      statement: MISSION_STATEMENT,
      supporting:
        "We focus on consistent preparation, thorough batch oversight, and clear communication with every partner to sustain healthcare delivery.",
    },
    vision: {
      title: "Our Vision",
      statement:
        "To build enduring relationships with healthcare professionals through honest practices and dependable product availability.",
      supporting:
        "We aspire to be recognized for steady reliability, transparent cooperation, and attentive service across all supply discussions.",
    },
  },
  whatWeDo: {
    heading: "What We Do",
    subheading:
      "Supporting healthcare buyers at every step of product procurement.",
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
        text: "We follow up on every enquiry by telephone or email from our Mumbai or Jaipur team to confirm details and address supply queries. We believe direct human conversation resolves procurement requirements most effectively.",
      },
      {
        icon: "clearInformation",
        title: "Keep information clear",
        text: "We communicate openly regarding batch availability, preparation schedules, and delivery considerations so you can plan with certainty. We provide straightforward answers regarding lead times and supply readiness.",
      },
    ],
  },
  values: {
    heading: "Our Values",
    subheading:
      "Principles guiding our formulation approach and client relationships.",
    items: [
      {
        title: "Integrity",
        text: "We conduct every conversation with clarity and follow through on the commitments we share. Openness about product specifications and availability underpins our daily interactions with healthcare buyers.",
      },
      {
        title: "Quality focus",
        text: "We apply thoughtful review and documented standards across every product formulation we supply. Careful examination of raw components and finished packs ensures consistent presentation across batches.",
      },
      {
        title: "Reliability",
        text: "We aim for dependable availability and steady communication that supply partners can count on. Our logistics planning focuses on predictability so clinical providers receive shipments on agreed schedules.",
      },
      {
        title: "Transparency",
        text: "We present clear specifications, straightforward terms, and honest guidance regarding our product catalogue. We provide unambiguous documentation to ensure complete clarity before supply arrangements are finalized.",
      },
      {
        title: "Responsibility",
        text: "We recognize the vital role pharmaceuticals play in healthcare and approach every request with diligence. Protecting product integrity during storage and transit remains central to our supply commitments.",
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
        text: "A representative reviews your enquiry and reaches out directly using your preferred channel to confirm availability. We clarify packaging details, pricing considerations, and transit schedules.",
      },
      {
        number: 4,
        title: "Discuss your requirements",
        text: "We review pricing, dispatch logistics, and formal supply documentation through direct, personalized consultation. Supply agreements are formalized through separate written arrangements tailored to your needs.",
      },
    ],
  },
  contactPoints: {
    heading: "Where to Find Us",
    subheading:
      "Direct contact points established to support regional procurement.",
    intro:
      "vinset Pharma coordinates client enquiries through two primary contact points located in Mumbai and Jaipur. Whether discussing recurring clinic orders, wholesale shipments, or institutional procurement, our personnel provide prompt regional attention. We welcome enquiries from healthcare practitioners, institutional buyers, and distribution partners across regional markets.",
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
  heading: "Why vinset Pharma",
  intro:
    "Healthcare providers and supply managers choose vinset Pharma for our steady dedication to product consistency, open communication, and attentive service.",
  points: [
    {
      icon: "qualityAssurance",
      title: "Quality Assurance",
      shortDescription:
        "Defined quality practices are applied at each preparation step.",
      detailedDescription:
        "We aim to apply consistent, documented standards across each stage of product preparation and handling. Our approach prioritizes careful verification of specifications before any item is approved for supply. We believe that steady adherence to established guidelines is essential for every pharmaceutical formulation.",
    },
    {
      icon: "qualityIngredients",
      title: "Careful Sourcing of Ingredients",
      shortDescription:
        "Ingredients are identified before they are used in preparation.",
      detailedDescription:
        "We select raw materials and active substances through deliberate evaluation of supplier documentation. Each constituent is reviewed to confirm its identity and suitability for the intended preparation. This disciplined selection helps maintain the integrity of our finished formulations.",
    },
    {
      icon: "trustAndCommitment",
      title: "Trust and Commitment",
      shortDescription: "Commitments are stated openly and kept visible.",
      detailedDescription:
        "We value transparent relationships built on honest dialogue and fulfilled promises. When you contact us for quotation or product details, we share clear, straightforward information regarding availability and timelines. We believe long-term partnerships are earned through steady, predictable service.",
    },
    {
      icon: "mission",
      title: "Clear Mission",
      shortDescription: "The mission guides company decisions.",
      detailedDescription:
        "Our mission centers on supporting healthcare providers with dependable pharmaceutical solutions. We direct our attention toward therapeutic categories where consistent supply and clear information matter most. Every decision we take reflects our dedication to responsible pharmaceutical provision.",
    },
    {
      icon: "reach",
      title: "Convenient Reach Through Two Contact Points",
      shortDescription: "The company service scope is clearly defined.",
      detailedDescription:
        "With dedicated contact points established in both Mumbai and Jaipur, we facilitate accessible communication across regional supply networks. Buyers and healthcare institutions can connect with our personnel through direct phone lines or electronic correspondence. This regional presence allows us to address enquiries with prompt attention and local awareness.",
    },
    {
      icon: "customerFocus",
      title: "Customer Focus",
      shortDescription: "Customer requirements guide preparation priorities.",
      detailedDescription:
        "We listen closely to the requirements of distributors, clinics, and healthcare institutions to shape our service. Our team adapts to specific order quantities, packaging preferences, and documentation needs whenever practical. We aim to make the procurement discussion efficient, informative, and collaborative.",
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
        text: "We aim to maintain steady availability across our catalogue and honor the terms agreed during consultation.",
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
      "We commit to honest representations of our product catalogue and supply capabilities.",
      "We commit to safeguarding buyer confidentiality throughout quote consultations.",
      "We commit to respectful, prompt, and professional communication on every enquiry.",
      "We commit to continuous refinement of our handling, storage, and service practices.",
    ],
  },
  faq: {
    heading: "Frequently Asked Questions",
    subheading:
      "Answers regarding our quotation process, supply terms, and communication.",
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
          "We recommend providing your name, organization or practice name, phone number, email address, and the specific pack format or volume you wish to procure.",
      },
      {
        question:
          "How will vinset Pharma get in touch with me after I submit a quote?",
        answer:
          "A member of our team will contact you directly via the telephone number or email address provided in your form, typically within standard business hours.",
      },
      {
        question: "Where can I reach vinset Pharma directly?",
        answer:
          "You can reach us through our contact points in Mumbai and Jaipur. Phone numbers, email addresses, and map links are available on our Contact Us page and in the website footer.",
      },
      {
        question:
          "What should I do if a product I need is not listed in the catalogue?",
        answer:
          "Please reach out to us directly through phone or email. Our team can discuss whether the requested formulation is currently scheduled for preparation or available through special supply arrangements.",
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
  text: "Explore the vinset Pharma product range and send a request for a quote for the products you need.",
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
      "vinset Pharma develops, prepares and supplies pharmaceutical products for healthcare providers and the people they serve.",
  },
  about: {
    title: "About Us",
    description:
      "Learn about vinset Pharma, our focus on pharmaceutical quality, mission and values, and how healthcare buyers request direct product quotes.",
  },
  whyUs: {
    title: "Why Us",
    description:
      "Explore why healthcare buyers choose vinset Pharma: documented quality, careful ingredient selection, dedicated regional contact points, and direct support.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Contact vinset Pharma for address, phone, email and working hours.",
  },
  media: {
    title: "Media Showcase",
    description:
      "Explore photos and videos of vinset Pharma's manufacturing standards, quality testing operations, and modern laboratory facilities.",
  },
} as const;
