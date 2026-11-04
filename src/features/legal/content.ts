import { CONTACT, LEGAL, SITE_NAME } from "@/config/site";

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | string;

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const LEGAL_LAST_UPDATED = "2 November 2026";

/**
 * Third-party service providers engaged to support website operations.
 * Single source of truth for external processing disclosures.
 */
export const SERVICE_PROVIDERS = [
  {
    name: "Vercel",
    purpose: "Website hosting, cloud infrastructure, and edge request delivery",
  },
  {
    name: "Neon",
    purpose:
      "Managed PostgreSQL database hosting for product, blog, and quote request records",
  },
  {
    name: "Amazon Web Services (S3-compatible)",
    purpose: "Cloud object storage for product imagery and media files",
  },
  {
    name: "Resend",
    purpose:
      "Transactional email service for delivering internal quote notification alerts",
  },
] as const;

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  description: `Information on how ${SITE_NAME} collects, handles, and protects details submitted through this website.`,
  lastUpdated: LEGAL_LAST_UPDATED,
  sections: [
    {
      id: "who-we-are",
      heading: "Who We Are",
      blocks: [
        {
          type: "paragraph",
          text: `This website is operated by ${SITE_NAME}, a pharmaceutical marketing company that presents product information and coordinates commercial enquiries with relevant authorized partners.`,
        },
        {
          type: "paragraph",
          text: CONTACT.email?.value
            ? `If you have questions regarding this privacy policy or our data handling practices, you may reach out to us at ${CONTACT.email.value} or using the contact details published on our website.`
            : "If you have questions regarding this privacy policy or our data handling practices, you may reach out to us using the contact details published on our website.",
        },
      ],
    },
    {
      id: "information-we-collect",
      heading: "Information We Collect",
      blocks: [
        {
          type: "paragraph",
          text: "We collect information you choose to submit when requesting a product quote on our website. This includes your name, email address, telephone number, message text, the pharmaceutical product you selected, and the date and time of submission.",
        },
        {
          type: "paragraph",
          text: "When you access our website or submit forms, limited technical and security data is automatically processed. This includes your IP address, browser and device characteristics, and security verification tokens required to perform anti-abuse checks.",
        },
        {
          type: "paragraph",
          text: "For authorized administrative staff who log in to the management dashboard, we store login credentials (work email and hashed password) and session identifiers. Public visitor registration and customer accounts are not provided on this site.",
        },
      ],
    },
    {
      id: "how-we-use-information",
      heading: "How We Use It",
      blocks: [
        {
          type: "paragraph",
          text: "Information submitted to us is used for defined operational and business purposes:",
        },
        {
          type: "list",
          items: [
            "Reviewing and responding to your enquiries and product quotation requests",
            "Delivering internal email notifications to our team regarding new submissions",
            "Operating, securing, and maintaining the website and preventing automated spam or malicious activity",
            "Maintaining standard commercial records of business inquiries",
          ],
        },
      ],
    },
    {
      id: "who-processes-data",
      heading: "Who Processes It for Us",
      blocks: [
        {
          type: "paragraph",
          text: "We engage selected third-party service providers to support the technical operation of our website. These providers handle information only to perform the services assigned to them:",
        },
        {
          type: "list",
          items: SERVICE_PROVIDERS.map(
            (provider) => `${provider.name}: ${provider.purpose}.`,
          ),
        },
      ],
    },
    {
      id: "cookies",
      heading: "Cookies",
      blocks: [
        {
          type: "paragraph",
          text: "We do not deploy marketing cookies, advertising trackers, or third-party web analytics scripts on this website.",
        },
        {
          type: "paragraph",
          text: "A strictly necessary session cookie is used solely to authenticate authorized company personnel who sign in to the internal administrative dashboard. General website visitors browsing public pages do not receive persistent tracking cookies.",
        },
      ],
    },
    {
      id: "retention",
      heading: "How Long We Keep It",
      blocks: [
        {
          type: "paragraph",
          text: "We retain quotation requests and correspondence for the duration necessary to address your enquiry, complete relevant follow-up discussions, and fulfill internal business record-keeping requirements.",
        },
        {
          type: "paragraph",
          text: "When records are no longer required for active communication or business reference, they are reviewed and routinely removed.",
        },
      ],
    },
    {
      id: "security",
      heading: "Security",
      blocks: [
        {
          type: "paragraph",
          text: "We maintain reasonable organizational and technical safeguards designed to protect submitted information against unauthorized access, disclosure, alteration, or misuse.",
        },
        {
          type: "paragraph",
          text: "While we take proactive measures to protect information, electronic transmission over the internet and digital data storage can encounter security risks, and absolute security cannot be assured.",
        },
      ],
    },
    {
      id: "international-processing",
      heading: "International Processing",
      blocks: [
        {
          type: "paragraph",
          text: "Our cloud hosting, database, email, and security providers maintain distributed server infrastructure that may process or store data in countries other than your own. Using our website or submitting an enquiry means your details may be transferred to and stored in these locations.",
        },
      ],
    },
    {
      id: "your-choices",
      heading: "Your Choices",
      blocks: [
        {
          type: "paragraph",
          text: "You may contact us at any time to ask to access, correct or delete your details. We consider and respond to all requests in accordance with applicable law.",
        },
      ],
    },
    {
      id: "children",
      heading: "Children",
      blocks: [
        {
          type: "paragraph",
          text: "This website is intended for healthcare providers, trade partners, and adult visitors. It is not directed at children, and we do not knowingly solicit or collect personal information from individuals under legal majority age.",
        },
      ],
    },
    {
      id: "changes-to-this-policy",
      heading: "Changes to This Policy",
      blocks: [
        {
          type: "paragraph",
          text: "We may periodically revise this privacy policy to reflect operational, procedural, or technical updates. Any changes will be published directly on this page with a revised last-updated date.",
        },
      ],
    },
  ],
};

