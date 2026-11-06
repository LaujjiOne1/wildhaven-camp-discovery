import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

/** Letter-by-letter reveal: invisible → blurred ghost → accent → final colour. Colours are CSS colours (theme tokens). */
export type RevealColors = { ghost: string; accent: string; final: string; highlight?: string };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: string, b: string, t: number) => `color-mix(in srgb, ${b} ${Math.round(t * 100)}%, ${a})`;

export const paintChars = (chars: HTMLElement[], p: number, spread: number, c: RevealColors) => {
  const n = chars.length || 1;
  chars.forEach((el, i) => {
    const t = clamp((p * (1 + spread) - i / n) / spread);
    const final = el.dataset.hl ? c.highlight ?? c.final : c.final;
    let color: string, blur: number, op: number;
    if (t < 0.35) { op = t / 0.35; color = c.ghost; blur = 8 - 6.5 * (t / 0.35); }
    else if (t < 0.7) { op = 1; color = mix(c.ghost, c.accent, (t - 0.35) / 0.35); blur = 1.5 * (1 - (t - 0.35) / 0.35); }
    else { op = 1; color = mix(c.accent, final, (t - 0.7) / 0.3); blur = 0; }
    el.style.opacity = String(op);
    el.style.color = color;
    el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
  });
};

/** Lines of segments; a segment may be highlighted. */
export type RevealLine = { text: string; hl?: boolean }[];

export const SplitText = ({ lines, className, style, innerRef }: { lines: RevealLine[]; className?: string; style?: CSSProperties; innerRef: React.Ref<HTMLSpanElement> }) => (
  <span ref={innerRef} className={className} style={style}>
    {lines.map((line, li) => (
      <Fragment key={li}>
        {li > 0 && <><br className="reveal-br" />{" "}</>}
        {line.map((seg, si) => seg.text.split(/(\s+)/).map((word, wi) => word.trim() === "" ? word : (
          <span key={`${si}-${wi}`} className="inline-block whitespace-nowrap">
            {[...word].map((ch, ci) => <span key={ci} data-char="" data-hl={seg.hl ? "1" : undefined}>{ch}</span>)}
          </span>
        )))}
      </Fragment>
    ))}
  </span>
);

/** Time-based reveal on mount. */
export const LoadReveal = ({ lines, colors, duration = 1250, delay = 150, className }: { lines: RevealLine[]; colors: RevealColors; duration?: number; delay?: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const chars = Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-char]") ?? []);
    if (reduced) { paintChars(chars, 1, 0.35, colors); return; }
    let frame = 0; const start = performance.now() + delay;
    const loop = (now: number) => {
      const p = clamp((now - start) / duration);
      paintChars(chars, p, 0.35, colors);
      if (p < 1) frame = requestAnimationFrame(loop);
    };
    paintChars(chars, 0, 0.35, colors);
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [lines, colors, duration, delay, reduced]);
  return <SplitText innerRef={ref} lines={lines} className={className} />;
};
