import { motion } from "framer-motion";
import { projects } from "../data/content";
import { ease, reveal } from "../lib/animation";
import SectionHeader from "../components/SectionHeader";
import TiltCard from "../components/TiltCard";

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-8">
      <div className="max-w-[1140px] mx-auto">
        <motion.div {...reveal}>
          <SectionHeader num="03" label="Projects" />
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((project, i) => (
              <TiltCard key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease }}
                  className="group p-8 bg-white border border-[#e8e3dc] hover:border-[#b14a32] transition-colors relative overflow-hidden h-full"
                >
                  <span
                    className="absolute top-4 right-5 text-[36px] font-playfair font-light text-[#ede8e1] leading-none pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#b14a32] mb-3 relative">
                    {project.category}
                  </p>
                  <h3 className="text-[20px] font-medium font-playfair group-hover:text-[#b14a32] transition-colors relative">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-[1.8] text-[#4a4640] mt-4 relative">
                    {project.description}
                  </p>
                  <p className="text-sm font-medium text-[#1a1816] mt-4 font-playfair italic relative">
                    "{project.result}"
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-[#f0ebe4] relative">
                    {project.stack.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2.5 py-0.5 bg-[#f8f5f0] text-[#6a6460]"
                        style={{ borderRadius: "3px" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 text-[13px] tracking-[0.06em] uppercase font-semibold text-[#b14a32] relative group/link"
                  >
                    <span className="border-b border-transparent group-hover/link:border-[#b14a32] transition-colors pb-0.5">
                      {project.linkLabel ?? "View Project"}
                    </span>
                    <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1">
                      →
                    </span>
                  </a>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