export const TERMS_AND_CONDITIONS: LegalDocument = {
  title: "Terms & Conditions",
  description: `Terms and conditions governing your access and use of the ${SITE_NAME} website.`,
  lastUpdated: LEGAL_LAST_UPDATED,
  sections: [
    {
      id: "about-these-terms",
      heading: "About These Terms",
      blocks: [
        {
          type: "paragraph",
          text: `These terms and conditions govern your access to and use of the website provided by ${SITE_NAME}. By visiting or using this website, you agree to comply with and be bound by these terms. If you do not agree, please discontinue using the website.`,
        },
      ],
    },
    {
      id: "using-this-website",
      heading: "Using This Website",
      blocks: [
        {
          type: "paragraph",
          text: "You agree to use this website solely for lawful purposes. You agree not to:",
        },
        {
          type: "list",
          items: [
            "Attempt to disrupt, interfere with, or compromise the stability or security of the website or underlying networks",
            "Probe, scan, or test the vulnerability of any system, endpoint, or authentication mechanism",
            "Submit excessive automated requests or take actions that impose an unreasonable burden on website infrastructure",
            "Use automated scrapers, web crawlers, or harvesting tools to extract content, images, or data without prior written authorization",
            "Introduce malicious software, viruses, or unauthorized scripts",
          ],
        },
      ],
    },
    {
      id: "information-on-this-website",
      heading: "Information on This Website",
      blocks: [
        {
          type: "paragraph",
          text: "Content published on this website is provided for general informational and product presentation purposes only. It does not constitute medical advice, diagnosis, treatment, or professional pharmaceutical consultation.",
        },
        {
          type: "paragraph",
          text: "Product descriptions, specifications, taglines, and package renderings are illustrative and subject to modification. Healthcare professionals and patients should rely on qualified clinical practitioners and official product packaging documentation for clinical determinations.",
        },
      ],
    },
    {
      id: "products-and-quote-requests",
      heading: "Products and Quote Requests",
      blocks: [
        {
          type: "paragraph",
          text: "This website is not an eCommerce store. We do not sell pharmaceutical products directly through the website or collect payments online.",
        },
        {
          type: "paragraph",
          text: "Submitting a quote request is an expression of interest to receive quotation information. It does not constitute a purchase order, an acceptance of an offer, or a binding agreement of sale.",
        },
        {
          type: "paragraph",
          text: "Any commercial transaction involving pharmaceutical products is handled separately by the relevant authorized parties and is subject to customer qualification, licensing verification, and formal written agreements.",
        },
      ],
    },
    {
      id: "intellectual-property",
      heading: "Intellectual Property",
      blocks: [
        {
          type: "paragraph",
          text: `All content, branding, designs, graphics, icons, text, and layout on this website are owned by ${SITE_NAME} or its licensors and are protected under intellectual property rights.`,
        },
        {
          type: "paragraph",
          text: "You may view and print content from this website for personal or legitimate evaluation purposes. Modifying, reproducing, redistributing, or publishing site materials without prior written consent is prohibited.",
        },
      ],
    },
    {
      id: "links-and-third-party-services",
      heading: "Links and Third-Party Services",
      blocks: [
        {
          type: "paragraph",
          text: "This website may reference external links or integrate third-party services (such as security verification). We do not control or endorse external websites and are not responsible for their content, policies, or availability.",
        },
      ],
    },
    {
      id: "disclaimers",
      heading: "Disclaimers",
      blocks: [
        {
          type: "paragraph",
          text: 'To the fullest extent permitted by applicable law, this website and its content are provided on an "as is" and "as available" basis without warranties of any kind, whether express, statutory, or implied.',
        },
        {
          type: "paragraph",
          text: "We do not warrant that the website will function without interruption or errors, or that information displayed will at all times be complete or up to date.",
        },
      ],
    },
    {
      id: "limitation-of-liability",
      heading: "Limitation of Liability",
      blocks: [
        {
          type: "paragraph",
          text: `To the extent permitted by applicable law, ${SITE_NAME} and its personnel shall not be liable for any indirect, consequential, special, or incidental damages arising out of your access to, use of, or inability to use this website.`,
        },
      ],
    },
    {
      id: "changes-to-the-site-or-terms",
      heading: "Changes to the Site or Terms",
      blocks: [
        {
          type: "paragraph",
          text: "We reserve the right to amend website content or these terms at any time. Any changes take effect immediately upon being posted on this page. Your continued use of the website signifies your acceptance of updated terms.",
        },
      ],
    },
    // Render governing law section ONLY when LEGAL.jurisdiction is configured
    ...(LEGAL.jurisdiction
      ? [
          {
            id: "governing-law",
            heading: "Governing Law and Jurisdiction",
            blocks: [
              {
                type: "paragraph" as const,
                text: `These terms are governed by and construed in accordance with the laws of ${LEGAL.jurisdiction}. Any disputes arising out of or relating to these terms shall be subject to the jurisdiction of the competent courts in ${LEGAL.jurisdiction}.`,
              },
            ],
          },
        ]
      : []),
    {
      id: "contact",
      heading: "Contact",
      blocks: [
        {
          type: "paragraph",
          text: CONTACT.email?.value
            ? `If you have questions or concerns regarding these terms and conditions, please reach out to us at ${CONTACT.email.value} or through our website contact page.`
            : "If you have questions or concerns regarding these terms and conditions, please reach out to us through our website contact page.",
        },
      ],
    },
  ],
};
