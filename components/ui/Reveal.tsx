"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useAnimate, useInView, useReducedMotion } from "motion/react";

// Server HTML stays visible, so content is also accessible without JavaScript.
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true, amount: 0.12 });
  const reducedMotion = useReducedMotion();
  const played = useRef(false);

  useEffect(() => {
    if (!inView || reducedMotion !== false || played.current) return;
    played.current = true;
    const animation = animate(scope.current, { opacity: [0.35, 1], transform: ["translateY(14px)", "translateY(0px)"] }, { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] });
    return () => animation.complete();
  }, [inView, reducedMotion, animate, delay, scope]);

  return <div ref={scope} className={className}>{children}</div>;
}
