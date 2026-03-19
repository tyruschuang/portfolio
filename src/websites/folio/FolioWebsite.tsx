import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  profile,
  experience,
  projects,
  skills,
  stats,
} from "../../data/content";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Generative flow field art ── */

function noiseHash(n: number): number {
  const s = Math.sin(n) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const n = ix + iy * 131;
  const a = noiseHash(n);
  const b = noiseHash(n + 1);
  const c = noiseHash(n + 131);
  const d = noiseHash(n + 132);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x: number, y: number): number {
  let val = 0,
    amp = 0.5;
  for (let o = 0; o < 5; o++) {
    val += amp * valueNoise(x, y);
    x *= 2;
    y *= 2;
    amp *= 0.5;
  }
  return val;
}

function FlowFieldArt({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clientMouse = useRef({ x: -9999, y: -9999, active: false });
  const smoothMouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w: number, h: number;
    let animId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      clientMouse.current.x = e.clientX;
      clientMouse.current.y = e.clientY;
      clientMouse.current.active = true;
    };
    const handleMouseLeave = () => {
      clientMouse.current.active = false;
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;
    const PUSH_STRENGTH = 55;
    const SIGMA = 160;
    const TWO_SIGMA_SQ = 2 * SIGMA * SIGMA;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.0015;

      let targetX = -9999;
      let targetY = -9999;
      if (clientMouse.current.active) {
        const rect = canvas.getBoundingClientRect();
        targetX = clientMouse.current.x - rect.left;
        targetY = clientMouse.current.y - rect.top;
      }

      const lerp = 0.18;
      smoothMouse.current.x +=
        (targetX - smoothMouse.current.x) * lerp;
      smoothMouse.current.y +=
        (targetY - smoothMouse.current.y) * lerp;
      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;
      const cursorActive = mx > -5000;

      const lines = 55;
      const step = 3;

      for (let i = 0; i < lines; i++) {
        const t = i / lines;
        const baseY = t * h * 1.3 - h * 0.15;
        const life = Math.sin(t * Math.PI);

        const hue = i % 4;
        let color: string;
        if (hue === 0) color = `rgba(177,74,50,${life * 0.24})`;
        else if (hue === 1) color = `rgba(160,110,85,${life * 0.18})`;
        else if (hue === 2) color = `rgba(177,74,50,${life * 0.11})`;
        else color = `rgba(140,120,105,${life * 0.15})`;

        ctx.strokeStyle = color;
        ctx.lineWidth = hue === 0 ? 1.2 : 0.8;
        ctx.beginPath();

        const points: [number, number][] = [];
        for (let x = 0; x <= w; x += step) {
          const nx = (x / w) * 3.5;
          const ny = i * 0.18;
          const n = fbm(nx + time, ny + time * 0.25);
          const amp = h * 0.1 * (1 + life * 0.5);
          let py = baseY + (n - 0.5) * amp * 2;

          if (cursorActive) {
            const dx = x - mx;
            const dy = py - my;
            const distSq = dx * dx + dy * dy;
            const force = PUSH_STRENGTH * Math.exp(-distSq / TWO_SIGMA_SQ);
            const angle = Math.atan2(dy, dx);
            py += Math.sin(angle) * force;
          }

          points.push([x, py]);
        }

        if (points.length < 2) continue;
        ctx.moveTo(points[0][0], points[0][1]);
        for (let j = 1; j < points.length - 1; j++) {
          const cpx = (points[j][0] + points[j + 1][0]) / 2;
          const cpy = (points[j][1] + points[j + 1][1]) / 2;
          ctx.quadraticCurveTo(points[j][0], points[j][1], cpx, cpy);
        }
        const last = points[points.length - 1];
        ctx.lineTo(last[0], last[1]);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ── Magnetic cursor ── */

function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mouse = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let hovering = false;
    let visible = false;
    let initialized = false;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!initialized) {
        smooth.x = mouse.x;
        smooth.y = mouse.y;
        initialized = true;
      }
      visible = true;
    };
    const onOver = (e: MouseEvent) => {
      hovering = !!(e.target as HTMLElement).closest("a, button, [data-hover]");
    };
    const onDocLeave = () => {
      visible = false;
    };
    const onDocEnter = () => {
      visible = true;
    };

    const animate = () => {
      smooth.x += (mouse.x - smooth.x) * 0.12;
      smooth.y += (mouse.y - smooth.y) * 0.12;

      dot.style.left = `${mouse.x}px`;
      dot.style.top = `${mouse.y}px`;
      dot.style.opacity = visible && !hovering ? "1" : "0";

      ring.style.left = `${smooth.x}px`;
      ring.style.top = `${smooth.y}px`;
      ring.style.transform = `translate(-50%, -50%) scale(${hovering ? 2.2 : 1})`;
      ring.style.opacity = visible ? (hovering ? "0.7" : "0.35") : "0";
      ring.style.borderColor = hovering ? "#b14a32" : "rgba(26,24,22,0.5)";

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onDocLeave);
    document.addEventListener("mouseenter", onDocEnter);
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onDocLeave);
      document.removeEventListener("mouseenter", onDocEnter);
    };
  }, []);

  return (
    <>
      <style>{`@media(pointer:fine){.folio-root,.folio-root *{cursor:none!important}}html{scrollbar-width:none;-ms-overflow-style:none}html::-webkit-scrollbar{display:none}`}</style>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          backgroundColor: "#1a1816",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transform: "translate(-50%, -50%)",
          transition: "opacity 0.15s",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          border: "1.5px solid rgba(26,24,22,0.5)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: 0,
          transform: "translate(-50%, -50%)",
          transition:
            "transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.15s, border-color 0.3s",
        }}
      />
    </>
  );
}

