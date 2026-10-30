"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";

// Fixed source-image coordinates keep the dust in the window light, clear of
// the laptop screen, notes and mug. Negative delays start a settled atmosphere.
const motes = [
  {
    x: 966,
    y: 128,
    radius: 6.4,
    tone: "gold",
    duration: 11.3,
    delay: -1.8,
    sway: -5,
    drift: 9,
    rise: -34,
    opacity: 0.86,
  },
  {
    x: 973,
    y: 285,
    radius: 7.2,
    tone: "cream",
    duration: 13.7,
    delay: -7.2,
    sway: 7,
    drift: -10,
    rise: -36,
    opacity: 0.9,
  },
  {
    x: 1030,
    y: 321,
    radius: 5.8,
    tone: "gold",
    duration: 9.8,
    delay: -4.3,
    sway: -6,
    drift: 8,
    rise: -28,
    opacity: 0.82,
  },
  {
    x: 1072,
    y: 494,
    radius: 6.8,
    tone: "cream",
    duration: 14.6,
    delay: -11.6,
    sway: 5,
    drift: -7,
    rise: -32,
    opacity: 0.86,
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
          <stop offset="0" stopColor="#bd873f" />
          <stop offset=".28" stopColor="#bd873f" />
          <stop offset=".45" stopColor="#e4b76d" stopOpacity=".9" />
          <stop offset=".7" stopColor="#fff1c9" stopOpacity=".3" />
          <stop offset="1" stopColor="#fff1c9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${gradientId}-cream`}>
          <stop offset="0" stopColor="#c18b3b" />
          <stop offset=".3" stopColor="#c18b3b" />
          <stop offset=".45" stopColor="#e8c384" stopOpacity=".9" />
          <stop offset=".7" stopColor="#fff6db" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff6db" stopOpacity="0" />
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
