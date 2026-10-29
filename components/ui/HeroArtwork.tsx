import Image from "next/image";
import { Check, Heart, Mountain } from "lucide-react";
import { site } from "@/data/site";

// Replace site.heroCharacterSrc to change the illustration without touching the layout.
// Photograph, notes, window light, and annotations are independent layers.
export function HeroArtwork() {
  return (
    <div className="hero-artwork">
      <div className="workspace-light" aria-hidden="true"><span /><span /><span /><span /></div>
      <figure className="mountain-print">
        <Image src={site.mountainImageSrc} alt="Snow-covered Himalayan mountains in Nepal" width={300} height={210} sizes="(max-width: 600px) 120px, 175px" />
        <figcaption>Mountains recharge me <Mountain size={22} strokeWidth={1.2} aria-hidden="true" /></figcaption>
      </figure>
      <div className="art-note art-note-left" aria-hidden="true">Good software.<br />Brighter days.<span>:)</span>
        <svg viewBox="0 0 80 65"><path d="M8 7 C-2 43 39 52 65 30 M49 32 L66 28 L63 45" /></svg>
      </div>
      <div className="workspace-note" aria-hidden="true">
        <span className="note-tape" />
        <p>A little reminder</p>
        <span><Check /> Build useful things</span>
        <span><Check /> Learn something new</span>
        <span><Check /> Stay curious</span>
        <span><Check /> Make a little difference <Heart /></span>
      </div>
      <div className="character-slot">
        <Image src={site.heroCharacterSrc} alt={site.heroCharacterAlt} fill sizes="(max-width: 600px) 100vw, (max-width: 999px) 80vw, 720px" loading="eager" fetchPriority="high" className="character-image" />
      </div>
      <div className="art-note art-note-right" aria-hidden="true">A little curiosity.<br />A lot of possibilities.<svg viewBox="0 0 72 70"><path d="M61 7 C76 46 44 63 14 46 M16 61 L12 44 L29 43" /></svg></div>
      <span className="artwork-caption">MADE OF CURIOSITY &amp; A LITTLE COFFEE</span>
    </div>
  );
}
