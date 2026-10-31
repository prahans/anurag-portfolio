import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { test, expect, type Locator, type Page } from "@playwright/test";

const resumeURL = "/Anurag_Panuhar_Full_Stack_Developer_Resume.pdf";
const resumeDownloadName = "Anurag_Panuhar_Resume.pdf";

async function expectResumeDownload(page: Page, link: Locator) {
  await expect(link).toHaveAttribute("href", resumeURL);
  await expect(link).toHaveAttribute("download", resumeDownloadName);
  await expect(link).not.toHaveAttribute("target", "_blank");
  await expect(link.locator("svg")).toHaveAttribute("aria-hidden", "true");
  const originalURL = page.url();
  const downloadEvent = page.waitForEvent("download");
  await link.click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe(resumeDownloadName);
  expect(await download.failure()).toBeNull();
  const savedPath = await download.path();
  expect(savedPath).not.toBeNull();
  const original = await readFile(resolve("public", resumeURL.slice(1)));
  expect((await readFile(savedPath!)).equals(original)).toBe(true);
  await expect(page).toHaveURL(originalURL);
}

for (const width of [360, 390, 768, 1024, 1280, 1440]) {
  test(`portfolio layout and assets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("I build digital experiences that make life a little better.");
    await expect(page.locator(".project-card")).toHaveCount(8);
    await expect(page.locator(".project-links a")).toHaveCount(16);
    await expect(page.locator(".skill-item")).toHaveCount(12);
    for (const id of ["work", "about", "skills", "contact"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    // Visit every screenshot so the longer mobile project list loads its lazy images.
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
    }
    await expect.poll(() => page.evaluate(() => Array.from(document.images)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src)), {
      message: "All portfolio images should finish loading without errors",
      timeout: 15_000,
    }).toEqual([]);
    const layout = await page.evaluate(() => ({
      viewport: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      brokenImages: Array.from(document.images).filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
      emptyLinks: Array.from(document.links).filter((link) => !link.getAttribute("href") || link.getAttribute("href") === "#").length,
      fonts: document.fonts.status,
      loadedFonts: Array.from(document.fonts).filter((font) => font.status === "loaded").map((font) => font.family),
    }));
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewport);
    expect(layout.brokenImages).toEqual([]);
    expect(layout.emptyLinks).toBe(0);
    expect(layout.fonts).toBe("loaded");
    for (const family of ["DM Sans", "Fraunces", "Instrument Serif", "Caveat", "IBM Plex Mono"]) {
      expect(layout.loadedFonts).toContain(family);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(page.locator(".hero-art-reveal")).toHaveCSS("opacity", "1");
    await expect(page.locator(".project-grid > div").last()).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `artifacts/portfolio-${width}.png`, fullPage: true, animations: "disabled" });
    expect(errors).toEqual([]);
  });
}

test("mobile navigation opens, supports keyboard dismissal, and follows anchors", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation" });
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page.getByRole("navigation").getByRole("link", { name: "02. Work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#work")).toBeInViewport();
  await page.getByRole("link", { name: "Back to top" }).click();
  await expect(page).toHaveURL(/#home$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
});

test("desktop calls to action and active section follow their destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("link", { name: "Explore My Work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
  await page.getByRole("navigation").getByRole("link", { name: "03. About" }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole("navigation").getByRole("link", { name: "03. About" })).toHaveAttribute("aria-current", "location");
  await page.getByRole("navigation").getByRole("link", { name: "04. Skills" }).click();
  await expect(page).toHaveURL(/#skills$/);
  await expect(page.getByRole("navigation").getByRole("link", { name: "04. Skills" })).toHaveAttribute("aria-current", "location");
  const hello = page.getByRole("link", { name: "Say Hello", exact: true });
  await expect(hello).toHaveAttribute("href", "#contact");
  await expect(hello.locator("svg.header-heart")).toBeVisible();
  await hello.click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
  await expect(page.getByRole("navigation").getByRole("link", { name: "05. Contact" })).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".contact-button--email")).toHaveAttribute("href", "mailto:prahanspanuhar4@gmail.com");
  await expect(page.locator(".contact-social-link").first()).toHaveAttribute("href", "https://github.com/prahans");
});

test("the configured résumé URL serves the original PDF", async ({ request }) => {
  const response = await request.get(resumeURL);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^application\/pdf\b/);
  const body = await response.body();
  expect(body.subarray(0, 5).toString()).toBe("%PDF-");
  expect(body.subarray(-1024).toString()).toContain("%%EOF");
  expect(body.equals(await readFile(resolve("public", resumeURL.slice(1))))).toBe(true);
});

for (const width of [360, 390, 768, 1024, 1280, 1440]) {
  test(`résumé downloads from the responsive navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const header = page.locator(".site-header");
    const navigation = page.getByRole("navigation", { name: "Primary navigation" });
    const desktopResume = header.locator(".header-actions a[download]");
    const mobileResume = navigation.locator("a[download]");
    const contactResume = page.locator("#contact a[download]");
    const menu = page.locator(".menu-toggle");
    const talk = header.getByRole("link", { name: "Say Hello", exact: true });
    await expect(talk).toHaveAttribute("href", "#contact");
    await expect(talk.locator("svg.header-heart")).toHaveAttribute("aria-hidden", "true");

    for (const link of [desktopResume, mobileResume, contactResume]) {
      await expect(link).toHaveAttribute("href", resumeURL);
      await expect(link).toHaveAttribute("download", resumeDownloadName);
      await expect(link).toHaveAccessibleName("Download my résumé (PDF)");
    }

    const headerBoxes = await header.evaluate((element, desktop) => {
      const selectors = [".brand", ".header-actions", ".menu-toggle", ...(desktop ? [".primary-navigation"] : [])];
      return selectors.flatMap((selector) => {
        const node = element.querySelector(selector);
        if (!node) return [];
        const bounds = node.getBoundingClientRect();
        return bounds.width && bounds.height ? [{ left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom }] : [];
      }).sort((a, b) => a.left - b.left);
    }, width >= 1000);
    for (const [index, bounds] of headerBoxes.entries()) {
      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(width);
      if (index) expect(bounds.left).toBeGreaterThanOrEqual(headerBoxes[index - 1].right);
    }

    if (width < 1000) {
      await expect(desktopResume).toBeHidden();
      await expect(navigation).toBeHidden();
      await menu.click();
      await expect(mobileResume).toBeVisible();
      const bounds = (await mobileResume.boundingBox())!;
      expect(bounds.height).toBeGreaterThanOrEqual(44);
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      await expectResumeDownload(page, mobileResume);
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await expect(menu).toBeFocused();
    } else {
      await expect(menu).toBeHidden();
      await expect(mobileResume).toBeHidden();
      await expect(desktopResume).toBeVisible();
      await expect(desktopResume).toContainText("Get my résumé");
      await expectResumeDownload(page, desktopResume);
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width >= 600) {
      await expect(talk).toBeVisible();
      await talk.click();
      await expect(page).toHaveURL(/#contact$/);
      await expect(page.locator("#contact")).toBeInViewport();
    } else {
      await expect(talk).toBeHidden();
    }
  });
}

