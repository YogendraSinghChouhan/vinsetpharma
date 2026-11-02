const baseUrl = "http://localhost:3009";

const pages = [
  "/",
  "/about-us",
  "/why-us",
  "/contact-us",
  "/privacy-policy",
  "/terms-and-conditions",
  "/products/veltra-d-tablets",
  "/blog",
];

async function run() {
  console.log("Checking production endpoints...\n");
  let allPassed = true;

  for (const page of pages) {
    const url = `${baseUrl}${page}`;
    const res = await fetch(url);
    if (res.status !== 200) {
      console.error(`FAIL [${res.status}]: ${page}`);
      allPassed = false;
      continue;
    }

    const html = await res.text();

    // 1. Check exactly one <h1>
    const h1Matches = html.match(/<h1[\s>]/gi) || [];
    if (h1Matches.length !== 1) {
      console.error(`FAIL H1 count (${h1Matches.length}): ${page}`);
      allPassed = false;
    }

    // 2. Footer shows both legal links
    const hasPrivacyLink = html.includes('href="/privacy-policy"');
    const hasTermsLink = html.includes('href="/terms-and-conditions"');
    if (!hasPrivacyLink || !hasTermsLink) {
      console.error(
        `FAIL missing footer legal links: ${page} (Privacy: ${hasPrivacyLink}, Terms: ${hasTermsLink})`,
      );
      allPassed = false;
    }

    // 3. No uppercase PLACEHOLDER text
    if (html.includes("PLACEHOLDER")) {
      console.error(`FAIL contains visible PLACEHOLDER text: ${page}`);
      allPassed = false;
    }

    // 4. Verified tel and mailto hrefs are present
    const hasTelLink = html.includes('href="tel:+919829437525"');
    const hasMailLink = html.includes('href="mailto:Vinsetpharma@gmail.com"');
    if (!hasTelLink || !hasMailLink) {
      console.error(
        `FAIL missing verified contact links: ${page} (tel: ${hasTelLink}, mailto: ${hasMailLink})`,
      );
      allPassed = false;
    }

    console.log(
      `PASS [200, 1 H1, footer links OK, no placeholder, contact links OK]: ${page}`,
    );
  }

  // Check Organization JSON-LD on /
  const homeRes = await fetch(`${baseUrl}/`);
  const homeHtml = await homeRes.text();
  const jsonLdMatch = homeHtml.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  if (jsonLdMatch) {
    const parsed = JSON.parse(jsonLdMatch[1]);
    const jsonLd = Array.isArray(parsed)
      ? parsed.find((item) => item["@type"] === "Organization")
      : parsed;
    if (
      !jsonLd ||
      jsonLd.telephone !== "+919829437525" ||
      jsonLd.email !== "Vinsetpharma@gmail.com" ||
      !jsonLd.logo ||
      !Array.isArray(jsonLd.address) ||
      jsonLd.address.length !== 2 ||
      jsonLd.address[0].addressCountry !== "IN"
    ) {
      console.error(
        "FAIL Organization JSON-LD missing or invalid verified fields:",
        jsonLd,
      );
      allPassed = false;
    } else {
      console.log(
        "PASS Organization JSON-LD contains verified telephone, email, logo, and 2 PostalAddresses.",
      );
    }
  }

  // Check favicon and logo static assets
  const assetChecks = [
    { path: "/logo.png", status: 200, contentType: "image/png" },
    { path: "/favicon.ico", status: 200, contentType: "image/x-icon" },
    {
      path: "/favicon/site.webmanifest",
      status: 200,
      contentType: "application/manifest+json",
    },
    {
      path: "/favicon/favicon-96x96.png",
      status: 200,
      contentType: "image/png",
    },
    {
      path: "/favicon/apple-touch-icon.png",
      status: 200,
      contentType: "image/png",
    },
    { path: "/favicon/favicon.svg", status: 200, contentType: "image/svg+xml" },
  ];

  for (const asset of assetChecks) {
    const res = await fetch(`${baseUrl}${asset.path}`);
    if (res.status !== asset.status) {
      console.error(
        `FAIL Asset ${asset.path} returned status ${res.status} (expected ${asset.status})`,
      );
      allPassed = false;
    } else {
      console.log(`PASS Asset ${asset.path} returned 200 OK.`);
    }
  }

  // Check Terms page governing-law section
  const termsRes = await fetch(`${baseUrl}/terms-and-conditions`);
  const termsHtml = await termsRes.text();
  if (
    termsHtml.includes("governing-law") ||
    /Governing Law and Jurisdiction/i.test(termsHtml)
  ) {
    console.error(
      "FAIL Terms page unexpectedly contains governing-law section while unset!",
    );
    allPassed = false;
  } else {
    console.log("PASS Terms page has no empty governing-law section.");
  }

  // Check Sitemap
  const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
  const sitemapXml = await sitemapRes.text();
  const hasSitemapPrivacy = sitemapXml.includes("/privacy-policy");
  const hasSitemapTerms = sitemapXml.includes("/terms-and-conditions");
  if (!hasSitemapPrivacy || !hasSitemapTerms) {
    console.error("FAIL Sitemap missing legal pages:", {
      hasSitemapPrivacy,
      hasSitemapTerms,
    });
    allPassed = false;
  } else {
    console.log(
      "PASS Sitemap lists both /privacy-policy and /terms-and-conditions.",
    );
  }

  // Check forbidden words on /about-us and /why-us
  const forbiddenList = [
    "certified",
    "gmp",
    "who",
    "iso",
    "manufacturer",
    "factory",
    "plant",
    "laboratory",
    "leading",
    "best",
    "trusted",
    "years",
  ];

  for (const page of ["/about-us", "/why-us"]) {
    const res = await fetch(`${baseUrl}${page}`);
    const html = await res.text();
    // Strip scripts, styles, and HTML tags to evaluate visible text and content
    const cleanText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ");

    let pageHasForbidden = false;
    for (const word of forbiddenList) {
      const isAcronym = ["gmp", "who", "iso"].includes(word);
      const regex = isAcronym
        ? new RegExp(`\\b${word.toUpperCase()}\\b`)
        : new RegExp(`\\b${word}\\b`, "i");

      if (regex.test(cleanText)) {
        console.error(
          `FAIL Forbidden word "${word}" detected in rendered text of ${page}!`,
        );
        allPassed = false;
        pageHasForbidden = true;
      }
    }
    if (!pageHasForbidden) {
      console.log(`PASS No forbidden words found on ${page}.`);
    }
  }

  if (!allPassed) {
    process.exit(1);
  }
  console.log("\nAll runtime page verification checks passed successfully!");
}

run();
