import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "../data/content";
import { ease } from "../lib/animation";

const NAV_ITEMS = [
  { label: "About", num: "01" },
  { label: "Work", num: "02" },
  { label: "Projects", num: "03" },
  { label: "Contact", num: "04" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#f8f5f0]/90 backdrop-blur-md">
        <div className="max-w-[1140px] mx-auto flex items-center justify-between px-8 h-16">
          <a
            href="#home"
            className="text-[17px] tracking-tight font-playfair font-medium"
          >
            {profile.name}
          </a>
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((n) => (
              <a
                key={n.label}
                href={`#${n.label.toLowerCase()}`}
                className="flex items-baseline gap-2 text-sm text-[#635e5a] hover:text-[#1a1816] transition-colors"
              >
                <span className="text-xs text-[#b14a32]">{n.num}</span>
                {n.label}
              </a>
            ))}
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
          >
            <span
              className={`block w-5 h-[1.5px] bg-[#1a1816] transition-all ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-[#1a1816] transition-all ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`}
            />
          </button>
        </div>
        <div className="border-b border-[#e8e3dc]" />
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease }}
            className="fixed inset-0 z-40 bg-[#f8f5f0] flex flex-col items-center justify-center"
          >
            {NAV_ITEMS.map((n, i) => (
              <motion.a
                key={n.label}
                href={`#${n.label.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, ease }}
                className="text-3xl font-playfair font-medium text-[#1a1816] py-4 hover:text-[#b14a32] transition-colors"
              >
                {n.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
