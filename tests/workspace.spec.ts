import { test, expect, type Locator, type Page } from "@playwright/test";

const notebookText = "I enjoy building useful things, learning as I go, and paying attention to the details. Good software isn't just about making something work — it's about making someone's experience a little better.";

async function openArtwork(page: Page) {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const scene = page.locator(".workspace-scene");
  await scene.scrollIntoViewIfNeeded();
  await expect(page.locator(".workspace-image")).toBeVisible();
  await expect.poll(() => page.locator(".workspace-image").evaluate((element) => {
    const image = element as HTMLImageElement;
    return image.complete && image.naturalWidth > 0;
  })).toBe(true);
  await expect(page.locator(".hero-art-reveal")).toHaveCSS("opacity", "1");
  return scene;
}

async function expectPanelWithinViewport(page: Page, panel: Locator) {
  await expect(panel).toBeVisible();
  const bounds = await panel.boundingBox();
  const viewport = page.viewportSize();
  expect(bounds).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport!.width + 1);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport!.height + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport!.width);
}

// Centers measured from the approved source crop, independent of viewport size.
const sourceObjectCenters = [
  { selector: ".workspace-hotspot--laptop", x: 0.5375, y: 0.572 },
  { selector: ".workspace-hotspot--notebook", x: 0.2926, y: 0.8421 },
  { selector: ".workspace-hotspot--mug", x: 0.8735, y: 0.6665 },
];

