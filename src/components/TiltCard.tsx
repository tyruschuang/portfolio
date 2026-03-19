import { useRef } from "react";

const isCoarsePointer =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

export default function TiltCard({
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
