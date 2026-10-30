import { test, expect, type Locator, type Page } from "@playwright/test";

const notebookText = "I like understanding why a problem matters before deciding how to solve it. Then I build, test, listen, and refine—because good software should feel clear and considerate to the person using it.";

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

test("the redundant shortcut row is absent while artwork interactions remain", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openArtwork(page);
  await expect(page.getByText("Explore the little details")).toHaveCount(0);
  await expect(page.locator(".workspace-legend, .workspace-shortcuts")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open workspace panel", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Explore my workspace", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Read my notes", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Fueled by curiosity & coffee", exact: true })).toBeVisible();
});

test("workspace tabs support keyboard selection, focus containment, and focus return", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openArtwork(page);
  const trigger = page.getByRole("button", { name: "Explore my workspace", exact: true });
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

test("sunlight dust drifts automatically with staggered, invisible loop resets", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openArtwork(page);
  const layer = page.locator(".workspace-sunlight-particles");
  const particles = layer.locator(".workspace-sunlight-particle");
  await expect(layer).toHaveAttribute("aria-hidden", "true");
  await expect(layer).toHaveAttribute("focusable", "false");
  await expect(layer).toHaveAttribute("viewBox", "0 0 1109 684");
  await expect(layer).toHaveCSS("pointer-events", "none");
  await expect(particles).toHaveCount(4);
  await expect(layer.locator("[tabindex], a, button, input")).toHaveCount(0);
  await expect.poll(() => particles.evaluateAll((elements) => elements.every((element) =>
    element.getAnimations().some((animation) => animation.playState === "running"),
  ))).toBe(true);

  const firstParticle = particles.first();
  const initialTransform = await firstParticle.evaluate((element) => getComputedStyle(element).transform);
  // No pointer or keyboard action starts the animation.
  await expect.poll(() => firstParticle.evaluate((element) => getComputedStyle(element).transform)).not.toBe(initialTransform);
  const timing = await particles.evaluateAll((elements) => elements.map((element) => {
    const animation = element.getAnimations()[0];
    const { duration, delay, iterations } = animation.effect!.getTiming();
    return { duration: Number(duration), delay, infinite: iterations === Infinity };
  }));
  expect(new Set(timing.map((item) => item.duration)).size).toBe(4);
  expect(new Set(timing.map((item) => item.delay)).size).toBe(4);
  for (const item of timing) {
    expect(item.duration).toBeGreaterThanOrEqual(8_000);
    expect(item.duration).toBeLessThanOrEqual(15_000);
    expect(item.delay).toBeLessThan(0);
    expect(item.infinite).toBe(true);
  }

  // Size/opacity checks guard against an imperceptible configuration. Actual
  // contrast against the illustration is still reviewed in browser screenshots.
  const visibleCounts = await particles.evaluateAll((elements) => {
    const animations = elements.map((element) => element.getAnimations()[0]);
    animations.forEach((animation) => animation.pause());
    return Array.from({ length: 21 }, (_, step) => {
      animations.forEach((animation) => { animation.currentTime = step * 500; });
      return elements.filter((element) => Number(getComputedStyle(element).opacity) >= .55).length;
    });
  });
  for (const visibleCount of visibleCounts) expect(visibleCount).toBeGreaterThanOrEqual(2);

  const phases = await particles.evaluateAll((elements) => elements.map((element) => {
    const animation = element.getAnimations()[0];
    const { duration, delay = 0 } = animation.effect!.getTiming();
    animation.pause();
    const read = (progress: number) => {
      animation.currentTime = Number(duration) * (1 + progress) + delay;
      return Number(getComputedStyle(element).opacity);
    };
    return { start: read(0), middle: read(.5), end: read(1) };
  }));
  for (const phase of phases) {
    expect(phase.start).toBeLessThan(.01);
    expect(phase.middle).toBeGreaterThanOrEqual(.75);
    expect(phase.middle).toBeLessThanOrEqual(.92);
    expect(phase.end).toBeLessThan(.01);
  }
});

