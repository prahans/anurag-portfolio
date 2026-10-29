"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation, site } from "@/data/site";

export function Navbar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const marker = window.innerHeight * 0.33;
      let current = "home";
      let closestTop = -Infinity;
      const destination = window.location.hash.slice(1);
      for (const item of navigation) {
        const section = document.getElementById(item.id);
        if (!section) continue;
        const top = section.getBoundingClientRect().top;
        // About and Skills share a row on desktop; preserve the clicked anchor at a tie.
        if (top <= marker && (top > closestTop + 2 || (Math.abs(top - closestTop) <= 2 && item.id === destination))) {
          current = item.id;
          closestTop = top;
        }
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) current = "contact";
      setActive(current);
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    const media = window.matchMedia("(min-width: 1000px)");
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    media.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <header className="site-header" ref={header}>
      <div className="container header-inner">
        <a className="brand" href="#home" onClick={() => setOpen(false)} aria-label={`${site.name}, home`}>
          <span className="signature">{site.name}<span className="brand-dot" /></span>
          <span className="brand-role">Full-stack<br />developer</span>
        </a>
        <button className="menu-toggle" ref={menuButton} type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav id="primary-navigation" className={`primary-navigation${open ? " is-open" : ""}`} aria-label="Primary navigation" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== menuButton.current) setOpen(false); }}>
          {navigation.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={`nav-link${active === item.id ? " is-active" : ""}`} aria-current={active === item.id ? "location" : undefined} onClick={() => { setActive(item.id); setOpen(false); }}>
              <span>{item.number}.</span> {item.label}
            </a>
          ))}
        </nav>
        <a className="button button-dark header-contact" href="#contact">Let’s Talk <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </header>
  );
}