test("résumé downloads remain keyboard-accessible with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const resume = page.locator(".header-actions a[download]");
  await page.getByRole("navigation").getByRole("link", { name: "05. Contact" }).focus();
  await page.keyboard.press("Tab");
  await expect(resume).toBeFocused();
  await expect(resume).toHaveCSS("outline-style", "solid");
  await expect(resume).toHaveCSS("outline-width", "2px");
  await resume.hover();
  await expect(resume.locator("svg")).toHaveCSS("transform", "none");
  await expect(resume.locator("svg")).toHaveCSS("transition-duration", "0s");
  const downloadEvent = page.waitForEvent("download");
  await page.keyboard.press("Enter");
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe(resumeDownloadName);
  expect(await download.failure()).toBeNull();
});

test("the Contact résumé link downloads without JavaScript on desktop and mobile", async ({ browser }) => {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    try {
      const page = await context.newPage();
      await page.goto(`${process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3100"}/#contact`);
      const resume = page.locator("#contact").getByRole("link", { name: "Download my résumé (PDF)", exact: true });
      await expect(resume).toBeVisible();
      await expect(resume).toContainText("Download my résumé");
      await expectResumeDownload(page, resume);
    } finally {
      await context.close();
    }
  }
});

test("reduced motion keeps all content visible and disables animated scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  expect(await page.locator(".headline-line").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await page.getByRole("link", { name: "Explore My Work" }).click();
  await expect(page.locator("#work")).toBeInViewport();
});

