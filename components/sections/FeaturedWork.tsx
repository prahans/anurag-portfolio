import { MoveRight } from "lucide-react";
import { FeaturedProjectsGallery } from "@/components/sections/FeaturedProjectsGallery";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FeaturedWork() {
  return (
    <section id="work" className="featured-work section-divider" aria-labelledby="work-heading">
      <div className="container">
        <Reveal className="work-heading-row">
          <SectionHeading number="02" title="Featured Work" id="work-heading" />
          <MoveRight className="heading-arrow" size={37} strokeWidth={1} aria-hidden="true" />
          <p>A few things I&apos;ve been building, exploring,<br className="desktop-break" /> and learning along the way.</p>
          <span className="work-note">Made with curiosity</span>
        </Reveal>
        <FeaturedProjectsGallery />
      </div>
    </section>
  );
}
