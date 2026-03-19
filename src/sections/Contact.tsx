import { motion } from "framer-motion";
import { profile } from "../data/content";
import { reveal } from "../lib/animation";
import SectionHeader from "../components/SectionHeader";

const LINKS = [
  { href: `mailto:${profile.email}`, label: profile.email },
  { href: `https://${profile.github}`, label: profile.github },
  { href: `https://${profile.linkedin}`, label: profile.linkedin },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 pb-32 px-8">
      <div className="max-w-[1140px] mx-auto">
        <motion.div {...reveal}>
          <SectionHeader num="04" label="Contact" />
          <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
            <div>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light font-playfair leading-tight">
                Let's Build Something
                <br />
                <em>Remarkable.</em>
              </h2>
              <p className="text-[15px] text-[#5a5550] mt-5 leading-[1.8]">
                Open to collaborations, consulting, and full-time opportunities
                where AI meets engineering excellence.
              </p>
            </div>
            <div className="space-y-4 pt-2">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between px-6 py-4 border border-[#e2ddd6] hover:border-[#b14a32] group transition-colors"
                >
                  <span className="text-sm text-[#4a4640] group-hover:text-[#b14a32] transition-colors">
                    {link.label}
                  </span>
                  <span className="text-sm text-[#b14a32]">→</span>
                </a>
              ))}
            </div>
          </div>
          <p className="text-xs tracking-[0.12em] text-[#9a938c] mt-16">
            © 2026 {profile.name}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
