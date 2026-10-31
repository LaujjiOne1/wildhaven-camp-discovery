import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "fr" | "en";
type Theme = "light" | "dark";
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; theme: Theme; setTheme: (t: Theme) => void }>(null!);

export const PrefsProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("eduloc-lang") as Lang) || "fr");
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("eduloc-theme") as Theme) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  useEffect(() => { localStorage.setItem("eduloc-lang", lang); document.documentElement.lang = lang; }, [lang]);
  useEffect(() => { localStorage.setItem("eduloc-theme", theme); document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);
  return <Ctx.Provider value={{ lang, setLang, theme, setTheme }}>{children}</Ctx.Provider>;
};

export const usePrefs = () => useContext(Ctx);
/** t("texte FR", "EN text") */
export const useT = () => { const { lang } = usePrefs(); return (fr: string, en: string) => (lang === "fr" ? fr : en); };
