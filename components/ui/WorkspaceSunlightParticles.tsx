"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";

// Fixed source-image coordinates keep the dust in the window light, clear of
// the laptop screen, notes and mug. Negative delays start a settled atmosphere.
const motes = [
  {
    x: 966,
    y: 128,
    radius: 3.1,
    tone: "gold",
    duration: 11.3,
    delay: -3.6,
    sway: -3,
    drift: 5,
    rise: -23,
    opacity: 0.62,
  },
  {
    x: 902,
    y: 310,
    radius: 3.7,
    tone: "cream",
    duration: 13.7,
    delay: -9.4,
    sway: 4,
    drift: -6,
    rise: -18,
    opacity: 0.68,
  },
  {
    x: 738,
    y: 226,
    radius: 2.6,
    tone: "cream",
    duration: 9.8,
    delay: -1.7,
    sway: -2,
    drift: 7,
    rise: -14,
    opacity: 0.54,
  },
  {
    x: 960,
    y: 575,
    radius: 3.3,
    tone: "gold",
    duration: 14.6,
    delay: -6.5,
    sway: -5,
    drift: -3,
    rise: -21,
    opacity: 0.58,
  },
] as const;

/** Four sunlit dust motes; CSS owns all movement, independently of the bulb. */
export function WorkspaceSunlightParticles() {
  const gradientId = useId();
  const layerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let inView = true;
    const updatePlayback = () => {
      layer.dataset.paused = String(!inView || document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(layer);
    updatePlayback();
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, []);

  return (
    <svg
      ref={layerRef}
      className="workspace-sunlight-particles"
      viewBox="0 0 1109 684"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${gradientId}-gold`}>
          <stop offset="0" stopColor="#fff1c9" />
          <stop offset=".25" stopColor="#f4c76b" stopOpacity=".8" />
          <stop offset="1" stopColor="#e8b96d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gradientId}-cream`}>
          <stop offset="0" stopColor="#fff9e5" />
          <stop offset=".3" stopColor="#fff1c9" stopOpacity=".85" />
          <stop offset="1" stopColor="#f4c76b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {motes.map((mote) => (
        <circle
          key={mote.x}
          className="workspace-sunlight-particle"
          cx={mote.x}
          cy={mote.y}
          r={mote.radius}
          fill={`url(#${gradientId}-${mote.tone})`}
          style={
            {
              "--dust-duration": `${mote.duration}s`,
              "--dust-delay": `${mote.delay}s`,
              "--dust-sway": `${mote.sway}px`,
              "--dust-drift": `${mote.drift}px`,
              "--dust-rise": `${mote.rise}px`,
              "--dust-opacity": mote.opacity,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  );
}
