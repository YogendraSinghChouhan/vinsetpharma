import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3142;
const CDP_PORT = 9228;
const ARTIFACT_DIR =
  "C:/Users/Yogendra Singh/.gemini/antigravity-cli/brain/de9882a6-d4a0-424c-aebf-95c57be7d4c1";
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, "screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

class SimpleCDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.pending = new Map();
    this.consoleLogs = [];
    this.consoleErrors = [];
    this.networkRequests = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        if (msg.method === "Runtime.consoleAPICalled") {
          this.consoleLogs.push(msg.params);
          if (msg.params.type === "error") {
            this.consoleErrors.push(msg.params);
          }
        } else if (msg.method === "Network.requestWillBeSent") {
          this.networkRequests.push(msg.params.request.url);
        }
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async screenshot(filename) {
    const res = await this.send("Page.captureScreenshot", { format: "png" });
    const buffer = Buffer.from(res.data, "base64");
    const filePath = path.join(SCREENSHOT_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("Checking Next.js server on port", PORT);
  const homeRes = await fetch(`http://localhost:${PORT}/`);
  const aboutRes = await fetch(`http://localhost:${PORT}/about-us`);

  console.log("Home status:", homeRes.status, "About status:", aboutRes.status);
  if (homeRes.status !== 200 || aboutRes.status !== 200) {
    throw new Error("Next.js server not returning 200 for Home or About");
  }

  console.log("Launching headless Chrome on port", CDP_PORT);
  const chromePath =
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const chromeProc = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${CDP_PORT}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--window-size=1280,800",
  ]);

  await sleep(1500);

  let targets;
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      targets = await res.json();
      if (targets && targets.length > 0) break;
    } catch {}
    await sleep(400);
  }

  const pageTarget = targets.find((t) => t.type === "page") || targets[0];
  const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");

  const results = {
    home: { h1Count: 0, viewports: {} },
    about: { h1Count: 0, viewports: {} },
    cardWidths: {},
    autoplayTest: {},
    hoverPauseTest: {},
    pauseButtonTest: {},
    reducedMotionTest: {},
    videoRequests: [],
    consoleErrors: [],
  };

  const viewports = [360, 412, 768, 1280, 1920];

  // --- 1. VERIFY HOME PAGE AT VARIOUS VIEWPORTS ---
  for (const width of viewports) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });

    await cdp.send("Page.navigate", { url: `http://localhost:${PORT}/` });
    await sleep(1800);

    const metrics = await cdp.evaluate(`
      (() => {
        const root = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(root.scrollWidth, body.scrollWidth);
        const windowWidth = window.innerWidth;
        const h1Elements = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());

        const categorySlide = document.querySelector('#product-categories [role="slide"], #product-categories [role="group"]');
        const categoryCard = document.querySelector('#product-categories [role="group"] a');
        const categoryCardWidth = categoryCard ? categoryCard.getBoundingClientRect().width : null;
        const categorySlideWidth = categorySlide ? categorySlide.getBoundingClientRect().width : null;

        // Find a product card on the page (e.g. from featured products)
        const productCard = document.querySelector('#featured-products a');
        const productCardWidth = productCard ? productCard.getBoundingClientRect().width : null;

        return {
          windowWidth,
          scrollWidth,
          overflow: scrollWidth > windowWidth,
          h1Count: h1Elements.length,
          h1Text: h1Elements,
          categoryCardWidth: categoryCardWidth ? Math.round(categoryCardWidth * 10) / 10 : null,
          categorySlideWidth: categorySlideWidth ? Math.round(categorySlideWidth * 10) / 10 : null,
          productCardWidth: productCardWidth ? Math.round(productCardWidth * 10) / 10 : null,
        };
      })()
    `);

    results.home.viewports[width] = metrics;
    results.home.h1Count = metrics.h1Count;
    results.cardWidths[width] = {
      categoryCard: metrics.categoryCardWidth,
      categorySlide: metrics.categorySlideWidth,
      productCard: metrics.productCardWidth,
    };

    if (width === 360 || width === 768 || width === 1280) {
      await cdp.screenshot(`home-${width}px.png`);
    }
  }

  // --- 2. VERIFY ABOUT PAGE AT VARIOUS VIEWPORTS ---
  for (const width of viewports) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });

    await cdp.send("Page.navigate", {
      url: `http://localhost:${PORT}/about-us`,
    });
    await sleep(1800);

    const metrics = await cdp.evaluate(`
      (() => {
        const root = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(root.scrollWidth, body.scrollWidth);
        const windowWidth = window.innerWidth;
        const h1Elements = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());
        const hasMediaGallery = Boolean(document.querySelector('#media-gallery'));

        return {
          windowWidth,
          scrollWidth,
          overflow: scrollWidth > windowWidth,
          h1Count: h1Elements.length,
          h1Text: h1Elements,
          hasMediaGallery,
        };
      })()
    `);

    results.about.viewports[width] = metrics;
    results.about.h1Count = metrics.h1Count;

    if (width === 1280) {
      await cdp.screenshot(`about-${width}px.png`);
    }
  }

  // --- 3. AUTOPLAY & INTERACTION TEST (ON HOME PAGE AT 1280px) ---
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send("Page.navigate", { url: `http://localhost:${PORT}/` });
  await sleep(1500);

  // Scroll carousel into view so IntersectionObserver sees it as intersecting
  await cdp.evaluate(`
    (() => {
      const section = document.querySelector('#product-categories');
      if (section) section.scrollIntoView({ behavior: 'instant' });
    })()
  `);
  await sleep(600);

  // Measure initial scrollLeft of category carousel
  const initialScroll = await cdp.evaluate(`
    (() => {
      const container = document.querySelector('#product-categories [role="region"] > div:last-child');
      return container ? container.scrollLeft : null;
    })()
  `);

  console.log(
    "Carousel in view. Initial scrollLeft:",
    initialScroll,
    ". Waiting 5.2s for autoplay to advance one slide...",
  );
  await sleep(5200);

  const afterAutoplayScroll = await cdp.evaluate(`
    (() => {
      const container = document.querySelector('#product-categories [role="region"] > div:last-child');
      return container ? container.scrollLeft : null;
    })()
  `);

  results.autoplayTest = {
    initialScroll,
    afterAutoplayScroll,
    advanced:
      afterAutoplayScroll !== null &&
      initialScroll !== null &&
      afterAutoplayScroll > initialScroll,
  };

  // --- 4. TEST HOVER PAUSE USING REAL CDP MOUSE EVENT ---
  const rect = await cdp.evaluate(`
    (() => {
      const region = document.querySelector('#product-categories [role="region"]');
      if (!region) return null;
      const r = region.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    })()
  `);

  if (rect) {
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: Math.round(rect.x),
      y: Math.round(rect.y),
    });
  }

  await sleep(400);

  const scrollBeforeHoverWait = await cdp.evaluate(`
    (() => {
      const container = document.querySelector('#product-categories [role="region"] > div:last-child');
      return container ? container.scrollLeft : null;
    })()
  `);
  console.log(
    "Hovered via CDP mouseMoved. Waiting 5s to confirm carousel pauses on hover...",
  );
  await sleep(5000);
  const scrollAfterHoverWait = await cdp.evaluate(`
    (() => {
      const container = document.querySelector('#product-categories [role="region"] > div:last-child');
      return container ? container.scrollLeft : null;
    })()
  `);
  results.hoverPauseTest = {
    scrollBeforeHoverWait,
    scrollAfterHoverWait,
    paused: scrollBeforeHoverWait === scrollAfterHoverWait,
  };

  // Move mouse away to unhover
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: 0,
    y: 0,
  });
  await sleep(400);

  // --- 5. TEST PAUSE BUTTON TOGGLE ---
  const pauseClicked = await cdp.evaluate(`
    (() => {
      const pauseBtn = document.querySelector('#product-categories button[aria-label="Pause autoplay"]');
      if (pauseBtn) {
        pauseBtn.click();
        return { clicked: true, ariaPressed: pauseBtn.getAttribute('aria-pressed') };
      }
      return { clicked: false };
    })()
  `);
  const scrollBeforeButtonWait = await cdp.evaluate(`
    (() => {
      const container = document.querySelector('#product-categories [role="region"] > div:last-child');
      return container ? container.scrollLeft : null;
    })()
  `);
  console.log(
    "Pause button clicked. Waiting 5s to confirm carousel stays paused...",
  );
  await sleep(5000);
  const scrollAfterButtonWait = await cdp.evaluate(`
    (() => {
      const container = document.querySelector('#product-categories [role="region"] > div:last-child');
      return container ? container.scrollLeft : null;
    })()
  `);
  results.pauseButtonTest = {
    pauseClicked,
    scrollBeforeButtonWait,
    scrollAfterButtonWait,
    paused: scrollBeforeButtonWait === scrollAfterButtonWait,
  };

  // --- 6. TEST REDUCED MOTION ---
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await cdp.send("Page.navigate", { url: `http://localhost:${PORT}/` });
  await sleep(1500);

  const reducedMotionStatus = await cdp.evaluate(`
    (() => {
      const pauseBtn = document.querySelector('#product-categories button[aria-label="Start autoplay"], #product-categories button[aria-label="Pause autoplay"]');
      return {
        hasButton: Boolean(pauseBtn),
        ariaLabel: pauseBtn ? pauseBtn.getAttribute('aria-label') : null,
        ariaPressed: pauseBtn ? pauseBtn.getAttribute('aria-pressed') : null,
      };
    })()
  `);
  results.reducedMotionTest = reducedMotionStatus;

  // --- 7. CHECK VIDEO REQUESTS ---
  const videoUrls = cdp.networkRequests.filter(
    (url) => url.endsWith(".mp4") || url.endsWith(".webm"),
  );
  results.videoRequests = videoUrls;
  results.consoleErrors = cdp.consoleErrors;

  // Save results
  fs.writeFileSync(
    path.join(ARTIFACT_DIR, "carousel-verification-results.json"),
    JSON.stringify(results, null, 2),
  );
  console.log(
    "VERIFICATION COMPLETE:",
    JSON.stringify(
      {
        homeH1: results.home.h1Count,
        aboutH1: results.about.h1Count,
        cardWidths: results.cardWidths,
        autoplayAdvanced: results.autoplayTest.advanced,
        hoverPaused: results.hoverPauseTest.paused,
        buttonPaused: results.pauseButtonTest.paused,
        reducedMotionInitialState: results.reducedMotionTest,
        videoRequestsCount: results.videoRequests.length,
        consoleErrorsCount: results.consoleErrors.length,
      },
      null,
      2,
    ),
  );

  cdp.close();
  chromeProc.kill();
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
