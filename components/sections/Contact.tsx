import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Contact() {
  return (
    <section id="contact" className="contact-section section-divider" aria-labelledby="contact-heading">
      <div className="container">
        <Reveal>
          <SectionHeading number="05" title="Let’s connect" id="contact-heading" />
          <div className="contact-content">
            <h3>Have an idea?<br />Let&apos;s make something<br className="contact-line-break" /> <em>good</em> together.</h3>
            <div className="contact-aside">
              <p>{site.contact}</p>
              <div className="contact-actions" aria-label="Ways to connect">
                {site.email && (
                  <a className="contact-button contact-button--email" href={`mailto:${site.email}`}>
                    <Mail size={19} aria-hidden="true" />
                    <span className="contact-button-copy">
                      <strong>Send me an email</strong>
                      <span>{site.email}</span>
                    </span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                )}
                <div className="contact-socials">
                  {site.github && (
                    <a className="contact-social-link" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
                      <GitHubIcon size={18} />
                      <span>GitHub</span>
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  )}
                  {site.linkedin && (
                    <a className="contact-social-link" href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
                      <LinkedInIcon size={18} />
                      <span>LinkedIn</span>
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  )}
                </div>
                {site.phone && (
                  <a className="contact-phone-link" href={`tel:${site.phone}`}>
                    <Phone size={17} aria-hidden="true" />
                    <span>Give me a call</span>
                    <strong>{site.phoneDisplay}</strong>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
                {site.resume && <a className="contact-text-link" href={site.resume} target="_blank" rel="noopener noreferrer">Résumé <ArrowUpRight size={15} aria-hidden="true" /></a>}
              </div>
              <span className="contact-note">Good things start with a conversation.</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