test("essential content and anchor links work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3100");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Explore My Work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
  await expect(page.locator(".project-card")).toHaveCount(8);
  await context.close();
});

test("contact methods are visible and use valid email, phone, and social links", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#contact");
    const contact = page.locator("#contact");
    const email = contact.locator('a[href="mailto:prahanspanuhar4@gmail.com"]');
    const phone = contact.locator('a[href="tel:+9779707108983"]');
    const github = contact.locator('a[href="https://github.com/prahans"]');
    const linkedin = contact.locator('a[href="https://www.linkedin.com/in/anurag-panuhar-786265381/"]');
    for (const link of [email, phone, github, linkedin]) {
      await expect(link).toBeVisible();
    }
    await expect(phone).toContainText("+977 9707108983");
    await expect(phone).toContainText("Let’s have a chat");
    await expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
    const copyIcon = contact.getByRole("button", { name: "Copy email address" });
    await expect(copyIcon).toBeVisible();
    await expect(copyIcon).toHaveAttribute("data-tooltip", "Copy email address");
    await expect(copyIcon.locator("svg")).toBeVisible();
    await expect(copyIcon.locator("span")).toHaveCount(0);
    await expect(linkedin).toContainText("LinkedIn");
    await expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test("visitors can copy the email address without opening an email application", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          (window as Window & { __copiedEmail?: string }).__copiedEmail = value;
        },
      },
    });
  });
  await page.goto("/#contact");
  const copy = page.getByRole("button", { name: "Copy email address" });
  await copy.click();
  await expect(copy).toHaveAttribute("data-tooltip", "Copied!");
  await expect(copy).toHaveAttribute("data-status", "copied");
  await expect(page.locator("#contact").getByRole("status")).toContainText("Email address copied to clipboard.");
  await expect(copy).toHaveAttribute("data-status", "idle", { timeout: 5000 });
  await expect(copy).toHaveAttribute("data-tooltip", "Copy email address");
  expect(await page.evaluate(() => (window as Window & { __copiedEmail?: string }).__copiedEmail)).toBe("prahanspanuhar4@gmail.com");
  await expect(page.locator("#contact a[href='mailto:prahanspanuhar4@gmail.com']")).toBeVisible();
});

test("failed clipboard access does not falsely report copied", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => { throw new Error("Clipboard permission blocked"); } },
    });
    document.execCommand = () => false;
  });
  await page.goto("/#contact");
  const copy = page.getByRole("button", { name: "Copy email address" });
  await copy.click();
  await expect(copy).toHaveAttribute("data-status", "error");
  await expect(page.locator("#contact").getByRole("status")).toContainText("Copy was blocked");
  await expect(copy).toHaveAttribute("data-tooltip", "Couldn\'t copy");
});

