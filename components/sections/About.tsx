import { Heart, Lightbulb, Sprout, Users } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const traits = [
  { title: "Curious", text: "I ask questions and enjoy finding out how things work.", icon: Lightbulb, tone: "yellow" },
  { title: "Collaborative", text: "I value honest feedback and ideas built together.", icon: Users, tone: "blue" },
  { title: "Problem Solver", text: "I break messy challenges into manageable steps.", icon: Sprout, tone: "pink" },
  { title: "People-Minded", text: "I care how the finished product feels to use.", icon: Heart, tone: "peach" },
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
