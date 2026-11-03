export interface SampleProduct {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  imageUrl: string;
}

export interface SampleCategory {
  name: string;
  slug: string;
}

export const SAMPLE_CATEGORIES: readonly SampleCategory[] = [
  { name: "Tablets and Capsules", slug: "tablets-and-capsules" },
  { name: "Syrups and Suspensions", slug: "syrups-and-suspensions" },
  { name: "Creams, Gels and Ointments", slug: "creams-gels-and-ointments" },
  { name: "Injectables", slug: "injectables" },
  { name: "Sachets", slug: "sachets" },
] as const;

export const LEGACY_SAMPLE_CATEGORY_SLUGS: readonly string[] = [
  "tablets",
  "capsules",
] as const;

export const PRODUCT_TO_CATEGORY_SLUG: Record<string, string> = {
  "veltra-d-tablets": "tablets-and-capsules",
  "nexivin-capsules": "tablets-and-capsules",
  "lumivin-softgel-capsules": "tablets-and-capsules",
  "orvita-syrup": "syrups-and-suspensions",
  "zenvira-dry-syrup": "syrups-and-suspensions",
  "dermavin-cream": "creams-gels-and-ointments",
  "flexavin-gel": "creams-gels-and-ointments",
  "woundvin-ointment": "creams-gels-and-ointments",
  "clarivin-injection": "injectables",
  "hydravin-sachets": "sachets",
};

export const FEATURED_SAMPLE_PRODUCT_SLUGS: readonly string[] = [
  "veltra-d-tablets",
  "nexivin-capsules",
  "orvita-syrup",
  "dermavin-cream",
  "clarivin-injection",
  "hydravin-sachets",
] as const;

export interface SampleBlogPost {
  title: string;
  slug: string;
  seoDescription: string;
  seoTitle: null;
  content: string;
  imageUrl: string;
}

export const BLOG_POST_DISCLAIMER =
  "<p><em>This article is general information and is not medical advice. Please consult a doctor or pharmacist about your own situation.</em></p>";

export const SAMPLE_PRODUCTS: readonly SampleProduct[] = [
  {
    title: "Veltra-D Tablets",
    slug: "veltra-d-tablets",
    tagline: "Film-coated tablets in printed blister strips",
    description:
      "Veltra-D Tablets are supplied as film-coated tablets in aluminium blister strips, packed in printed cartons.\n\nStore in a cool, dry place, away from direct light and out of reach of children. Pack sizes, specifications and documentation are available on request.",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
  },
  {
    title: "Nexivin Capsules",
    slug: "nexivin-capsules",
    tagline: "Hard gelatin capsules in strip packs",
    description:
      "Nexivin Capsules are supplied as hard gelatin capsules in moisture-resistant strip packaging.\n\nStore below 30°C in a dry place. Please contact us for available pack sizes, batch documentation and supply terms.",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
  },
  {
    title: "Orvita Syrup",
    slug: "orvita-syrup",
    tagline: "Oral syrup in a tamper-evident bottle",
    description:
      "Orvita Syrup is supplied as a ready-to-use oral syrup in an amber bottle with a tamper-evident cap and a measuring cup.\n\nShake well before use. Store in a cool place and use within the period stated on the label. Request a quote for pack sizes and bulk supply.",
    imageUrl: "https://images.unsplash.com/photo-1576671081837-49000212a370",
  },
  {
    title: "Zenvira Dry Syrup",
    slug: "zenvira-dry-syrup",
    tagline: "Dry powder for oral suspension",
    description:
      "Zenvira Dry Syrup is supplied as a dry powder that is reconstituted with water to form an oral suspension.\n\nThe powder is packed in a sealed bottle with a measuring device. Storage and reconstitution instructions are printed on the carton. Contact us for specifications and availability.",
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04",
  },
  {
    title: "Clarivin Injection",
    slug: "clarivin-injection",
    tagline: "Sterile injection supplied in single-use vials",
    description:
      "Clarivin Injection is supplied as a sterile preparation in single-use glass vials, packed in labelled cartons.\n\nFor use by trained healthcare professionals only. Store as directed on the label. Please send a quote request for pack details and handling information.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
  },
  {
    title: "Dermavin Cream",
    slug: "dermavin-cream",
    tagline: "Topical cream in a squeezable tube",
    description:
      "Dermavin Cream is a topical cream supplied in a laminated tube with a sealed nozzle, packed in a printed carton.\n\nFor external use only. Store in a cool place and keep the cap closed after use. Request a quote for tube sizes and bulk orders.",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03",
  },
  {
    title: "Flexavin Gel",
    slug: "flexavin-gel",
    tagline: "Topical gel in an aluminium tube",
    description:
      "Flexavin Gel is a topical gel supplied in an aluminium tube with a sealed membrane, packed in a printed carton.\n\nFor external use only. Store below 30°C and keep away from heat. Contact us for pack sizes and supply information.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
  },
  {
    title: "Woundvin Ointment",
    slug: "woundvin-ointment",
    tagline: "Ointment in a protective tube pack",
    description:
      "Woundvin Ointment is an ointment supplied in a protective tube with a sealed nozzle, packed in a labelled carton.\n\nFor external use only. Keep the tube tightly closed and store in a cool, dry place. Please request a quote for available sizes and documentation.",
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831",
  },
  {
    title: "Hydravin Sachets",
    slug: "hydravin-sachets",
    tagline: "Powder sachets for oral solution",
    description:
      "Hydravin Sachets are supplied as single-dose powder sachets intended to be dissolved in water before use.\n\nEach sachet is individually sealed and packed in a printed carton. Store in a dry place. Contact us for pack counts and supply terms.",
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843",
  },
  {
    title: "Lumivin Softgel Capsules",
    slug: "lumivin-softgel-capsules",
    tagline: "Soft gelatin capsules in blister packs",
    description:
      "Lumivin Softgel Capsules are supplied as soft gelatin capsules in blister packs, packed in printed cartons.\n\nStore in a cool, dry place away from direct sunlight. Request a quote for pack sizes, specifications and batch documentation.",
    imageUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8",
  },
] as const;