for (const width of [1440, 1280, 768, 390, 360]) {
  test(`workspace hotspots and panels stay aligned at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    // A still scene lets geometry assertions inspect the source alignment directly.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openArtwork(page);
    await expect(page.locator(".workspace-image")).toHaveAttribute("src", /workspace-v1\.webp/);
    await expect(page.locator('img[src*="developer-v1"], .mountain-print, .workspace-note')).toHaveCount(0);
    const image = await page.locator(".workspace-image").boundingBox();
    expect(image).not.toBeNull();
    for (const object of sourceObjectCenters) {
      const bounds = await page.locator(object.selector).boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(image!.x - 1);
      expect(bounds!.y).toBeGreaterThanOrEqual(image!.y - 1);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(image!.x + image!.width + 1);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(image!.y + image!.height + 1);
      const centerX = (bounds!.x + bounds!.width / 2 - image!.x) / image!.width;
      const centerY = (bounds!.y + bounds!.height / 2 - image!.y) / image!.height;
      expect(Math.abs(centerX - object.x)).toBeLessThan(0.025);
      expect(Math.abs(centerY - object.y)).toBeLessThan(0.025);
    }

    const laptop = page.getByRole("button", { name: "Explore my workspace", exact: true });
    await laptop.click();
    const workspace = page.getByRole("dialog", { name: "Explore my workspace" });
    await expectPanelWithinViewport(page, workspace);
    await expect(workspace.getByRole("tabpanel", { name: "Code" })).toContainText("useState");
    await workspace.getByRole("tab", { name: "Preview", exact: true }).click();
    await expect(workspace.getByRole("status")).toHaveText("1 idea to explore");
    await workspace.getByRole("button", { name: "Add an idea" }).click();
    await expect(workspace.getByRole("status")).toHaveText("2 ideas to explore");
    await page.screenshot({ path: `artifacts/workspace-preview-${width}.png`, animations: "disabled" });
    await workspace.getByRole("button", { name: "Close workspace" }).click();
    await expect(workspace).not.toBeVisible();
    await expect(laptop).toBeFocused();

    const notebook = page.getByRole("button", { name: "Read my notes", exact: true });
    await notebook.click();
    const note = page.getByRole("dialog", { name: "A little note from me" });
    await expectPanelWithinViewport(page, note);
    await expect(note).toContainText(notebookText);
    await expect(note).toContainText("Still learning. Always building. ☕");
    await page.screenshot({ path: `artifacts/workspace-notebook-${width}.png`, animations: "disabled" });
    await page.keyboard.press("Escape");
    await expect(note).not.toBeVisible();
    await expect(notebook).toBeFocused();
  });
}

test("workspace tabs support keyboard selection, focus containment, and focus return", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openArtwork(page);
  const trigger = page.getByRole("button", { name: "Open workspace panel", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const panel = page.getByRole("dialog", { name: "Explore my workspace" });
  await expect(panel).toBeVisible();
  const code = panel.getByRole("tab", { name: "Code", exact: true });
  const preview = panel.getByRole("tab", { name: "Preview", exact: true });
  await code.focus();
  await page.keyboard.press("ArrowRight");
  await expect(preview).toBeFocused();
  await expect(preview).toHaveAttribute("aria-selected", "true");
  await expect(panel.getByRole("tabpanel", { name: "Preview" })).toBeVisible();
  await page.keyboard.press("Home");
  await expect(code).toBeFocused();
  await expect(code).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(preview).toBeFocused();
  for (let step = 0; step < 6; step++) {
    await page.keyboard.press("Tab");
    expect(await panel.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(panel).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("desktop scene depth stays restrained and laptop hover is discoverable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const scene = await openArtwork(page);
  const bounds = await scene.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width * 0.9, bounds!.y + bounds!.height * 0.6);
  await expect.poll(() => scene.evaluate((element) => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return matrix.m41;
  })).toBeGreaterThan(0.5);
  const offset = await scene.evaluate((element) => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return { x: Math.abs(matrix.m41), y: Math.abs(matrix.m42) };
  });
  expect(offset.x).toBeLessThanOrEqual(3.1);
  expect(offset.y).toBeLessThanOrEqual(2.1);
  await page.getByRole("button", { name: "Explore my workspace", exact: true }).hover();
  await expect(page.locator(".workspace-tooltip--laptop")).toHaveCSS("opacity", "1");
  await page.mouse.move(10, 10);
  await expect.poll(() => scene.evaluate((element) => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return Math.abs(matrix.m41) + Math.abs(matrix.m42);
  })).toBeLessThan(0.1);
});

test("coffee steam drifts continuously, without clicking or hovering the mug", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openArtwork(page);

  const steam = page.locator(".mug-steam");
  await expect(steam).toBeVisible();
  await expect(steam).toHaveCSS("opacity", "0.94");
  const firstWisp = steam.locator("path").first();
  await expect(firstWisp).toHaveCSS("animation-name", "coffee-steam");
  expect(await firstWisp.evaluate((element) =>
    element.getAnimations().some((animation) => animation.playState === "running"),
  )).toBe(true);

  const mug = page.getByRole("button", { name: "Fueled by curiosity & coffee", exact: true });
  await mug.click();
  await expect(page.locator("#coffee-tooltip")).toBeVisible();
  await page.mouse.move(10, 10);
  // Clicking pins the note open; moving away should not dismiss it.
  await expect(page.locator("#coffee-tooltip")).toBeVisible();
  // An actual outside pointerdown dismisses the pinned note.
  await page.mouse.click(10, 10);
  await expect(page.locator("#coffee-tooltip")).not.toBeVisible();
  await expect(steam).toBeVisible();
  await expect(firstWisp).toHaveCSS("animation-name", "coffee-steam");
});

test("mug offers a tooltip on pointer hover and keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openArtwork(page);
  const mug = page.getByRole("button", { name: "Fueled by curiosity & coffee", exact: true });
  const tooltip = page.locator("#coffee-tooltip");
  await mug.hover();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText("Fueled by curiosity & coffee ☕");
  await expect(page.locator(".mug-steam")).toBeVisible();
  await page.mouse.move(10, 10);
  await expect(tooltip).not.toBeVisible();
  await mug.focus();
  await expect(tooltip).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(tooltip).not.toBeVisible();
  await expect(mug).toBeFocused();
});

test.describe("touch workspace", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  test("mug message can be tapped open and dismissed without hovering", async ({ page }) => {
    await openArtwork(page);
    const mug = page.getByRole("button", { name: "Fueled by curiosity & coffee", exact: true });
    await mug.tap();
    await expect(page.locator("#coffee-tooltip")).toBeVisible();
    await expect(page.locator("#coffee-tooltip")).toHaveText("Fueled by curiosity & coffee ☕");
    await page.touchscreen.tap(8, 90);
    await expect(page.locator("#coffee-tooltip")).not.toBeVisible();
  });
});

test("reduced motion leaves the artwork static while interactions remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const scene = await openArtwork(page);
  const bounds = await scene.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width * 0.8, bounds!.y + bounds!.height * 0.5);
  const translation = await scene.evaluate((element) => {
    const transform = getComputedStyle(element).transform;
    const matrix = transform === "none" ? new DOMMatrix() : new DOMMatrix(transform);
    return { x: matrix.m41, y: matrix.m42 };
  });
  expect(translation).toEqual({ x: 0, y: 0 });
  await page.getByRole("button", { name: "Fueled by curiosity & coffee", exact: true }).focus();
  await expect(page.locator("#coffee-tooltip")).toBeVisible();
  await expect(page.locator(".mug-steam")).toBeVisible();
  await expect(page.locator(".mug-steam path").first()).toHaveCSS("animation-name", "none");
  const runningAnimations = await scene.evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length);
  expect(runningAnimations).toBe(0);
  await page.getByRole("button", { name: "Read my notes", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "A little note from me" })).toBeVisible();
});

test("approved workspace artwork remains visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto(process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3100");
    const artwork = page.locator(".workspace-image");
    await artwork.scrollIntoViewIfNeeded();
    await expect(artwork).toBeVisible();
    await expect.poll(() => artwork.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("I build digital experiences that make life a little better.");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator(".workspace-legend")).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Read my notes", exact: true })).toHaveCount(0);
  } finally {
    await context.close();
  }
});
