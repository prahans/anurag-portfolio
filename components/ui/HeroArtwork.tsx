"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { site } from "@/data/site";
import { WorkspacePanel } from "@/components/ui/WorkspacePanel";
import { WorkspaceBird } from "@/components/ui/WorkspaceBird";
import "./hero-workspace.css";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** Hotspots share the image's coordinate system; the source pixels never change. */
export function HeroArtwork() {
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const reducedMotion = useReducedMotion();
  const [panel, setPanel] = useState<"laptop" | "notebook" | null>(null);
  const [coffeePinned, setCoffeePinned] = useState(false);
  const [coffeeHovered, setCoffeeHovered] = useState(false);
  const [coffeeFocused, setCoffeeFocused] = useState(false);
  const [coffeeDismissed, setCoffeeDismissed] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const finePointer = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 110, damping: 24, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 110, damping: 24, mass: 0.6 });
  const coffeeVisible = !panel && !coffeeDismissed && (coffeePinned || coffeeHovered || coffeeFocused);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => { finePointer.current = media.matches; x.set(0); y.set(0); };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [x, y]);

  useEffect(() => {
    if (!coffeeVisible) return;
    const dismiss = () => { setCoffeePinned(false); setCoffeeDismissed(true); };
    const onKey = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    const onPointer = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest("[data-coffee-control], #coffee-tooltip")) dismiss();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [coffeeVisible]);

  function resetDepth() { x.set(0); y.set(0); }

  function moveScene(event: PointerEvent<HTMLDivElement>) {
    if (!finePointer.current || reducedMotion !== false || event.pointerType !== "mouse" || panel) return;
    const bounds = sceneRef.current?.getBoundingClientRect();
    if (!bounds) return;
    x.set(Math.max(-3, Math.min(3, ((event.clientX - bounds.left) / bounds.width - 0.5) * 6)));
    y.set(Math.max(-2, Math.min(2, ((event.clientY - bounds.top) / bounds.height - 0.5) * 4)));
  }

  function openPanel(kind: "laptop" | "notebook", event: MouseEvent<HTMLButtonElement>) {
    openerRef.current = event.currentTarget;
    setCoffeePinned(false);
    setCoffeeDismissed(true);
    resetDepth();
    setPanel(kind);
  }

  function toggleCoffee() {
    setCoffeeDismissed(coffeePinned);
    setCoffeePinned(!coffeePinned);
    resetDepth();
  }

  const coffeeFocus = {
    onFocus: () => { setCoffeeFocused(true); setCoffeeDismissed(false); resetDepth(); },
    onBlur: () => setCoffeeFocused(false),
  };

  return (
    <div className="hero-artwork" data-ready={hydrated} onFocusCapture={resetDepth}>
      <div className="workspace-stage" ref={sceneRef} onPointerMove={moveScene} onPointerLeave={resetDepth}>
        <motion.div className="workspace-scene" style={{ x: reducedMotion ? 0 : springX, y: reducedMotion ? 0 : springY }}>
          <Image
            src={site.heroWorkspaceSrc}
            alt={site.heroWorkspaceAlt}
            width={1109}
            height={684}
            sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 999px) 680px, (max-width: 1199px) 56vw, 790px"
            loading="eager"
            fetchPriority="high"
            // Already optimized to 190 KiB; avoid a second lossy pass on the lettering.
            unoptimized
            className="workspace-image"
          />
          <div className="workspace-sunlight" aria-hidden="true" />
          <WorkspaceBird />
          <div className="workspace-interactions" hidden={!hydrated}>
            <button type="button" className="workspace-hotspot workspace-hotspot--laptop" aria-label="Explore my workspace" aria-haspopup="dialog" onClick={(event) => openPanel("laptop", event)}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="1,10 89,1 99,87 10,99" /></svg>
            </button>
            <span className="workspace-tooltip workspace-tooltip--laptop" aria-hidden="true">Explore my workspace</span>
            {/* Independent, non-interactive overlays follow the screen's source-image coordinates.
                The original code/UI pixels remain unchanged and the hotspot stays clickable. */}
            <div className="workspace-laptop-effects" aria-hidden="true">
              <span className="workspace-laptop-glow" />
              <span className="workspace-laptop-cursor" />
            </div>
            <button type="button" className="workspace-hotspot workspace-hotspot--notebook" aria-label="Read my notes" aria-haspopup="dialog" onClick={(event) => openPanel("notebook", event)}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="1,23 51,1 99,73 27,99" /></svg>
            </button>
            <span className="workspace-tooltip workspace-tooltip--notebook" aria-hidden="true">Read my notes</span>
            <button
              type="button"
              className="workspace-hotspot workspace-hotspot--mug"
              aria-label="Fueled by curiosity & coffee"
              aria-describedby={coffeeVisible ? "coffee-tooltip" : undefined}
              aria-expanded={coffeeVisible}
              data-coffee-control
              onPointerEnter={(event) => { if (event.pointerType === "mouse") { setCoffeeHovered(true); setCoffeeDismissed(false); } }}
              onPointerLeave={() => setCoffeeHovered(false)}
              onClick={toggleCoffee}
              {...coffeeFocus}
            />
            {/* Steam drifts continuously; interaction controls only the coffee note. */}
            <svg className="mug-steam" viewBox="0 0 80 90" fill="none" aria-hidden="true">
              <path d="M23 84 C6 63 39 48 23 22" />
              <path d="M42 80 C26 58 58 42 40 6" />
              <path d="M60 84 C43 64 76 49 59 25" />
            </svg>
            <span className="workspace-tooltip workspace-tooltip--mug" id="coffee-tooltip" role="tooltip" hidden={!coffeeVisible}>Fueled by curiosity &amp; coffee ☕</span>
          </div>
        </motion.div>
      </div>
      <WorkspacePanel kind={panel} onClose={() => setPanel(null)} returnFocusRef={openerRef} />
    </div>
  );
}
