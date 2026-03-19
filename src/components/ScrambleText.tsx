import { useState, useEffect } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#";

export default function ScrambleText({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  const [display, setDisplay] = useState("\u00A0".repeat(text.length));

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1200;
      const start = performance.now();
      let raf: number;

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const resolved = Math.floor(progress * text.length);
        let result = "";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") result += " ";
          else if (i < resolved) result += text[i];
          else if (i < resolved + 4)
            result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          else result += "\u00A0";
        }
        setDisplay(result);
        if (progress < 1) raf = requestAnimationFrame(step);
      };

      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <>{display}</>;
}
