import { useEffect, useRef } from "react";

export default function MagneticCursor() {
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
