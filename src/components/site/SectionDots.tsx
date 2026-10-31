import { useEffect, useState } from "react";

export const SectionDots = ({ items }: { items: { id: string; label: string }[] }) => {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    items.forEach((i) => { const el = document.getElementById(i.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [items]);
  return (
    <nav aria-label="Sections" className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} aria-label={i.label} title={i.label} className="group flex items-center gap-2">
          <span className={`block h-2.5 rounded-full transition-all ${active === i.id ? "w-6 bg-primary" : "w-2.5 bg-faint"}`} />
          <span className="rounded bg-card px-2 py-0.5 text-xs opacity-0 shadow-soft transition group-hover:opacity-100">{i.label}</span>
        </a>
      ))}
    </nav>
  );
};
