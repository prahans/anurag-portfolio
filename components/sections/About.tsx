import { Heart, Lightbulb, Sprout, Users } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const traits = [
  { title: "Curious", text: "Always exploring new ideas and technologies.", icon: Lightbulb, tone: "yellow" },
  { title: "Collaborative", text: "I enjoy learning from others and sharing ideas.", icon: Users, tone: "blue" },
  { title: "Problem Solver", text: "I like turning complicated problems into practical solutions.", icon: Sprout, tone: "pink" },
  { title: "Purpose Driven", text: "I want to build things that make a positive difference.", icon: Heart, tone: "peach" },
];

export function About() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <Reveal>
        <SectionHeading number="03" title="About Me" id="about-heading" />
        <div className="about-content">
          <div className="about-copy">
            <p>{site.about}</p>
            <span className="about-note">A curious mind. Fueled by coffee.</span>
          </div>
          <ul className="personality-grid">
            {traits.map(({ title, text, icon: Icon, tone }) => (
              <li className="personality-item" key={title}>
                <span className={`personality-icon personality-icon--${tone}`}><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
