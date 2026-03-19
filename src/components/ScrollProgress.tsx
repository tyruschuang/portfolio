import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
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
