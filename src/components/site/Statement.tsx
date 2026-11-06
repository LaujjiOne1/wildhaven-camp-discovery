import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { BowlGlow } from "./BowlGlow";
import { SplitText, paintChars, type RevealLine } from "./LetterReveal";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** Pinned statement: the bowl glow floods the screen and the text reveals letter by letter while scrolling. */
export const Statement = ({ lines }: { lines: RevealLine[] }) => {
  const section = useRef<HTMLElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const progress = useCallback(() => {
    const el = section.current; if (!el) return 0;
    return Math.max(0, -el.getBoundingClientRect().top / window.innerHeight + .3);
  }, []);
  useEffect(() => {
    const chars = Array.from(text.current?.querySelectorAll<HTMLElement>("[data-char]") ?? []);
    const colors = { ghost: "hsl(var(--background))", accent: "hsl(var(--violet))", final: "hsl(var(--primary-dark))", highlight: "hsl(var(--primary))" };
    const update = () => {
      const q = progress();
      if (reduced) { paintChars(chars, 1, .16, colors); if (text.current) text.current.style.transform = "none"; return; }
      const s = clamp((q - .35) / .6);
      if (text.current) text.current.style.transform = `translateY(${(.2 * (1 - s) ** 2 * window.innerHeight).toFixed(1)}px)`;
      paintChars(chars, clamp((q - .3) / 1.3), .16, colors);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [progress, reduced, lines]);
  return (
    <section ref={section} aria-label={lines.map((l) => l.map((s) => s.text).join("")).join(" ")} className="relative h-[240vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <BowlGlow progress={progress} />
        <div className="container relative flex h-full items-center justify-center">
          <p aria-hidden="true" className="statement-text max-w-4xl text-center font-display text-[clamp(22px,3vw,44px)] font-medium leading-[1.16] tracking-tight will-change-transform">
            <SplitText innerRef={text} lines={lines} />
          </p>
        </div>
      </div>
    </section>
  );
};
