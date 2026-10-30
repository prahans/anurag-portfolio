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

async function seekBird(page: Page, milliseconds: number) {
  await page.locator(".workspace-bird-layer").evaluate((element, time) => {
    for (const animation of element.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = time;
    }
  }, milliseconds);
}

async function expectBirdOnBezel(page: Page) {
  // The feet anchor is measured against the approved image, not the viewport.
  const alignment = await page.locator(".workspace-bird").evaluate((element) => {
    const bird = element as SVGGraphicsElement;
    const image = document.querySelector(".workspace-image")!.getBoundingClientRect();
    const feet = new DOMPoint(0, 0).matrixTransform(bird.getScreenCTM()!);
    return {
      x: (feet.x - image.x) / image.width,
      y: (feet.y - image.y) / image.height,
    };
  });
  expect(alignment.x).toBeCloseTo(640 / 1109, 3);
  expect(alignment.y).toBeCloseTo(258 / 684, 3);
}

// Centers measured from the approved source crop, independent of viewport size.
const sourceObjectCenters = [
  { selector: ".workspace-hotspot--laptop", x: 0.5375, y: 0.572 },
  { selector: ".workspace-hotspot--notebook", x: 0.2926, y: 0.8421 },
  { selector: ".workspace-hotspot--mug", x: 0.8735, y: 0.6665 },
];