/* ── Text scramble reveal ── */

const SCRAMBLE_GLYPHS = "!<>-_\\/[]{}—=+*^?#";

function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState("\u00A0".repeat(text.length));

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let raf: number;

    timeout = setTimeout(() => {
      const duration = 1200;
      const start = performance.now();

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const resolved = Math.floor(progress * text.length);
        let result = "";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") result += " ";
          else if (i < resolved) result += text[i];
          else if (i < resolved + 4)
            result += SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
          else result += "\u00A0";
        }
        setDisplay(result);
        if (progress < 1) raf = requestAnimationFrame(step);
      };

      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  return <>{display}</>;
}

/* ── Animated counter ── */

function AnimatedStat({
  value,
  className,
  delay = 0,
}: {
  value: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState("0");
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const match = value.match(/^([\d.]+)(.*)$/);
          if (!match) {
            setDisplay(value);
            return;
          }

          const target = parseFloat(match[1]);
          const suffix = match[2];
          const isFloat = match[1].includes(".");
          const duration = 1800;

          const timeout = setTimeout(() => {
            const start = performance.now();
            const step = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = eased * target;
              setDisplay(
                (isFloat ? current.toFixed(1) : String(Math.floor(current))) +
                  suffix,
              );
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }, delay);

          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <p ref={ref} className={className}>
      {display}
    </p>
  );
}

/* ── 3D tilt card ── */

