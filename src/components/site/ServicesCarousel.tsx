import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";

export type ServiceItem = { icon: LucideIcon; image: string; title: string; text: string };

export const ServicesCarousel = ({ items, hint }: { items: ServiceItem[]; hint: string }) => {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const n = items.length;
  const go = (d: number) => setIndex((i) => (i + d + n) % n);

  return (
    <div className="relative" onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }} tabIndex={0} aria-roledescription="carrousel">
      <motion.div className="relative mx-auto h-[420px] cursor-grab touch-pan-y select-none active:cursor-grabbing" style={{ perspective: 1200 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
        onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
        onWheel={(e) => { if (Math.abs(e.deltaX) > 30) go(e.deltaX > 0 ? 1 : -1); }}>
        {items.map((s, i) => {
          let off = i - index;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const abs = Math.abs(off);
          return (
            <motion.article key={s.title} onClick={() => off !== 0 && go(off)}
              className="absolute left-1/2 top-0 h-[400px] w-[min(300px,72vw)] overflow-hidden rounded-2xl border bg-card shadow-soft"
              style={{ zIndex: 10 - abs, transformStyle: "preserve-3d" }}
              animate={{ x: `calc(-50% + ${off * 78}%)`, rotateY: off * -38, scale: 1 - abs * 0.14, opacity: abs > 1 ? 0 : 1, filter: abs ? "saturate(1.4) blur(1px)" : "saturate(1) blur(0px)" }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 22 }}>
              <img src={s.image} alt={s.title} draggable={false} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                <s.icon className="h-7 w-7 text-violet" />
                <h3 className="mt-3 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm opacity-85">{s.text}</p>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button onClick={() => go(-1)} aria-label="Précédent" className="grid h-10 w-10 place-items-center rounded-full border bg-card hover:bg-primary-tint"><ChevronLeft className="h-5 w-5" /></button>
        <div className="flex gap-2">{items.map((s, i) => <button key={s.title} aria-label={s.title} onClick={() => setIndex(i)} className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-2 bg-border"}`} />)}</div>
        <button onClick={() => go(1)} aria-label="Suivant" className="grid h-10 w-10 place-items-center rounded-full border bg-card hover:bg-primary-tint"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">{hint}</p>
    </div>
  );
};
