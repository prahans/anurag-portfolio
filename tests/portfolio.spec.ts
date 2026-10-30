import { test, expect } from "@playwright/test";

for (const width of [360, 390, 768, 1024, 1280, 1440]) {
  test(`portfolio layout and assets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("I build digital experiences that make life a little better.");
    await expect(page.locator(".project-card")).toHaveCount(4);
    await expect(page.locator(".project-links a")).toHaveCount(8);
    await expect(page.locator(".skill-item")).toHaveCount(12);
    for (const id of ["work", "about", "skills", "contact"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
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
  await page.getByRole("link", { name: "Let’s Talk", exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
  await expect(page.getByRole("navigation").getByRole("link", { name: "05. Contact" })).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".contact-button--email")).toHaveAttribute("href", "mailto:prahanspanuhar4@gmail.com");
  await expect(page.locator(".contact-social-link").first()).toHaveAttribute("href", "https://github.com/prahans");
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
  await expect(page.locator(".project-card")).toHaveCount(4);
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
  await expect(page.getByRole("status")).toContainText("Email address copied to clipboard.");
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
  await expect(page.getByRole("status")).toContainText("Copy was blocked");
  await expect(copy).toHaveAttribute("data-tooltip", "Couldn\'t copy");
});

test("featured work shows real projects with screenshots, dates and links", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#work");
    const cards = page.locator(".project-card");
    await expect(cards).toHaveCount(4);
    const expected = [
      { title: "PatchVerdict", date: "Sep–Oct 2026", screenshot: "patchVerdict.png", source: "https://github.com/prahans/patch-verdict", demo: "https://patchverdict.duckdns.org/" },
      { title: "RepoExplain", date: "Sep 2026", screenshot: "repoExplain.png", source: "https://github.com/prahans/repo-explain", demo: "https://repo-explain-gamma.vercel.app/" },
      { title: "The Wild Oasis", date: "Sep 2026", screenshot: "the-wild-oasis-website.png", source: "https://github.com/prahans/The-wild-oasis-website", demo: "https://the-wild-oasis-website-zeta-puce.vercel.app/" },
      { title: "WanderLust", date: "Jan–Sep 2026", screenshot: "wanderlust.png", source: "https://github.com/prahans/wanderLust", demo: "https://wanderlust-okyq.onrender.com/listings" },
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
      await expect(card.locator(".project-status")).not.toContainText("Concept placeholder");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
