import { useEffect, useRef } from "react";
import { fbm } from "../lib/noise";

const PUSH_STRENGTH = 55;
const SIGMA = 160;
const TWO_SIGMA_SQ = 2 * SIGMA * SIGMA;

export default function FlowFieldArt({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothMouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w: number, h: number;
    let animId: number;
    let canvasRect = { left: 0, top: 0 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rect = canvas.getBoundingClientRect();
      canvasRect = { left: rect.left, top: rect.top };
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX - canvasRect.left;
      mouseRef.current.y = e.clientY - canvasRect.top;
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.0015;

      const lerp = 0.18;
      smoothMouse.current.x +=
        (mouseRef.current.x - smoothMouse.current.x) * lerp;
      smoothMouse.current.y +=
        (mouseRef.current.y - smoothMouse.current.y) * lerp;
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