export const SAMPLE_BLOG_POSTS: readonly SampleBlogPost[] = [
  {
    title: "How to Read a Medicine Label Correctly",
    slug: "how-to-read-a-medicine-label",
    seoDescription:
      "A simple guide to the key information printed on a medicine label and why each part matters.",
    seoTitle: null,
    content:
      "<p>A medicine label carries more information than most people notice. Taking a minute to read it can prevent avoidable mistakes.</p><h2>What to look for</h2><ul><li><strong>Name and strength:</strong> confirm it matches what was prescribed or recommended.</li><li><strong>Directions:</strong> how much to take, how often and for how long.</li><li><strong>Warnings:</strong> cautions about other medicines, food or activities.</li><li><strong>Batch number and dates:</strong> useful for tracking and for checking expiry.</li><li><strong>Storage instructions:</strong> temperature and light requirements.</li></ul><p>If anything on the label is unclear, ask a pharmacist before using the medicine.</p>",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
  },
  {
    title: "Storing Medicines Safely at Home",
    slug: "storing-medicines-safely-at-home",
    seoDescription:
      "Practical tips for storing medicines so they stay effective and out of reach of children.",
    seoTitle: null,
    content:
      "<p>How a medicine is stored can affect its quality as much as how it is made. A few simple habits go a long way.</p><h2>Simple storage habits</h2><p>Keep medicines in their original packaging so the label, batch number and instructions stay with them. Store them in a cool, dry place away from direct sunlight. Bathrooms and kitchens can be warm and humid, so a bedroom shelf or closed cupboard is often a better choice.</p><p>Always keep medicines out of reach of children, ideally in a high or locked cabinet. Close containers tightly after each use, and follow any special instructions on the label, such as refrigeration.</p>",
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831",
  },
  {
    title: "Understanding Expiry Dates and Why They Matter",
    slug: "understanding-expiry-dates",
    seoDescription:
      "What an expiry date on a medicine means and why it should be respected.",
    seoTitle: null,
    content:
      "<p>An expiry date is the point up to which the manufacturer confirms the medicine meets its quality standards, provided it has been stored as directed.</p><h2>What the date tells you</h2><p>The date is usually printed as a month and year. Unless stated otherwise, a medicine can be used up to the last day of that month. Once a container has been opened, some products, such as syrups, eye preparations and creams, have a shorter use period that is written on the label or leaflet.</p><p>Do not use medicines past their expiry date, and do not use any product that looks, smells or feels different from normal. When in doubt, check with a pharmacist.</p>",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de",
  },
  {
    title: "What Good Manufacturing Practice Means for Medicine Quality",
    slug: "what-good-manufacturing-practice-means",
    seoDescription:
      "A plain-language explanation of Good Manufacturing Practice and why it matters in pharmaceutical production.",
    seoTitle: null,
    content:
      "<p>Good Manufacturing Practice, often shortened to GMP, is a set of principles that guide how medicines are made so that quality is consistent from batch to batch.</p><h2>The main ideas</h2><ul><li><strong>Clean, controlled facilities</strong> that reduce the risk of contamination.</li><li><strong>Trained staff</strong> who follow written procedures.</li><li><strong>Documented processes</strong> so every step can be traced.</li><li><strong>Testing</strong> of materials and finished products before release.</li><li><strong>Regular inspection</strong> and review of procedures.</li></ul><p>Together these practices help ensure that a medicine is made to its intended standard every time.</p>",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074",
  },
  {
    title: "Generic Medicines Explained in Plain Language",
    slug: "generic-medicines-explained",
    seoDescription:
      "An easy explanation of what generic medicines are and how they relate to brand-name products.",
    seoTitle: null,
    content:
      "<p>A generic medicine contains the same active ingredient as an original brand-name medicine and is intended to be used in the same way.</p><h2>Key points</h2><p>Generic medicines are usually sold under their ingredient name or a different brand name. They must meet quality standards set by the regulator in each country, and their packaging, colour or shape may look different from the original.</p><p>Because the original development work has already been done, generic products are often more affordable. If you are unsure whether a generic option is suitable for you, ask your doctor or pharmacist.</p>",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
  },
  {
    title: "Questions to Ask Your Pharmacist",
    slug: "questions-to-ask-your-pharmacist",
    seoDescription:
      "Useful questions to ask a pharmacist when you receive a new medicine.",
    seoTitle: null,
    content:
      "<p>Pharmacists are trained to answer questions about medicines, and asking them is a good habit whenever you receive something new.</p><h2>Helpful questions</h2><ul><li>What is this medicine for, and how should I take it?</li><li>When is the best time of day to take it?</li><li>Should I take it with food or on an empty stomach?</li><li>What should I do if I miss a dose?</li><li>Are there other medicines, foods or drinks I should avoid?</li><li>How should I store it?</li></ul><p>Writing your questions down before you go can make the conversation quicker and clearer.</p>",
    imageUrl: "https://images.unsplash.com/photo-1576602976047-174e57a47881",
  },
  {
    title: "Safe Disposal of Unused and Expired Medicines",
    slug: "safe-disposal-of-unused-medicines",
    seoDescription:
      "General guidance on disposing of unused or expired medicines responsibly.",
    seoTitle: null,
    content:
      "<p>Leftover and expired medicines should not stay in the home, where they could be taken by mistake.</p><h2>General guidance</h2><p>Check whether your area has a medicine take-back programme or a pharmacy that accepts returns, and use it where available. Rules differ by country and region, so follow local guidance on disposal.</p><p>Remove personal information from labels before throwing packaging away, and never share prescription medicines with other people. If you are unsure how to dispose of a product, ask your pharmacist.</p>",
    imageUrl: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6",
  },
  {
    title: "Why Taking Medicines as Prescribed Matters",
    slug: "why-taking-medicines-as-prescribed-matters",
    seoDescription:
      "Why following the directions for a medicine is an important part of treatment.",
    seoTitle: null,
    content:
      "<p>A medicine is prescribed with a specific amount, timing and duration in mind. Following those directions helps the treatment work as intended.</p><h2>Helpful habits</h2><p>Take medicines at the same times each day and link them to a routine, such as meals. A weekly pill organiser or a phone reminder can help. Do not stop a medicine or change the amount on your own, even if you feel better, without speaking to your doctor.</p><p>If you have trouble following the directions, tell your doctor or pharmacist. They can often suggest practical solutions.</p>",
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843",
  },
  {
    title: "Travelling With Medicines: A Practical Checklist",
    slug: "travelling-with-medicines-checklist",
    seoDescription:
      "A practical checklist for carrying medicines safely when you travel.",
    seoTitle: null,
    content:
      "<p>A little preparation helps make sure your medicines arrive safely and on time.</p><h2>Before you go</h2><ul><li>Pack enough for the whole trip, plus a few extra days.</li><li>Keep medicines in their original, labelled packaging.</li><li>Carry them in your hand luggage rather than checked baggage.</li><li>Bring a copy of your prescription or a doctor's note.</li><li>Check storage needs, such as keeping items cool.</li><li>Check the rules of your destination, as some medicines are restricted.</li></ul><p>Keep a list of your medicines in case you need help while away.</p>",
    imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f",
  },
  {
    title: "The Role of Quality Control in Pharmaceutical Production",
    slug: "role-of-quality-control-in-pharmaceutical-production",
    seoDescription:
      "How quality control checks help ensure medicines meet their intended standards.",
    seoTitle: null,
    content:
      "<p>Quality control is the part of pharmaceutical production that checks whether materials and finished products meet their specifications.</p><h2>Where checks happen</h2><p>Raw materials are tested before use. During production, samples are checked at defined stages. Finished products are tested before release, and records are kept for each batch so any issue can be traced.</p><p>Quality control works alongside quality assurance, which looks at the whole system of procedures, training and documentation. Together they support consistent, reliable products.</p>",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69",
  },
] as const;
