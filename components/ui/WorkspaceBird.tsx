"use client";

import { useEffect, useRef } from "react";
import { WorkspaceBirdIllustration } from "./WorkspaceBirdIllustration";
import { animateWorkspaceBird } from "./workspace-bird-motion";

/** The SVG shares the artwork's source coordinates, including its perch. */
export function WorkspaceBird() {
  const layerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const motionAllowed = window.matchMedia("(min-width: 600px) and (prefers-reduced-motion: no-preference)");
    let animations: Animation[] = [];
    let inView = false;

    const updatePlayback = () => {
      for (const animation of animations) {
        if (inView && !document.hidden) animation.play();
        else animation.pause();
      }
    };
    const configure = () => {
      animations.forEach((animation) => animation.cancel());
      animations = motionAllowed.matches ? animateWorkspaceBird(layer) : [];
      updatePlayback();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(layer);
    configure();
    motionAllowed.addEventListener("change", configure);
    document.addEventListener("visibilitychange", updatePlayback);

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      motionAllowed.removeEventListener("change", configure);
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, []);

  return (
    <svg ref={layerRef} className="workspace-bird-layer" viewBox="0 0 1109 684" aria-hidden="true" focusable="false">
      <ellipse className="workspace-bird-shadow" cx="640" cy="258.6" rx="12" ry="1.6" transform="rotate(-3.3 640 258.6)" fill="#352c23" />
      <g className="workspace-bird" aria-hidden="true">
        <g className="workspace-bird-scale">
          <g className="workspace-bird-pose">
            <g className="workspace-bird-bob">
              <WorkspaceBirdIllustration />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
