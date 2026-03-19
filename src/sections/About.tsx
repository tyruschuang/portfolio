import { motion } from "framer-motion";
import { profile, skills } from "../data/content";
import { ease, reveal } from "../lib/animation";
import SectionHeader from "../components/SectionHeader";
import SkillCard from "../components/SkillCard";

const PHILOSOPHY = [
  {
    num: "i.",
    title: "AI as Collaborator",
    text: "I treat AI tooling as a team member, not a toy. From architecture to deployment, AI-native workflows let me ship at a pace that would've been impossible three years ago.",
  },
  {
    num: "ii.",
    title: "Craft Over Speed",
    text: "Moving fast matters, but never at the expense of code that reads well, scales gracefully, and doesn't wake anyone up at 3am.",
  },
  {
    num: "iii.",
    title: "Human Problems First",
    text: "Every line of code exists to serve a person. I start with the human need, work backwards to the architecture, and let the technology be invisible.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-8">
      <div className="max-w-[1140px] mx-auto">
        <motion.div {...reveal}>
          <SectionHeader num="01" label="About" />

          <blockquote className="text-[clamp(1.6rem,3.5vw,2.6rem)] font-light leading-[1.35] font-playfair italic text-[#1a1816] max-w-3xl">
            "The best engineering disappears into the experience —{" "}
            <span className="not-italic text-[#b14a32]">
              you just notice that everything works.
            </span>
            "
          </blockquote>

          <div className="grid md:grid-cols-[1.4fr_1fr] gap-16 mt-14">
            <div className="space-y-5">
              <p className="text-[15px] leading-[2] text-[#4a4640]">
                I fell into engineering the way most people do — by being too
                curious to stop. What started as tinkering with websites in
                college became an obsession with building things that make
                people's lives a little easier, a little faster, a little more
                magical.
              </p>
              <p className="text-[15px] leading-[2] text-[#4a4640]">
                These days, I'm focused on the intersection where AI stops being
                a buzzword and starts being genuinely useful. I've spent the last
                five years shipping products that use machine intelligence as a
                core primitive — not a checkbox feature. From LLM-powered
                workflow engines to real-time analytics dashboards that
                understand plain English, I build software that thinks.
              </p>
              <p className="text-[15px] leading-[2] text-[#6a6460] italic font-playfair">
                When I'm not shipping code, I'm probably reading about cognitive
                science, experimenting with generative art, or trying to
                convince my friends that the future is going to be weirder and
                more wonderful than anyone expects.
              </p>
            </div>

            <div className="space-y-6 md:border-l md:border-[#e8e3dc] md:pl-10">
              <div>
                <p className="text-xs tracking-[0.18em] uppercase text-[#9a938c] mb-1.5">
                  Currently
                </p>
                <p className="text-[15px] text-[#1a1816] font-medium">
                  Lead AI Engineer @ Nexus Labs
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.18em] uppercase text-[#9a938c] mb-1.5">
                  Based in
                </p>
                <p className="text-[15px] text-[#1a1816]">
                  {profile.location}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.18em] uppercase text-[#9a938c] mb-1.5">
                  Focus
                </p>
                <p className="text-[15px] text-[#1a1816]">
                  AI-Native Systems & Full-Stack Architecture
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-20">
            {PHILOSOPHY.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease }}
                className="p-7 border border-[#e8e3dc] hover:border-[#b14a32] transition-colors group"
              >
                <span className="text-sm text-[#b14a32] font-playfair italic">
                  {card.num}
                </span>
                <h4 className="text-base font-medium font-playfair mt-3 group-hover:text-[#b14a32] transition-colors">
                  {card.title}
                </h4>
                <p className="text-sm leading-[1.8] text-[#6a6460] mt-3">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20">
            <p className="text-xs tracking-[0.18em] uppercase text-[#7a7470] mb-4">
              Expertise
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {skills.map((skill) => (
                <SkillCard key={skill} skill={skill} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