for (const width of [1440, 1280, 1024, 768, 390, 360]) {
  test(`sunlight dust stays inside the artwork and clear of the screen at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await openArtwork(page);
    const layer = page.locator(".workspace-sunlight-particles");
    const particles = layer.locator(".workspace-sunlight-particle");
    const visibleParticles = particles.filter({ visible: true });
    await expect(particles).toHaveCount(4);
    await expect(visibleParticles).toHaveCount(width < 600 ? 2 : 4);
    await expect(layer).toHaveCSS("overflow", "hidden");

    for (const particle of await particles.all()) {
      await expect(particle).toHaveCSS("pointer-events", "none");
      if (!(await particle.isVisible())) {
        expect(await particle.evaluate((element) => element.getAnimations().length)).toBe(0);
      }
    }

    const verticalPositions: number[][] = [];
    for (const progress of [.2, .5, .8]) {
      await visibleParticles.evaluateAll((elements, phase) => {
        for (const element of elements) {
          const animation = element.getAnimations()[0];
          const { duration, delay = 0 } = animation.effect!.getTiming();
          animation.pause();
          animation.currentTime = Number(duration) * (1 + phase) + delay;
        }
      }, progress);
      const image = (await page.locator(".workspace-image").boundingBox())!;
      const screen = (await page.locator(".workspace-hotspot--laptop").boundingBox())!;
      const positions: number[] = [];
      for (const particle of await visibleParticles.all()) {
        const bounds = (await particle.boundingBox())!;
        // These are CSS pixels at normal zoom, not the larger screenshot DPR.
        expect(bounds.width).toBeGreaterThanOrEqual(width < 600 ? 4.5 : 5);
        expect(bounds.width).toBeLessThanOrEqual(11);
        expect(bounds.x).toBeGreaterThanOrEqual(image.x);
        expect(bounds.y).toBeGreaterThanOrEqual(image.y);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(image.x + image.width);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(image.y + image.height);
        // The sunlit side is well clear of the introduction and laptop UI.
        expect((bounds.x - image.x) / image.width).toBeGreaterThan(.6);
        const overlapsScreen = bounds.x < screen.x + screen.width && bounds.x + bounds.width > screen.x
          && bounds.y < screen.y + screen.height && bounds.y + bounds.height > screen.y;
        expect(overlapsScreen).toBe(false);
        positions.push(bounds.y);
      }
      verticalPositions.push(positions);
    }
    for (let index = 0; index < verticalPositions[0].length; index++) {
      // A discernible upward journey, rather than a subpixel transform change.
      const rise = verticalPositions[0][index] - verticalPositions[2][index];
      expect(rise).toBeGreaterThanOrEqual(width < 600 ? 6 : 9);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    const laptop = page.getByRole("button", { name: "Explore my workspace", exact: true });
    await laptop.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Explore my workspace" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(laptop).toBeFocused();
    // Native close returns focus before React handles the queued close event.
    await expect(page.locator(".workspace-panel h2")).toHaveCount(0);
    const notebook = page.getByRole("button", { name: "Read my notes", exact: true });
    await notebook.focus();
    await expect(notebook).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "A little note from me" })).toBeVisible();
  });
}

test("sunlight dust pauses offscreen and resumes without restarting", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const scene = await openArtwork(page);
  const layer = page.locator(".workspace-sunlight-particles");
  await expect.poll(() => layer.evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length)).toBe(4);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect.poll(() => layer.evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "paused").length)).toBe(4);
  const pausedTime = await layer.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime));
  await scene.scrollIntoViewIfNeeded();
  await expect.poll(() => layer.evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length)).toBe(4);
  await expect.poll(() => layer.evaluate((element) => Number(element.getAnimations({ subtree: true })[0].currentTime))).toBeGreaterThan(pausedTime);
});

test("bulb and surrounding desk light breathe in synchronized opposite phases", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openArtwork(page);

  const light = page.locator(".workspace-bulb-light");
  await expect(light).toHaveAttribute("aria-hidden", "true");
  await expect(light).toHaveCSS("pointer-events", "none");
  await expect(light.locator("span")).toHaveCount(4);

  for (const selector of [".workspace-bulb-room-shade", ".workspace-bulb-glass-shade"]) {
    await expect(page.locator(selector)).toHaveCSS("animation-name", "bulb-shadow-breathe");
  }
  for (const selector of [".workspace-bulb-room-glow", ".workspace-bulb-glass-glow"]) {
    await expect(page.locator(selector)).toHaveCSS("animation-name", "bulb-light-breathe");
  }

  const phases = await light.evaluate((root) => {
    const selectors = [
      ".workspace-bulb-room-shade",
      ".workspace-bulb-glass-shade",
      ".workspace-bulb-room-glow",
      ".workspace-bulb-glass-glow",
    ];
    const animations = root.getAnimations({ subtree: true });
    const read = (time: number) => {
      animations.forEach((animation) => {
        animation.pause();
        animation.currentTime = time;
      });
      return selectors.map((selector) =>
        Number(getComputedStyle(root.querySelector(selector)!).opacity),
      );
    };
    const dim = read(0);
    const bright = read(4200);
    animations.forEach((animation) => animation.play());
    return { dim, bright, durations: animations.map((animation) => animation.effect?.getTiming().duration) };
  });
  expect(phases.durations).toEqual([8400, 8400, 8400, 8400]);
  expect(phases.dim[0]).toBeGreaterThan(phases.bright[0]);
  expect(phases.dim[1]).toBeGreaterThan(phases.bright[1]);
  expect(phases.dim[2]).toBeLessThan(phases.bright[2]);
  expect(phases.dim[3]).toBeLessThan(phases.bright[3]);

  // The bulb overlay must share the source image coordinate system.
  const center = await page.locator(".workspace-bulb-glass-glow").evaluate((element) => {
    const image = document.querySelector(".workspace-image")!.getBoundingClientRect();
    const glow = element.getBoundingClientRect();
    return {
      x: (glow.left + glow.width / 2 - image.left) / image.width,
      y: (glow.top + glow.height / 2 - image.top) / image.height,
    };
  });
  expect(center.x).toBeGreaterThan(0.300);
  expect(center.x).toBeLessThan(0.315);
  expect(center.y).toBeGreaterThan(0.560);
  expect(center.y).toBeLessThan(0.585);

  await page.getByRole("button", { name: "Explore my workspace", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Explore my workspace" })).toBeVisible();
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
  const dust = page.locator(".workspace-sunlight-particles");
  await expect(dust).not.toBeVisible();
  expect(await dust.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(page.locator(".workspace-bulb-light")).toBeVisible();
  for (const layer of await page.locator(".workspace-bulb-light > span").all()) {
    await expect(layer).toHaveCSS("animation-name", "none");
  }
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
    await expect(page.locator(".workspace-legend")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Read my notes", exact: true })).toHaveCount(0);
  } finally {
    await context.close();
  }
});
