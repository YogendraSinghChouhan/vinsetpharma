export const SITE_NAME = "Vinsent Pharma";

export const SITE_TAGLINE = "Careful science for pharmaceutical care.";

export const SITE_DESCRIPTION =
  "Vinsent Pharma develops, prepares and supplies pharmaceutical products for healthcare providers and the people they serve.";

/**
 * Shared brand color hex values derived directly from globals.css design tokens.
 * Single source of truth for brand colors across CSS tokens, SVG artwork, and OpenGraph.
 */
export const BRAND_COLORS = {
  primary: "#00485a",
  primaryDark: "#06232b",
  accent: "#0b7c6e",
  accentLight: "#33c2a9",
  surfaceTint: "#ecf3f4",
  background: "#f6f9fa",
  foreground: "#132328",
  foregroundOnDark: "#f6f9fa",
  mutedOnDark: "#b8c8cc",
} as const;

export const COPYRIGHT_YEAR = new Date().getFullYear();

export const ROUTES = {
  home: "/",
  aboutUs: "/about-us",
  whyUs: "/why-us",
  contactUs: "/contact-us",
  products: "/products",
  productDetail: (slug: string) => `/products/${slug}`,
  blog: "/blog",
  blogDetail: (slug: string) => `/blog/${slug}`,
  admin: "/admin",
  adminLogin: "/admin/login",
  adminProducts: "/admin/products",
  adminProductNew: "/admin/products/new",
  adminProductEdit: (id: string) => `/admin/products/${id}/edit`,
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
  { label: "About Us", href: ROUTES.aboutUs },
  { label: "Why Us", href: ROUTES.whyUs },
  { label: "Contact Us", href: ROUTES.contactUs },
  { label: "Our Products", href: ROUTES.products },
  { label: "Blog", href: ROUTES.blog },
] as const;

export const FOOTER_NAV = [
  { label: "About Us", href: ROUTES.aboutUs },
  { label: "Why Us", href: ROUTES.whyUs },
  { label: "Contact Us", href: ROUTES.contactUs },
  { label: "Our Products", href: ROUTES.products },
  { label: "Blog", href: ROUTES.blog },
] as const;

export type ContactChannel = {
  label: string;
  value: string;
  href: string | null;
};

export type ContactAddress = ContactChannel & {
  mapsLabel: string;
};

export type Contact = {
  address: ContactAddress;
  phones: ContactChannel[];
  email: ContactChannel;
  workingHours: {
    label: string;
    value: string;
  };
};

export const CONTACT: Contact = {
  address: {
    label: "Address",
    value: "PLACEHOLDER: Add the company address here.",
    href: null,
    mapsLabel: "View on map",
  },
  phones: [
    {
      label: "Phone",
      value: "PLACEHOLDER: Add the phone number here.",
      href: null,
    },
  ],
  email: {
    label: "Email",
    value: "PLACEHOLDER: Add the business email here.",
    href: null,
  },
  workingHours: {
    label: "Working Hours",
    value: "PLACEHOLDER: Add the company working hours here.",
  },
};
