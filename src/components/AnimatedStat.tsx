import { useState, useEffect, useRef } from "react";

export default function AnimatedStat({
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
