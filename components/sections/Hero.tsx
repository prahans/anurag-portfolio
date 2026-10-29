import { ArrowDownRight, ArrowUpRight, Code2, Globe2, Sprout } from "lucide-react";
import { HeroArtwork } from "@/components/ui/HeroArtwork";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section id="home" className="hero-section" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div className="hero-copy">
          <Reveal><p className="hero-greeting"><span aria-hidden="true">👋</span> {site.greeting}</p></Reveal>
          <h1 id="hero-heading" className="hero-heading">
            <span className="headline-line">I build digital</span>{" "}
            <span className="headline-line headline-expressive"><em>experiences</em>{" "}<span className="headline-bridge">that make</span></span>{" "}
            <span className="headline-line headline-small">life a little <span className="underline-word">better.<svg viewBox="0 0 240 16" aria-hidden="true"><path d="M3 12 Q110 0 237 9" /></svg></span></span>
          </h1>
          <Reveal delay={0.12}><p className="hero-description">{site.introduction}</p></Reveal>
          <Reveal delay={0.18} className="hero-actions">
            <a className="button button-dark" href="#work">Explore My Work <ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="button button-text" href="#about">More About Me <ArrowDownRight size={17} aria-hidden="true" /></a>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="hero-highlights" aria-label="A little about me">
              <li><Code2 size={22} strokeWidth={1.6} aria-hidden="true" /><span>Full-stack<br />development</span></li>
              <li><Sprout size={23} strokeWidth={1.6} aria-hidden="true" /><span>Always<br />learning</span></li>
              <li><Globe2 size={24} strokeWidth={1.6} aria-hidden="true" /><span>Based in<br /><strong>Nepal <span aria-label="Nepal flag">🇳🇵</span></strong></span></li>
            </ul>
          </Reveal>
        </div>
        <Reveal className="hero-art-reveal" delay={0.1}><HeroArtwork /></Reveal>
      </div>
    </section>
  );
}
