import { ArrowUp, Heart } from "lucide-react";
import { cacheLife } from "next/cache";
import { site } from "@/data/site";

export async function Footer() {
  "use cache";
  cacheLife("hours");

  const year = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Kathmandu" }).format(new Date());

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-identity"><a href="#home">{site.name}<span aria-hidden="true">.</span></a><span>{site.role}</span></div>
        <p className="footer-location">Made with care <Heart size={12} aria-hidden="true" /> Based in {site.location}</p>
        <div className="footer-end"><span>© {year}</span><a className="back-to-top" href="#home" aria-label="Back to top"><ArrowUp size={18} aria-hidden="true" /></a></div>
      </div>
    </footer>
  );
}
