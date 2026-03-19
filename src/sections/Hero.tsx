import { useRef } from "react";
import { motion } from "framer-motion";
import { profile, stats } from "../data/content";
import { ease } from "../lib/animation";
import FlowFieldArt from "../components/FlowFieldArt";
import ScrambleText from "../components/ScrambleText";
import AnimatedStat from "../components/AnimatedStat";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      id="home"
      className="h-screen flex flex-col justify-end px-8 pb-12 relative overflow-hidden"
    >
      <FlowFieldArt sectionRef={heroRef} />

      <div className="max-w-[1140px] mx-auto w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
        >
          <p className="text-sm tracking-[0.2em] uppercase font-medium mb-5">
            <span className="text-[#1a1816]">{profile.name}</span>
            <span className="text-[#b14a32] mx-2">—</span>
            <span className="text-[#b14a32]">{profile.title}</span>
          </p>
          <h1 className="text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.92] tracking-tight font-playfair">
            <ScrambleText text="Engineering" delay={600} />
            <br />
            <em className="font-normal">
              <ScrambleText text="Intelligence." delay={1000} />
            </em>
          </h1>
          <div className="grid md:grid-cols-[1fr_1fr] gap-8 mt-8 items-end">
            <p className="text-base text-[#5a5550] max-w-md leading-[1.8]">
              {profile.tagline}
            </p>
            <div className="flex gap-4 md:justify-end items-center">
              <a
                href="#contact"
                className="text-[14px] tracking-[0.1em] uppercase font-semibold bg-[#b14a32] text-white px-7 py-3.5 hover:bg-[#943d28] active:scale-[0.97] transition-all duration-200 shadow-[0_2px_12px_rgba(177,74,50,0.35)] hover:shadow-[0_4px_20px_rgba(177,74,50,0.5)]"
              >
                Get in Touch
              </a>
              <a
                href="#projects"
                className="text-[14px] tracking-[0.1em] uppercase font-medium text-[#1a1816] border border-[#d0c9c0] px-6 py-3 hover:border-[#b14a32] hover:text-[#b14a32] transition-all duration-200 group"
              >
                View Work{" "}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-[#e2ddd6]">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5, ease }}
              >
                <AnimatedStat
                  value={stat.value}
                  delay={(0.6 + i * 0.1 + 0.5) * 1000}
                  className="text-[clamp(1.5rem,3vw,2.2rem)] font-light font-playfair text-[#1a1816]"
                />
                <p className="text-xs tracking-[0.1em] uppercase text-[#7a7470] mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
