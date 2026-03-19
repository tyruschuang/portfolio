import { motion } from "framer-motion";
import { experience } from "../data/content";
import { ease, reveal } from "../lib/animation";
import SectionHeader from "../components/SectionHeader";

export default function Work() {
  return (
    <section id="work" className="py-20 px-8">
      <div className="max-w-[1140px] mx-auto">
        <motion.div {...reveal}>
          <SectionHeader num="02" label="Experience" />
          <div>
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease }}
                className="group grid md:grid-cols-[100px_1fr_auto] gap-4 py-8 border-b border-[#e8e3dc] last:border-0 hover:bg-[#f2ede6] transition-colors px-4 -mx-4 items-start"
              >
                <span className="text-sm text-[#b14a32] font-medium font-playfair pt-1">
                  {exp.year}
                </span>
                <div>
                  <h3 className="text-[17px] font-medium font-playfair">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-[#7a7470] mt-0.5">
                    {exp.company}
                  </p>
                  <p className="text-sm leading-[1.8] text-[#4a4640] mt-2">
                    {exp.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end pt-1">
                  {exp.stack.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2.5 py-0.5 bg-[#ece7e0] text-[#5a5550]"
                      style={{ borderRadius: "3px" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