const isCoarsePointer =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || isCoarsePointer) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transition = "box-shadow 0.15s ease";
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    el.style.boxShadow = `${-x * 20}px ${y * 20}px 40px rgba(0,0,0,0.08)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition =
      "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease";
    el.style.transform =
      "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.boxShadow = "none";
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}

/* ── Scroll progress ── */

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const progress =
        document.documentElement.scrollHeight - window.innerHeight > 0
          ? window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)
          : 0;
      if (barRef.current) barRef.current.style.transform = `scaleY(${progress})`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 right-0 w-[4px] h-full z-50 pointer-events-none">
      <div
        ref={barRef}
        className="w-full h-full bg-[#b14a32] origin-top"
        style={{ transform: "scaleY(0)" }}
      />
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" } as const,
  transition: { duration: 0.7, ease },
};

const skillFlavor: Record<string, string> = {
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

function SkillCard({ skill }: { skill: string }) {
  const [open, setOpen] = useState(false);
  const flavor = skillFlavor[skill];

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
        {open && flavor && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-xs leading-[1.7] text-[#7a7470] px-3 pb-3 font-playfair italic">
              {flavor}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function SectionHeader({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-5 mb-10">
      <span className="text-base text-[#b14a32] font-medium font-playfair">
        {num}
      </span>
      <div className="flex-1 border-t border-[#e2ddd6]" />
      <span className="text-xs tracking-[0.18em] uppercase text-[#7a7470]">
        {label}
      </span>
    </div>
  );
}

const NAV = [
  { label: "About", num: "01" },
  { label: "Work", num: "02" },
  { label: "Projects", num: "03" },
  { label: "Contact", num: "04" },
];

export default function FolioWebsite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  return (
    <div className="folio-root min-h-screen bg-[#f8f5f0] text-[#1a1816] font-outfit selection:bg-[#b14a32] selection:text-white">
      <MagneticCursor />
      <ScrollProgress />

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#f8f5f0]/90 backdrop-blur-md">
        <div className="max-w-[1140px] mx-auto flex items-center justify-between px-8 h-16">
          <a
            href="#home"
            className="text-[17px] tracking-tight font-playfair font-medium"
          >
            {profile.name}
          </a>
          <div className="hidden md:flex items-center gap-10">
            {NAV.map((n) => (
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

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease }}
            className="fixed inset-0 z-40 bg-[#f8f5f0] flex flex-col items-center justify-center"
          >
            {NAV.map((n, i) => (
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

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        id="home"
        className="h-screen flex flex-col justify-end px-8 pb-12 relative overflow-hidden"
      >
        {/* Generative flow field */}
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
              <div className="flex gap-6 md:justify-end items-end">
                <a
                  href="#contact"
                  className="text-[15px] tracking-[0.08em] uppercase text-[#1a1816] border-b-2 border-[#1a1816] pb-1.5 hover:border-[#b14a32] hover:text-[#b14a32] transition-colors font-medium"
                >
                  Get in Touch
                </a>
                <a
                  href="#projects"
                  className="text-[15px] tracking-[0.08em] uppercase text-[#5a5550] hover:text-[#1a1816] transition-colors"
                >
                  View Work →
                </a>
              </div>
            </div>

            {/* Inline stats strip */}
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

      {/* ── About ── */}
      <section id="about" className="py-24 px-8">
        <div className="max-w-[1140px] mx-auto">
          <motion.div {...reveal}>
            <SectionHeader num="01" label="About" />

            {/* Pull quote — full width */}
            <blockquote className="text-[clamp(1.6rem,3.5vw,2.6rem)] font-light leading-[1.35] font-playfair italic text-[#1a1816] max-w-3xl">
              "The best engineering disappears into the experience —{" "}
              <span className="not-italic text-[#b14a32]">
                you just notice that everything works.
              </span>
              "
            </blockquote>

            {/* Bio + sidebar */}
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
                  These days, I'm focused on the intersection where AI stops
                  being a buzzword and starts being genuinely useful. I've spent
                  the last five years shipping products that use machine
                  intelligence as a core primitive — not a checkbox feature. From
                  LLM-powered workflow engines to real-time analytics dashboards
                  that understand plain English, I build software that thinks.
                </p>
                <p className="text-[15px] leading-[2] text-[#6a6460] italic font-playfair">
                  When I'm not shipping code, I'm probably reading about
                  cognitive science, experimenting with generative art, or trying
                  to convince my friends that the future is going to be weirder
                  and more wonderful than anyone expects.
                </p>
              </div>

              {/* Sidebar quick facts */}
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

            {/* Approach philosophy cards */}
            <div className="grid md:grid-cols-3 gap-5 mt-20">
              {[
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
              ].map((card, i) => (
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

            {/* Expertise grid */}
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

      {/* ── Work ── */}
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

      {/* ── Projects ── */}
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
                  </motion.div>
                </TiltCard>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact ── */}
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
                  Open to collaborations, consulting, and full-time
                  opportunities where AI meets engineering excellence.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center justify-between px-6 py-4 border border-[#e2ddd6] hover:border-[#b14a32] group transition-colors"
                >
                  <span className="text-sm text-[#4a4640] group-hover:text-[#b14a32] transition-colors">
                    {profile.email}
                  </span>
                  <span className="text-sm text-[#b14a32]">→</span>
                </a>
                <a
                  href={`https://${profile.github}`}
                  className="flex items-center justify-between px-6 py-4 border border-[#e2ddd6] hover:border-[#b14a32] group transition-colors"
                >
                  <span className="text-sm text-[#4a4640] group-hover:text-[#b14a32] transition-colors">
                    {profile.github}
                  </span>
                  <span className="text-sm text-[#b14a32]">→</span>
                </a>
                <a
                  href={`https://${profile.linkedin}`}
                  className="flex items-center justify-between px-6 py-4 border border-[#e2ddd6] hover:border-[#b14a32] group transition-colors"
                >
                  <span className="text-sm text-[#4a4640] group-hover:text-[#b14a32] transition-colors">
                    {profile.linkedin}
                  </span>
                  <span className="text-sm text-[#b14a32]">→</span>
                </a>
              </div>
            </div>
            <p className="text-xs tracking-[0.12em] text-[#9a938c] mt-16">
              © 2026 {profile.name}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
