export const SITE_NAME = "Vinsent Pharma";

export const SITE_TAGLINE = "Careful science for pharmaceutical care.";

export const SITE_DESCRIPTION =
  "Vinsent Pharma develops, prepares and supplies pharmaceutical products for healthcare providers and the people they serve.";

/**
 * Shared brand color hex values derived directly from globals.css design tokens.
 * Single source of truth for brand colors across CSS tokens, SVG artwork, and OpenGraph.
 */
export const BRAND_COLORS = {
  primary: "#004ab8",
  primaryDark: "#06152d",
  accent: "#0056cc",
  accentLight: "#38bdf8",
  surfaceTint: "#f0f4f9",
  background: "#f7f9fc",
  foreground: "#111827",
  foregroundOnDark: "#f7f9fc",
  mutedOnDark: "#94a3b8",
} as const;

export const COPYRIGHT_YEAR = new Date().getFullYear();

export const ROUTES = {
  home: "/",
  aboutUs: "/about-us",
  whyUs: "/why-us",
  contactUs: "/contact-us",
  privacyPolicy: "/privacy-policy",
  termsAndConditions: "/terms-and-conditions",
  products: "/products",
  productDetail: (slug: string) => `/products/${slug}`,
  blog: "/blog",
  blogDetail: (slug: string) => `/blog/${slug}`,
  admin: "/admin",
  adminLogin: "/admin/login",
  adminProducts: "/admin/products",
  adminProductNew: "/admin/products/new",
  adminProductEdit: (id: string) => `/admin/products/${id}/edit`,
  adminCategories: "/admin/categories",
  adminCategoryNew: "/admin/categories/new",
  adminCategoryEdit: (id: string) => `/admin/categories/${id}/edit`,
  categoryDetail: (slug: string) => `/products/category/${slug}`,
  adminQuotes: "/admin/quotes",
  adminQuoteDetail: (id: string) => `/admin/quotes/${id}`,
  adminBlogs: "/admin/blogs",
  adminBlogNew: "/admin/blogs/new",
  adminBlogEdit: (id: string) => `/admin/blogs/${id}/edit`,
} as const;

export const SOCIAL_LINKS: readonly {
  label: string;
  href: string;
}[] = [];

export const MAIN_NAV = [
  { label: "Home", href: ROUTES.home },
  { label: "Our Products", href: ROUTES.products },
  { label: "Blog", href: ROUTES.blog },
  { label: "Why Us", href: ROUTES.whyUs },
  { label: "About Us", href: ROUTES.aboutUs },
  { label: "Contact Us", href: ROUTES.contactUs },
] as const;

export const FOOTER_NAV = [
  { label: "About Us", href: ROUTES.aboutUs },
  { label: "Why Us", href: ROUTES.whyUs },
  { label: "Contact Us", href: ROUTES.contactUs },
  { label: "Our Products", href: ROUTES.products },
  { label: "Blog", href: ROUTES.blog },
] as const;

export const LEGAL_NAV = [
  { label: "Privacy Policy", href: ROUTES.privacyPolicy },
  { label: "Terms & Conditions", href: ROUTES.termsAndConditions },
] as const;

/**
 * Display text when a contact detail is unset.
 * Single source of truth for unset fallbacks.
 */
export const CONTACT_FALLBACKS = {
  address: "Address coming soon",
  phone: "Phone number coming soon",
  email: "Email coming soon",
  workingHours: "Working hours coming soon",
} as const;

/**
 * Small helper to build tel: href from E.164 phone string.
 */
export function buildTelHref(e164: string): string {
  return `tel:${e164}`;
}

/**
 * Small helper to build Google Maps query URL from address string.
 */
export function buildMapsUrl(addressText: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${addressText}, India`)}`;
}

export type PhoneContact = {
  e164: string;
  display: string;
  href: string;
};

export type AddressContact = {
  id: string;
  label: string;
  text: string;
  mapsUrl: string;
};

export type EmailContact = {
  value: string;
  href: string;
};

export type WorkingHoursContact = {
  label: string;
  value: string;
};

export type Contact = {
  email: EmailContact | null;
  phones: PhoneContact[];
  addresses: AddressContact[];
  workingHours: WorkingHoursContact | null;
};

/**
 * Contact configuration with verified client facts.
 * Working hours stay unset (shows short coming soon text).
 */
export const CONTACT: Contact = {
  email: {
    value: "Vinsetpharma@gmail.com",
    href: "mailto:Vinsetpharma@gmail.com",
  },
  phones: [
    {
      e164: "+919829437525",
      display: "+91 98294 37525",
      href: buildTelHref("+919829437525"),
    },
  ],
  addresses: [
    {
      id: "mumbai",
      label: "Mumbai",
      text: "Shop No. 5, Raam Bhawan, Station Road, Bhayander (W), Mumbai 401101",
      mapsUrl: buildMapsUrl(
        "Shop No. 5, Raam Bhawan, Station Road, Bhayander (W), Mumbai 401101",
      ),
    },
    {
      id: "jaipur",
      label: "Jaipur",
      text: "1, Bohra Ji Ka Bagh, Laxmi Mandir Tiraha, Tonk Road, Jaipur",
      mapsUrl: buildMapsUrl(
        "1, Bohra Ji Ka Bagh, Laxmi Mandir Tiraha, Tonk Road, Jaipur",
      ),
    },
  ],
  workingHours: null,
};

export type LegalConfig = {
  jurisdiction: string | null;
};

export const LEGAL: LegalConfig = {
  jurisdiction: null,
};

/**
 * Dedicated logo asset path if modeled, or null when using inline brand mark.
 */
export const LOGO_ASSET: string | null = "/logo.png";