test("featured work filters the personal project collection with clear category counts", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#work");
    const cards = page.locator("#project-results .project-card");
    const filters = page.getByRole("group", { name: "Browse projects by category" });
    const all = filters.getByRole("button", { name: "Show all projects (8)" });
    const ai = filters.getByRole("button", { name: "Show ai & tools (2)" });
    const travel = filters.getByRole("button", { name: "Show travel & stays (4)" });
    const apps = filters.getByRole("button", { name: "Show apps & dashboards (2)" });

    await expect(page.locator(".project-collection-label")).toHaveText("Personal projects");
    await expect(page.locator(".project-collection-total")).toContainText("08 selected builds");
    await expect(cards).toHaveCount(8);
    await expect(all).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".project-filter-status")).toHaveText("Showing 8 of 8");

    await ai.click();
    await expect(ai).toHaveAttribute("aria-pressed", "true");
    await expect(all).toHaveAttribute("aria-pressed", "false");
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0).getByRole("heading", { name: "PatchVerdict" })).toBeVisible();
    await expect(cards.nth(1).getByRole("heading", { name: "RepoExplain" })).toBeVisible();

    await travel.click();
    await expect(cards).toHaveCount(4);
    for (const name of ["The Wild Oasis", "WanderLust", "WorldWise", "Wild Oasis Admin"]) {
      await expect(page.locator("#project-results").getByRole("heading", { name, exact: true })).toBeVisible();
    }

    await apps.click();
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0).getByRole("heading", { name: "Stock Trading Platform" })).toBeVisible();
    await expect(cards.nth(1).getByRole("heading", { name: "Fast React Pizza" })).toBeVisible();
    await expect(page.locator("#project-results .project-links a")).toHaveCount(4);
    await expect(page.locator(".project-filter-status")).toHaveText("Showing 2 of 8");

    // Native button focus and state remain keyboard-accessible.
    await all.focus();
    await page.keyboard.press("Enter");
    await expect(all).toHaveAttribute("aria-pressed", "true");
    await expect(cards).toHaveCount(8);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test("project typography is editorial, legible and responsive without changing cards", async ({ page }) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#work");
    const cards = page.locator(".project-card");
    await expect(cards).toHaveCount(8);
    const firstCard = cards.first();
    const typography = await firstCard.evaluate((card) => {
      const title = getComputedStyle(card.querySelector("h3")!);
      const body = getComputedStyle(card.querySelector(".project-copy > p")!);
      const date = getComputedStyle(card.querySelector(".project-date")!);
      const tag = getComputedStyle(card.querySelector(".project-tags li")!);
      const action = getComputedStyle(card.querySelector(".project-links a")!);
      return {
        titleFont: title.fontFamily,
        titleSize: parseFloat(title.fontSize),
        bodySize: parseFloat(body.fontSize),
        bodyLineHeight: parseFloat(body.lineHeight),
        dateSize: parseFloat(date.fontSize),
        tagSize: parseFloat(tag.fontSize),
        actionSize: parseFloat(action.fontSize),
      };
    });
    expect(typography.titleFont).toMatch(/Fraunces/i);
    expect(typography.titleSize).toBeGreaterThanOrEqual(25);
    expect(typography.bodySize).toBeGreaterThanOrEqual(12.5);
    expect(typography.bodyLineHeight / typography.bodySize).toBeGreaterThanOrEqual(1.6);
    expect(typography.dateSize).toBeGreaterThanOrEqual(9.5);
    expect(typography.tagSize).toBeGreaterThanOrEqual(10);
    expect(typography.actionSize).toBeGreaterThanOrEqual(11);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test("project cards pair editorial titles with restrained handwritten notes", async ({ page }) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#work");
    const cards = page.locator("#project-results .project-card");
    await expect(cards).toHaveCount(8);
    const notes = [
      "Evidence first.",
      "Find your way through code.",
      "A little room to unwind.",
      "Places worth finding.",
      "A pin for every memory.",
      "Learning the moving parts.",
      "Behind the welcome.",
      "Dinner starts here.",
    ];
    for (const [i, expectedNote] of notes.entries()) {
      const card = cards.nth(i);
      const title = card.getByRole("heading", { level: 3 });
      const note = card.locator(".project-handnote");
      await expect(note).toHaveText(expectedNote);
      await expect(note).toBeVisible();
      await expect(title).toHaveCSS("font-family", /Fraunces/);
      await expect(note).toHaveCSS("font-family", /Caveat/);
      const position = await card.evaluate((element) => {
        const titleBox = element.querySelector("h3")!.getBoundingClientRect();
        const noteBox = element.querySelector(".project-handnote")!.getBoundingClientRect();
        const bodyBox = element.querySelector(".project-copy > p")!.getBoundingClientRect();
        const cardBox = element.getBoundingClientRect();
        return {
          titleBeforeNote: titleBox.bottom <= noteBox.top + 3,
          noteBeforeBody: noteBox.bottom <= bodyBox.top + 3,
          noteWithinCard: noteBox.left >= cardBox.left && noteBox.right <= cardBox.right + 1,
        };
      });
      expect(position.titleBeforeNote).toBe(true);
      expect(position.noteBeforeBody).toBe(true);
      expect(position.noteWithinCard).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test("project dates use a readable warm accent without changing their content", async ({ page }) => {
  await page.goto("/#work");
  const firstDate = page.locator(".project-card .project-date").first();
  await expect(firstDate).toHaveText("Sep–Oct 2026");
  await expect(firstDate).toHaveCSS("color", "rgb(164, 68, 48)");
  await expect(firstDate).toHaveCSS("border-bottom-width", "2px");
});

test("featured work shows real projects with screenshots, dates and links", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#work");
    const cards = page.locator(".project-card");
    await expect(cards).toHaveCount(8);
    const expected = [
      { title: "PatchVerdict", date: "Sep–Oct 2026", screenshot: "patchVerdict.png", source: "https://github.com/prahans/patch-verdict", demo: "https://patchverdict.duckdns.org/" },
      { title: "RepoExplain", date: "Sep 2026", screenshot: "repoExplain.png", source: "https://github.com/prahans/repo-explain", demo: "https://repo-explain-gamma.vercel.app/" },
      { title: "The Wild Oasis", date: "Sep 2026", screenshot: "the-wild-oasis-website.png", source: "https://github.com/prahans/The-wild-oasis-website", demo: "https://the-wild-oasis-website-zeta-puce.vercel.app/" },
      { title: "WanderLust", date: "Jan–Sep 2026", screenshot: "wanderlust.png", source: "https://github.com/prahans/wanderLust", demo: "https://wanderlust-okyq.onrender.com/listings" },
      { title: "WorldWise", date: "Aug 2026", screenshot: "worldWise.png", source: "https://github.com/prahans/worldWise", demo: "https://world-wise-prahans1.vercel.app/" },
      { title: "Stock Trading Platform", date: "Mar–Sep 2026", screenshot: "zerodha.png", source: "https://github.com/prahans/full-stack-stock-trading-platform", demo: "https://full-stack-stock-trading-platform-f.vercel.app/" },
      { title: "Wild Oasis Admin", date: "Aug–Sep 2026", screenshot: "the-wild-oasis.png", source: "https://github.com/prahans/The-wild-oasis", demo: "https://the-wild-oasis-prahans.netlify.app/" },
      { title: "Fast React Pizza", date: "Aug 2026", screenshot: "fast-react-pizza.png", source: "https://github.com/prahans/FAST-REACT-PIZZA", demo: "https://fast-react-pizza-x5su.vercel.app/" },
    ];
    for (const [index, project] of expected.entries()) {
      const card = cards.nth(index);
      await expect(card.getByRole("heading", { name: project.title })).toBeVisible();
      await expect(card.locator(".project-date")).toHaveText(project.date);
      await expect(card.locator(".project-visual img")).toHaveAttribute("src", new RegExp(project.screenshot));
      await expect(card.locator(".project-visual img")).toBeVisible();
      await expect(card.locator(".project-visual img")).toHaveAttribute("alt", /\S+/);
      await expect(card.locator(`a[href="${project.source}"]`)).toBeVisible();
      await expect(card.locator(`a[href="${project.demo}"]`)).toBeVisible();
      await expect(card.locator(`a[href="${project.demo}"]`)).toHaveAttribute("rel", "noopener noreferrer");
      await expect(card).not.toContainText("Concept placeholder");
    }
    await expect(cards.nth(5).locator(".project-status")).toHaveText("In development");
    await expect(cards.nth(4).locator(".project-tags")).toContainText("Leaflet");
    await expect(cards.nth(5).locator(".project-tags")).toContainText("MongoDB");
    await expect(cards.nth(6).locator(".project-tags")).toContainText("Supabase");
    await expect(cards.nth(7).locator(".project-tags")).toContainText("Redux Toolkit");
    // Admin dashboard and public cabin-booking website are separate projects.
    await expect(cards.nth(2).getByRole("heading", { name: "The Wild Oasis" })).toBeVisible();
    await expect(cards.nth(6).getByRole("heading", { name: "Wild Oasis Admin" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