for (const width of [1440, 1280, 1024, 768, 390, 360]) {
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

test("laptop glows and the code cursor blinks continuously without hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openArtwork(page);

  const glow = page.locator(".workspace-laptop-glow");
  const cursor = page.locator(".workspace-laptop-cursor");
  await expect(glow).toBeVisible();
  await expect(cursor).toBeVisible();
  await expect(glow).toHaveCSS("animation-name", "laptop-screen-breathe");
  await expect(cursor).toHaveCSS("animation-name", "laptop-caret-blink");
  expect(await glow.evaluate((element) =>
    element.getAnimations().some((animation) => animation.playState === "running"),
  )).toBe(true);
  expect(await cursor.evaluate((element) =>
    element.getAnimations().some((animation) => animation.playState === "running"),
  )).toBe(true);
  await expect(glow.locator("..")).toHaveAttribute("aria-hidden", "true");

  // The laptop still opens its original accessible Code/Preview dialog.
  const laptop = page.getByRole("button", { name: "Explore my workspace", exact: true });
  await laptop.click();
  await expect(page.getByRole("dialog", { name: "Explore my workspace" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("a tiny decorative bird flies across the hero, perches, and never blocks laptop clicks", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openArtwork(page);

  const layer = page.locator(".workspace-bird-layer");
  const bird = page.locator(".workspace-bird");
  await expect(bird).toHaveCount(1);
  await expect(layer).toHaveAttribute("aria-hidden", "true");
  await expect(layer).toHaveAttribute("focusable", "false");
  await expect(bird).toHaveCSS("pointer-events", "none");
  await expect(bird.locator(".workspace-bird-wing")).toHaveCount(2);
  await expect.poll(() => bird.evaluate((element) =>
    element.getAnimations().some((animation) => animation.id === "workspace-bird-journey" && animation.playState === "running"),
  )).toBe(true);
  const initialTime = await bird.evaluate((element) => {
    const journey = element.getAnimations().find((animation) => animation.id === "workspace-bird-journey")!;
    return { time: Number(journey.currentTime), duration: journey.effect!.getTiming().duration };
  });
  expect(initialTime.duration).toBe(28_000);
  await expect.poll(() => bird.evaluate((element) => Number(element.getAnimations()[0].currentTime))).toBeGreaterThan(initialTime.time + 50);

  await seekBird(page, 3_000);
  await expect(bird.locator(".workspace-bird-wing--near")).toHaveCSS("opacity", "1");
  const firstWingPose = await bird.locator(".workspace-bird-wing--near").evaluate((element) => getComputedStyle(element).transform);
  // Avoid sampling symmetric points on the upstroke and downstroke.
  await seekBird(page, 3_040);
  expect(await bird.locator(".workspace-bird-wing--near").evaluate((element) => getComputedStyle(element).transform)).not.toBe(firstWingPose);

  // The feet stay connected throughout the nine-second rest, with folded wings.
  for (const time of [8_500, 12_000, 16_800]) {
    await seekBird(page, time);
    await expectBirdOnBezel(page);
    await expect(bird.locator(".workspace-bird-folded-wing")).toHaveCSS("opacity", "1");
    for (const wing of await bird.locator(".workspace-bird-wing").all()) {
      await expect(wing).toHaveCSS("opacity", "0");
    }
  }

  await seekBird(page, 18_500);
  await expect(bird.locator(".workspace-bird-wing--near")).toHaveCSS("opacity", "1");

  // Both sides of the loop reset are invisible: no on-screen teleport.
  for (const time of [27_990, 0]) {
    await seekBird(page, time);
    await expect(bird).toHaveCSS("opacity", "0");
  }
  await seekBird(page, 12_000);

  // The same laptop hotspot remains clickable with the decorative bird present.
  await page.getByRole("button", { name: "Explore my workspace", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Explore my workspace" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

for (const width of [1440, 1280, 1024, 768]) {
  test(`bird flight stays inside the workspace composition at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await openArtwork(page);
    const layer = page.locator(".workspace-bird-layer");
    await expect(layer).toHaveCSS("overflow", "hidden");
    await expect.poll(() => layer.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
    for (const time of [2_400, 4_800, 6_900, 8_600, 12_000, 18_500, 20_000]) {
      await seekBird(page, time);
      const image = await page.locator(".workspace-image").boundingBox();
      const bird = await page.locator(".workspace-bird").boundingBox();
      expect(image).not.toBeNull();
      expect(bird).not.toBeNull();
      expect(bird!.x).toBeGreaterThanOrEqual(image!.x - 1);
      expect(bird!.y).toBeGreaterThanOrEqual(image!.y - 1);
      expect(bird!.x + bird!.width).toBeLessThanOrEqual(image!.x + image!.width + 1);
      expect(bird!.y + bird!.height).toBeLessThanOrEqual(image!.y + image!.height + 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await seekBird(page, 12_000);
    await expectBirdOnBezel(page);
  });
}

for (const width of [390, 360]) {
  test(`bird stays perched and still on ${width}px screens`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await openArtwork(page);
    const bird = page.locator(".workspace-bird");
    await expect(bird).toBeVisible();
    await expectBirdOnBezel(page);
    await expect(bird.locator(".workspace-bird-folded-wing")).toHaveCSS("opacity", "1");
    expect(await page.locator(".workspace-bird-layer").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.getByRole("button", { name: "Explore my workspace", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Explore my workspace" })).toBeVisible();
  });
}

test("bird pauses outside the viewport and resumes when the workspace returns", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const scene = await openArtwork(page);
  const layer = page.locator(".workspace-bird-layer");
  await expect.poll(() => layer.evaluate((element) => element.getAnimations({ subtree: true }).some((animation) => animation.playState === "running"))).toBe(true);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect.poll(() => layer.evaluate((element) => element.getAnimations({ subtree: true }).every((animation) => animation.playState === "paused"))).toBe(true);
  await scene.scrollIntoViewIfNeeded();
  await expect.poll(() => layer.evaluate((element) => element.getAnimations({ subtree: true }).every((animation) => animation.playState === "running"))).toBe(true);
});

test("bird responds to motion preferences and viewport changes without leaving old animations", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openArtwork(page);
  const layer = page.locator(".workspace-bird-layer");
  const animationCount = () => layer.evaluate((element) => element.getAnimations({ subtree: true }).length);
  await expect.poll(animationCount).toBeGreaterThan(0);
  const originalCount = await animationCount();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(animationCount).toBe(0);
  await expectBirdOnBezel(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(animationCount).toBe(originalCount);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(animationCount).toBe(0);
  await expectBirdOnBezel(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect.poll(animationCount).toBe(originalCount);
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
  await expect(page.locator(".workspace-laptop-glow")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".workspace-laptop-cursor")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".workspace-bird")).toBeVisible();
  await expectBirdOnBezel(page);
  expect(await page.locator(".workspace-bird-layer").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
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
