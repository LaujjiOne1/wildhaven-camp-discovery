import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "./prefs";

export type ServiceItem = { icon: LucideIcon; image: string; title: string; text: string };

export const ServicesCarousel = ({ items, hint }: { items: ServiceItem[]; hint: string }) => {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const t = useT();
  const lastWheel = useRef(0);
  const n = items.length;
  const go = (d: number) => setIndex((i) => (i + d + n) % n);

  return (
    <div className="relative" onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } }} tabIndex={0} aria-label="Services" aria-roledescription="carrousel">
      <motion.div className="relative mx-auto h-[420px] cursor-grab touch-pan-y select-none active:cursor-grabbing" style={{ perspective: 1200 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
        onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
        onWheel={(e) => { const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY; if (Math.abs(delta) > 30 && Date.now() - lastWheel.current > 550) { lastWheel.current = Date.now(); go(delta > 0 ? 1 : -1); } }}>
        {items.map((s, i) => {
          let off = i - index;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const abs = Math.abs(off);
          return (
            <motion.article key={s.title} onClick={() => off !== 0 && go(off)}
              aria-hidden={off !== 0} data-active={off === 0}
              className="absolute left-1/2 top-0 h-[400px] w-[min(300px,72vw)] overflow-hidden rounded-lg border bg-card shadow-soft"
              style={{ zIndex: 10 - abs, transformStyle: "preserve-3d" }}
              animate={{ x: `calc(-50% + ${off * 78}%)`, rotateY: off * -38, scale: 1 - abs * 0.14, opacity: abs > 1 ? 0 : 1, filter: abs ? "saturate(1.4) blur(1px)" : "saturate(1) blur(0px)" }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 22 }}>
              <img src={s.image} alt={s.title} draggable={false} className="h-full w-full object-cover" />
              <div className="service-shade absolute inset-0" />
              <div className="service-caption absolute inset-x-0 bottom-0 p-6">
                <s.icon className="h-7 w-7 text-violet" />
                <h3 className="mt-3 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm opacity-85">{s.text}</p>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label={t("Précédent", "Previous")} className="rounded-full"><ChevronLeft className="h-5 w-5" /></Button>
        <div className="flex gap-1">{items.map((s, i) => <Button variant="ghost" size="icon" key={s.title} aria-label={s.title} aria-pressed={i === index} onClick={() => setIndex(i)} className="h-8 w-8"><span className={`block h-2 rounded-full ${i === index ? "w-6 bg-primary" : "w-2 bg-border"}`} /></Button>)}</div>
        <Button variant="outline" size="icon" onClick={() => go(1)} aria-label={t("Suivant", "Next")} className="rounded-full"><ChevronRight className="h-5 w-5" /></Button>
      </div>
    </div>
  );
};
