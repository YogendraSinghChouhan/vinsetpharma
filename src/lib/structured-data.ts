import { env } from "@/config/env";
import {
  CONTACT,
  LOGO_ASSET,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/config/site";

export type Thing = {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
};

export type PostalAddressSchema = {
  "@type": "PostalAddress";
  streetAddress: string;
  addressCountry?: string;
};

export type OrganizationSchema = Thing & {
  "@type": "Organization";
  name: string;
  url: string;
  description: string;
  logo?: string;
  telephone?: string;
  email?: string;
  address?: PostalAddressSchema[];
};

export type WebSiteSchema = Thing & {
  "@type": "WebSite";
  name: string;
  url: string;
};

export type ProductSchema = Thing & {
  "@type": "Product";
  name: string;
  description: string;
  url: string;
  image?: string;
  brand: {
    "@type": "Organization";
    name: string;
    url: string;
  };
};

export type BlogPostingSchema = Thing & {
  "@type": "BlogPosting";
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  url: string;
  image?: string;
  author: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
};

export type BreadcrumbListSchema = Thing & {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
};

function getBaseUrl(): string {
  return env.APP_URL.replace(/\/+$/, "");
}

/**
 * Builds the Schema.org Organization structured data object.
 * Emits telephone, email, logo, and address array with verified contact details.
 */
export function buildOrganization(): OrganizationSchema {
  const baseUrl = getBaseUrl();
  const phone = CONTACT.phones[0]?.e164;
  const email = CONTACT.email?.value;
  const logo = LOGO_ASSET
    ? `${baseUrl}${LOGO_ASSET.startsWith("/") ? "" : "/"}${LOGO_ASSET}`
    : undefined;

  const org: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: baseUrl,
    description: SITE_DESCRIPTION,
  };

  if (logo) {
    org.logo = logo;
  }
  if (phone) {
    org.telephone = phone;
  }
  if (email) {
    org.email = email;
  }
  if (CONTACT.addresses.length > 0) {
    org.address = CONTACT.addresses.map((addr) => ({
      "@type": "PostalAddress",
      streetAddress: addr.text,
      addressCountry: "IN",
    }));
  }

  return org;
}

/**
 * Builds the Schema.org WebSite structured data object.
 */
export function buildWebSite(): WebSiteSchema {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: baseUrl,
  };
}

/**
 * Builds the Schema.org Product structured data object.
 * Intentionally does NOT include offers, price, availability, or reviews as Vinsent Pharma is not a retail store.
 */
export function buildProduct({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
}): ProductSchema {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    ...(image ? { image } : {}),
    brand: {
      "@type": "Organization",
      name: SITE_NAME,
      url: baseUrl,
    },
  };
}

/**
 * Builds the Schema.org BlogPosting structured data object.
 */
export function buildBlogPosting({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}): BlogPostingSchema {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    url,
    ...(image ? { image } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

/**
 * Builds the Schema.org BreadcrumbList structured data object.
 */
export function buildBreadcrumbList(
  items: Array<{ name: string; url: string }>,
): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
