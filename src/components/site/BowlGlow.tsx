import { useEffect, useRef } from "react";

/** Soft bowl-shaped glow drawn on a tiny canvas and upscaled. Colours come from theme tokens. `progress` returns 0..~1.8 (screens scrolled). */
const KEYS = [0, .03, .08, .18, .40, .66, .87, 1.15, 1.43, 1.8];
const TIP = [.30, .45, .65, .80, .95, 1.05, 1.05, 1.10, 1.30, 2.40];
const HALF = [.34, .38, .38, .38, .38, .46, .66, .90, 1.60, 3.00];
const SOFT = [.22, .26, .22, .22, .19, .16, .13, .10, .10, .10];
const lerpTable = (q: number, vals: number[]) => {
  if (q <= KEYS[0]) return vals[0];
  for (let i = 1; i < KEYS.length; i++) if (q <= KEYS[i]) { const t = (q - KEYS[i - 1]) / (KEYS[i] - KEYS[i - 1]); return vals[i - 1] + (vals[i] - vals[i - 1]) * t; }
  return vals[vals.length - 1];
};
const sstep = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };

const tokenRgb = (el: Element, name: string): [number, number, number] => {
  const raw = getComputedStyle(el).getPropertyValue(name).trim().split(/\s+/);
  const h = parseFloat(raw[0]) / 360, s = parseFloat(raw[1]) / 100, l = parseFloat(raw[2]) / 100;
  if (Number.isNaN(h)) return [255, 255, 255];
  const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t: number) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
};

export const BowlGlow = ({ progress }: { progress: () => number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const W = 96, H = 60; const img = ctx.createImageData(W, H);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cur = { tip: -.3, half: .3, soft: .1 };
    const t0 = performance.now(); let frame = 0;
    const loop = (now: number) => {
      const out = tokenRgb(canvas, "--background"), rim = tokenRgb(canvas, "--violet-tint"), core = tokenRgb(canvas, "--violet");
      const q = progress();
      const tgt = { tip: lerpTable(q, TIP), half: lerpTable(q, HALF), soft: lerpTable(q, SOFT) };
      const intro = reduced ? 1 : sstep((now - t0 - 250) / 1050);
      if (intro < 1) { cur.tip = -.3 + (tgt.tip + .3) * intro; cur.half = .3 + (tgt.half - .3) * intro; cur.soft = .1 + (tgt.soft - .1) * intro; }
      else { cur.tip += (tgt.tip - cur.tip) * .12; cur.half += (tgt.half - cur.half) * .12; cur.soft += (tgt.soft - cur.soft) * .12; }
      const tip = cur.tip + (reduced ? 0 : Math.sin(now * .00033 + 1.3) * .02);
      const half = cur.half + (reduced ? 0 : Math.sin(now * .0005) * .015);
      const soft = cur.soft;
      const { width, height } = canvas.getBoundingClientRect();
      const aspect = width / Math.max(height, 1);
      const pts: [number, number][] = [];
      const safeTip = Math.max(tip, .001);
      for (let k = 0; k < 48; k++) { const yy = -.3 + (safeTip + .3) * k / 47; pts.push([half * aspect * Math.pow(Math.max(0, 1 - yy / safeTip), .72), yy]); }
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const py = (y + .5) / H, px = Math.abs((x + .5) / W - .5) * aspect;
        let d = Infinity;
        for (let k = 1; k < pts.length; k++) {
          const [ax, ay] = pts[k - 1], [bx, by] = pts[k];
          const dx = bx - ax, dy = by - ay; const l2 = dx * dx + dy * dy || 1e-9;
          const t = Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / l2));
          const ex = px - ax - dx * t, ey = py - ay - dy * t; const dd = ex * ex + ey * ey;
          if (dd < d) d = dd;
        }
        let sd = Math.sqrt(d);
        if (tip > 0 && py < tip && px < half * aspect * Math.pow(1 - py / tip, .72)) sd = -sd;
        sd -= .25;
        const g = 1 - sstep((sd + soft) / (2 * soft));
        let c: number[];
        if (g < .38) { const m = sstep(g / .38); c = out.map((v, i) => v + (rim[i] - v) * m); }
        else { const m = sstep((g - .38) / .62); c = rim.map((v, i) => v + (core[i] - v) * m); }
        const o = (y * W + x) * 4; img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; img.data[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [progress]);
  return <canvas ref={ref} width={96} height={60} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
};
