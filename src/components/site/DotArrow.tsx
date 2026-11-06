/** Glowing dot that grows into a circle with a chevron on parent hover (parent needs `group relative` and right padding). */
export const DotArrow = ({ large = false }: { large?: boolean }) => (
  <span aria-hidden="true" className={`absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-emerald shadow-dot transition-all duration-500 ease-brand group-hover:shadow-none ${large ? "right-6 h-3.5 w-3.5 group-hover:right-1.5 group-hover:h-11 group-hover:w-11" : "right-4 h-2.5 w-2.5 group-hover:right-1 group-hover:h-8 group-hover:w-8"}`}>
    <svg viewBox="0 0 12 12" className={`${large ? "h-4 w-4" : "h-3 w-3"} -translate-x-1 fill-none stroke-primary-dark opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100`} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 2.5 8 6l-3.5 3.5" /></svg>
  </span>
);
