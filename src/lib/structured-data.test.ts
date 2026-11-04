import { describe, expect, it } from "bun:test";
import { buildMapsUrl, buildTelHref, SITE_NAME } from "@/config/site";
import {
  buildBlogPosting,
  buildBreadcrumbList,
  buildOrganization,
  buildProduct,
  buildWebSite,
} from "./structured-data";

describe("structured-data builders", () => {
  it("buildOrganization emits verified organization schema with contact and logo", () => {
    const org = buildOrganization();
    expect(org["@context"]).toBe("https://schema.org");
    expect(org["@type"]).toBe("Organization");
    expect(org.name).toBe(SITE_NAME);
    expect(org.url).toBeDefined();
    expect(org.description).toBeDefined();

    // Verified contact details
    expect(org.telephone).toBe("+919829437525");
    expect(org.email).toBe("Vinsetpharma@gmail.com");
    expect(org.logo).toContain("/logo.png");
    expect(org.address).toBeDefined();
    expect(Array.isArray(org.address)).toBe(true);
    expect(org.address).toHaveLength(1);
    expect(org.address?.[0]?.streetAddress).toBe(
      "Shop No. 5, Raam Bhawan, Station Road, Bhayander (W), Mumbai 401101",
    );
    expect(org.address?.[0]?.addressCountry).toBe("IN");
    // Chief executive officer
    expect(org.employee).toEqual({
      "@type": "Person",
      name: "Dr. Vishnu Saini",
      jobTitle: "Chief Executive Officer",
    });
  });

  it("buildWebSite generates valid WebSite schema", () => {
    const website = buildWebSite();
    expect(website["@context"]).toBe("https://schema.org");
    expect(website["@type"]).toBe("WebSite");
    expect(website.name).toBe(SITE_NAME);
    expect(website.url).toBeDefined();
  });

  it("buildProduct generates valid Product schema without offers, price, availability, or reviews", () => {
    const product = buildProduct({
      name: "Amoxicillin 500mg",
      description: "Antibiotic formulation for bacterial infections.",
      url: "https://vinsetpharma.com/products/amoxicillin-500mg",
      image: "https://vinsetpharma.com/images/amox.jpg",
    });

    expect(product["@context"]).toBe("https://schema.org");
    expect(product["@type"]).toBe("Product");
    expect(product.name).toBe("Amoxicillin 500mg");
    expect(product.brand["@type"]).toBe("Organization");
    expect(product.brand.name).toBe(SITE_NAME);

    // Strictly ensure no eCommerce or rating fields are emitted
    expect(product.offers).toBeUndefined();
    expect(product.price).toBeUndefined();
    expect(product.availability).toBeUndefined();
    expect(product.aggregateRating).toBeUndefined();
    expect(product.reviews).toBeUndefined();
  });

  it("buildBlogPosting generates valid BlogPosting schema with author, publisher, and dates", () => {
    const post = buildBlogPosting({
      headline: "Quality Control in Modern Pharma",
      description: "A summary of regulatory standards and testing protocols.",
      url: "https://vinsetpharma.com/blog/quality-control-in-modern-pharma",
      datePublished: "2026-11-01T12:00:00.000Z",
      dateModified: "2026-11-01T14:30:00.000Z",
    });

    expect(post["@context"]).toBe("https://schema.org");
    expect(post["@type"]).toBe("BlogPosting");
    expect(post.headline).toBe("Quality Control in Modern Pharma");
    expect(post.datePublished).toBe("2026-11-01T12:00:00.000Z");
    expect(post.dateModified).toBe("2026-11-01T14:30:00.000Z");
    expect(post.author.name).toBe(SITE_NAME);
    expect(post.publisher.name).toBe(SITE_NAME);
    expect(post.mainEntityOfPage["@id"]).toBe(
      "https://vinsetpharma.com/blog/quality-control-in-modern-pharma",
    );
  });

  it("buildBreadcrumbList formats position with 1-based indexing", () => {
    const breadcrumbs = buildBreadcrumbList([
      { name: "Home", url: "https://vinsetpharma.com/" },
      { name: "Our Products", url: "https://vinsetpharma.com/products" },
      {
        name: "Amoxicillin",
        url: "https://vinsetpharma.com/products/amoxicillin",
      },
    ]);

    expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
    expect(breadcrumbs.itemListElement).toHaveLength(3);
    expect(breadcrumbs.itemListElement[0].position).toBe(1);
    expect(breadcrumbs.itemListElement[1].position).toBe(2);
    expect(breadcrumbs.itemListElement[2].position).toBe(3);
  });
});

describe("contact helpers", () => {
  it("buildTelHref produces valid tel: URL from E.164 phone string", () => {
    expect(buildTelHref("+919829437525")).toBe("tel:+919829437525");
  });

  it("buildMapsUrl generates encoded Google Maps search URL with India suffix", () => {
    const address =
      "Shop No. 5, Raam Bhawan, Station Road, Bhayander (W), Mumbai 401101";
    const expected = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${address}, India`,
    )}`;
    expect(buildMapsUrl(address)).toBe(expected);
  });
});

describe("JSON-LD serialization safety", () => {
  it("escapes '<' as \\u003c to prevent script tag injection and breakout", () => {
    const payloadWithXss = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Dangerous </script><script>alert('xss')</script>",
      description: "Safe description <test>",
    };

    const serialized = JSON.stringify(payloadWithXss).replace(/</g, "\\u003c");

    expect(serialized).not.toContain("<");
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c/script>");
    expect(serialized).toContain("\\u003cscript>");
    expect(serialized).toContain("\\u003ctest>");

    // Confirm that the serialized string still parses back to valid JSON
    const parsed = JSON.parse(serialized);
    expect(parsed.name).toBe(
      "Dangerous </script><script>alert('xss')</script>",
    );
    expect(parsed.description).toBe("Safe description <test>");
  });
});
