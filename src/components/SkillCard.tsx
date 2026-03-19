import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const skillDescriptions: Record<string, string> = {
  "AI/ML Integration":
    "Embedding intelligence into production systems — from fine-tuned models to inference pipelines that run at scale.",
  "LLM Systems & Prompt Engineering":
    "Designing agentic workflows, retrieval-augmented generation, and prompt chains that turn language models into reliable tools.",
  "Full-Stack Architecture":
    "End-to-end system design across frontend, backend, and infrastructure — always optimized for the AI layer.",
  "React & TypeScript":
    "Building type-safe, high-performance interfaces with component-driven architecture and obsessive attention to UX.",
  "Python & FastAPI":
    "Rapid API development with async-first design, powering ML inference endpoints and data-intensive backends.",
  "Real-Time Data Systems":
    "WebSocket streams, event-driven architectures, and sub-millisecond rendering for live dashboards.",
  "Cloud Infrastructure (AWS)":
    "Deploying and orchestrating services across EC2, Lambda, ECS, and S3 with infrastructure-as-code.",
  "Developer Tooling":
    "CLI tools, SDK design, and DX-first libraries that make engineering teams measurably faster.",
};

export default function SkillCard({ skill }: { skill: string }) {
  const [open, setOpen] = useState(false);
  const description = skillDescriptions[skill];

  return (
    <motion.button
      onClick={() => setOpen((v) => !v)}
      className="text-left w-full border transition-colors cursor-pointer"
      animate={{
        borderColor: open ? "#b14a32" : "#ddd6ce",
        backgroundColor: open ? "#faf6f2" : "transparent",
      }}
      transition={{ duration: 0.25 }}
      whileHover={{ borderColor: "#b14a32" }}
    >
      <div className="flex items-center justify-between px-3 py-2.5">
        <span
          className="text-[13px] transition-colors"
          style={{ color: open ? "#b14a32" : "#5a5550" }}
        >
          {skill}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-[#b14a32] ml-2 shrink-0"
        >
          +
        </motion.span>
      </div>
      <AnimatePresence>
        {open && description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-xs leading-[1.7] text-[#7a7470] px-3 pb-3 font-playfair italic">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
