import { useState } from "react";
import { ArrowRight, BookOpen, Clock, Download, GraduationCap, HeartHandshake, LogIn, Mail, Menu, MessageCircle, Moon, Phone, Search, ShieldCheck, Smartphone, Sun, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Logo, CapIcon } from "@/components/site/Logo";
import { GuidedAssistant } from "@/components/site/GuidedAssistant";
import { edulocConfig, hasApk, hasDirectChannel, hasEmail, hasPhone, hasWhatsapp, mailLink, telLink, whatsappLink } from "@/config/eduloc";
import { SupportChat } from "@/components/site/SupportChat";
import { MotionThreads } from "@/components/site/MotionThreads";
import heroImage from "@/assets/tutoring-hero.jpg";
import schoolImage from "@/assets/school-support.jpg";
import adultImage from "@/assets/adult-learning.jpg";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { ServicesCarousel } from "@/components/site/ServicesCarousel";
import { SectionDots } from "@/components/site/SectionDots";
import { usePrefs, useT } from "@/components/site/prefs";

const openHelp = () => window.dispatchEvent(new Event("eduloc:help"));

const useNav = () => {
  const t = useT();
  return [
    { href: "#fonctionnement", label: t("Comment ça marche", "How it works") },
    { href: "#aide", label: t("Assistance", "Help") },
    { href: "#services", label: "Services" },
    { href: "#application", label: t("L'application", "The app") },
    { href: "#faq", label: "FAQ" },
  ];
};

const LoginButton = () => {
  const t = useT();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full"><LogIn />{t("Se connecter", "Sign in")}</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <p className="font-display font-bold">{t("Votre compte edUloc", "Your edUloc account")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("La connexion à votre compte (cours, réservations) se fait dans l'application Android. Sur ce site, aucun compte n'est nécessaire pour demander de l'aide.", "Signing in to your account (lessons, bookings) happens in the Android app. No account is needed on this site to ask for help.")}</p>
        <div className="mt-4 flex flex-col gap-2">
          <DownloadButton size="sm" />
          <Button size="sm" variant="ghost" onClick={openHelp}><MessageCircle />{t("Demander de l'aide", "Ask for help")}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const Toggles = () => {
  const { lang, setLang, theme, setTheme } = usePrefs();
  return (
    <>
      <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} aria-label={lang === "fr" ? "Switch to English" : "Passer en français"} className="h-9 rounded-full border px-3 text-xs font-bold hover:bg-primary-tint">{lang === "fr" ? "EN" : "FR"}</button>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "Thème clair" : "Thème sombre"} className="grid h-9 w-9 place-items-center rounded-full border hover:bg-primary-tint">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
    </>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const t = useT();
  const nav = useNav();
  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-3">
        <a href="#top" aria-label="edUloc"><Logo /></a>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((n) => <a key={n.href} href={n.href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">{n.label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Toggles />
          <div className="hidden sm:block"><LoginButton /></div>
          <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-background lg:hidden">
          <div className="container flex flex-col py-3">
            {nav.map((n) => <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2.5 font-medium">{n.label}</a>)}
            <div className="mt-2 flex flex-wrap gap-2 sm:hidden"><LoginButton /></div>
            <Button className="mt-2 rounded-full" onClick={() => { setOpen(false); openHelp(); }}><MessageCircle />{t("Demander de l'aide", "Ask for help")}</Button>
          </div>
        </nav>
      )}
    </header>
  );
};

const DownloadButton = ({ variant = "outline", size = "lg" }: { variant?: "outline" | "default"; size?: "lg" | "sm" }) => {
  const t = useT();
  return hasApk() ? (
    <Button asChild size={size} variant={variant} className="rounded-full">
      <a href={edulocConfig.apkDownloadUrl} download><Download className="mr-2 h-4 w-4" />{t("Télécharger edUloc", "Download edUloc")}{edulocConfig.apkVersion && ` · v${edulocConfig.apkVersion}`}</a>
    </Button>
  ) : (
    <Button size={size} variant={variant} className="rounded-full" disabled>
      <Smartphone className="mr-2 h-4 w-4" />{t("Application Android bientôt disponible", "Android app coming soon")}
    </Button>
  );
};

const Hero = () => {
  const t = useT();
  return (
    <section id="top" className="relative isolate overflow-hidden bg-primary-dark text-primary-foreground dark:text-foreground">
      <img src={heroImage} width={1536} height={1024} fetchPriority="high" alt={t("Une tutrice accompagne un élève dans ses exercices de mathématiques", "A tutor helps a student with maths exercises")} className="hero-photo absolute inset-0 -z-20 h-full w-full object-cover object-right" />
      <div className="hero-shade absolute inset-0 -z-10" />
      <div className="container relative py-14 md:py-20">
        <div className="max-w-xl motion-reveal">
          <span className="inline-flex items-center gap-2 text-sm font-medium"><BookOpen className="h-4 w-4" />{t("Soutien scolaire · Cours particuliers", "Tutoring · Private lessons")}</span>
          <h1 className="mt-5 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"><span>edU</span><span className="text-violet">loc</span></h1>
          <p className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            {t("Le bon accompagnement,", "The right support,")}<br />{t("au bon endroit.", "in the right place.")}
          </p>
          <p className="mt-5 max-w-md text-base leading-relaxed opacity-85">
            {t("Décrivez votre besoin, un conseiller edUloc trouve le tuteur qui correspond à votre enfant, à vous ou à un proche. Sans compte, sans installation.", "Describe your need and an edUloc advisor finds the right tutor for your child, yourself or a loved one. No account, no install.")}
          </p>
          <div className="mt-8 flex flex-col items-start gap-3">
            <Button size="lg" onClick={openHelp} className="h-auto max-w-full whitespace-normal rounded-full bg-emerald py-3 text-left text-white hover:bg-emerald/90"><MessageCircle />{t("Trouver un tuteur avec un conseiller", "Find a tutor with an advisor")}<ArrowRight className="h-4 w-4 shrink-0" /></Button>
            <a href="#application" className="inline-flex items-center gap-2 py-2 text-sm font-medium underline underline-offset-4">{t("Je préfère l'application", "I prefer the app")}<ArrowRight className="h-4 w-4" /></a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-85">
            <li className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald" />{t("Tuteurs vérifiés", "Verified tutors")}</li>
            <li className="flex items-center gap-1.5"><HeartHandshake className="h-4 w-4 text-emerald" />{t("Un conseiller dédié", "A dedicated advisor")}</li>
            <li className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-emerald" />{t("Du primaire au supérieur", "Primary to university")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

const Section = ({ id, eyebrow, title, intro, children, className = "" }: { id: string; eyebrow: string; title: string; intro?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`scroll-mt-16 py-20 ${className}`}>
    <div className="container">
      <ScrollReveal className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
      </ScrollReveal>
      {children}
    </div>
  </section>
);

const HowItWorks = () => {
  const t = useT();
  return (
    <Section id="fonctionnement" eyebrow={t("Comment ça marche", "How it works")} title={t("Deux façons d'obtenir un professeur", "Two ways to get a tutor")} intro={t("Choisissez le parcours qui vous convient. Dans les deux cas, ce sont les mêmes tuteurs edUloc.", "Pick the path that suits you. Either way, it's the same edUloc tutors.")}>
      <div className="grid gap-6 md:grid-cols-2">
        <PathCard tone="primary" icon={HeartHandshake} badge={t("Le plus simple", "Easiest")} title={t("Avec un conseiller", "With an advisor")}
          steps={[t("Décrivez votre besoin en quelques clics ou par message", "Describe your need in a few clicks or by message"), t("Un conseiller recherche les tuteurs disponibles pour vous", "An advisor looks for available tutors"), t("Il vous propose un professeur et organise le premier cours", "They suggest a tutor and set up the first lesson")]}
          cta={<Button asChild className="rounded-full"><a href="#aide">{t("Décrire mon besoin", "Describe my need")}<ArrowRight className="ml-2 h-4 w-4" /></a></Button>} />
        <PathCard delay={0.12} tone="violet" icon={Smartphone} badge={t("En autonomie", "On your own")} title={t("Avec l'application", "With the app")}
          steps={[t("Téléchargez edUloc sur votre téléphone Android", "Download edUloc on your Android phone"), t("Recherchez un tuteur selon la matière et le niveau", "Search tutors by subject and level"), t("Réservez et suivez vos cours depuis l'application", "Book and follow lessons in the app")]}
          cta={<DownloadButton />} />
      </div>
    </Section>
  );
};

const PathCard = ({ tone, icon: Icon, badge, title, steps, cta, delay = 0 }: { tone: "primary" | "violet"; icon: typeof Users; badge: string; title: string; steps: string[]; cta: React.ReactNode; delay?: number }) => (
  <ScrollReveal delay={delay} className={`flex flex-col rounded-2xl border p-7 ${tone === "primary" ? "bg-card" : "bg-violet-tint"}`}>
    <div className="flex items-center justify-between">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-tint text-primary"><Icon className="h-6 w-6" /></span>
      <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-primary">{badge}</span>
    </div>
    <h3 className="mt-5 text-2xl">{title}</h3>
    <ol className="mt-5 flex-1 space-y-4">
      {steps.map((s, i) => (
        <li key={s} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">{i + 1}</span><span className="pt-0.5">{s}</span></li>
      ))}
    </ol>
    <div className="mt-7">{cta}</div>
  </ScrollReveal>
);

const Services = () => {
  const t = useT();
  const items = [
    { icon: BookOpen, image: schoolImage, title: t("Soutien scolaire", "School support"), text: t("Cours réguliers pour consolider les bases et reprendre confiance.", "Regular lessons to build foundations and regain confidence.") },
    { icon: Search, image: heroImage, title: t("Aide aux devoirs", "Homework help"), text: t("Un accompagnement au quotidien pour gagner en méthode et en autonomie.", "Everyday help to build method and independence.") },
    { icon: GraduationCap, image: schoolImage, title: t("Préparation aux examens", "Exam preparation"), text: t("Brevet, bac, concours : des révisions ciblées avant les échéances.", "National exams and competitive tests: focused revision.") },
    { icon: Users, image: adultImage, title: t("Cours pour adultes", "Adult courses"), text: t("Langues, remise à niveau ou reconversion, à votre rythme.", "Languages, refreshers or career change, at your pace.") },
  ];
  return (
    <Section id="services" eyebrow="Services" title={t("Un accompagnement pour chaque besoin", "Support for every need")} className="overflow-hidden bg-card">
      <ScrollReveal><ServicesCarousel items={items} hint={t("Glissez, faites défiler ou utilisez les flèches ←→", "Drag, scroll or use the arrows ←→")} /></ScrollReveal>
      <p className="mt-8 text-center text-sm text-muted-foreground">{t("À domicile ou en ligne · Du primaire au supérieur", "At home or online · Primary to university")}</p>
    </Section>
  );
};

const Help = () => {
  const t = useT();
  return (
    <Section id="aide" eyebrow={t("Assistance", "Help")} title={t("Parlez-nous de votre besoin", "Tell us what you need")} intro={t("Pas besoin d'installer l'application ni de créer un compte. Répondez à quelques questions, on s'occupe du reste.", "No app or account needed. Answer a few questions, we handle the rest.")}>
      <ScrollReveal className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <GuidedAssistant />
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg">{t("Joindre un conseiller", "Reach an advisor")}</h3>
            {hasDirectChannel() ? (
              <div className="mt-4 space-y-3">
                {hasWhatsapp() && <Channel href={whatsappLink("Bonjour, je souhaite de l'aide pour trouver un tuteur.")} icon={MessageCircle} label="WhatsApp" sub={t("Canal privilégié", "Preferred channel")} external />}
                {hasPhone() && <Channel href={telLink()} icon={Phone} label={t("Appeler", "Call")} sub={edulocConfig.phone} />}
                {hasEmail() && <Channel href={mailLink()} icon={Mail} label="E-mail" sub={edulocConfig.email} />}
                {edulocConfig.hours && <p className="flex items-center gap-2 pt-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{edulocConfig.hours}</p>}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">{t("Nos lignes WhatsApp et téléphone seront bientôt disponibles. En attendant, utilisez l'assistant : votre demande est enregistrée et un conseiller vous recontacte.", "Our WhatsApp and phone lines are coming soon. Meanwhile, use the assistant: your request is saved and an advisor will get back to you.")}</p>
            )}
          </div>
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <CapIcon className="h-8 w-8 opacity-80" />
            <p className="mt-3 font-display text-lg font-bold">{t("Ce qui se passe ensuite", "What happens next")}</p>
            <p className="mt-2 text-sm opacity-85">{t("Un conseiller étudie votre demande, recherche les tuteurs adaptés et leurs disponibilités, puis vous fait une proposition.", "An advisor reviews your request, finds suitable tutors and their availability, then makes you an offer.")}</p>
          </div>
        </aside>
      </ScrollReveal>
    </Section>
  );
};

const Channel = ({ href, icon: Icon, label, sub, external }: { href: string; icon: typeof Phone; label: string; sub: string; external?: boolean }) => (
  <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="flex items-center gap-3 rounded-xl border p-3 transition hover:border-primary hover:bg-primary-tint">
    <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-tint text-emerald"><Icon className="h-5 w-5" /></span>
    <span><span className="block font-semibold">{label}</span><span className="text-sm text-muted-foreground">{sub}</span></span>
  </a>
);

const AppSection = () => {
  const t = useT();
  return (
    <section id="application" className="scroll-mt-16 py-20">
      <div className="container">
        <ScrollReveal className="relative overflow-hidden rounded-3xl bg-primary-dark p-8 text-primary-foreground sm:p-14">
          <MotionThreads />
          <div className="relative max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-violet">{t("Application Android", "Android app")}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">{t("Gérez vos cours en toute autonomie", "Manage your lessons on your own")}</h2>
            <p className="mt-4 opacity-85">{t("Recherchez des tuteurs, consultez leurs disponibilités, réservez et suivez vos cours depuis votre téléphone.", "Search tutors, check availability, book and follow lessons from your phone.")}</p>
            <div className="mt-8"><DownloadButton variant="default" /></div>
            {hasApk() && <p className="mt-3 text-xs opacity-70">{t("Fichier APK pour Android. Autorisez l'installation depuis votre navigateur si demandé.", "APK file for Android. Allow installs from your browser if asked.")}</p>}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const Faq = () => {
  const t = useT();
  const faqs = [
    { q: t("Dois-je installer l'application pour obtenir un tuteur ?", "Do I need the app to get a tutor?"), a: t("Non. Vous pouvez décrire votre besoin sur ce site : un conseiller s'occupe de la recherche pour vous.", "No. Describe your need on this site and an advisor searches for you.") },
    { q: t("Combien de temps pour être recontacté ?", "How soon will I be contacted?"), a: t("Un conseiller traite votre demande dès que possible et vous recontacte par le moyen que vous avez choisi.", "An advisor handles your request as soon as possible and contacts you the way you chose.") },
    { q: t("Les cours ont-ils lieu à domicile ou en ligne ?", "Are lessons at home or online?"), a: t("Les deux sont possibles : indiquez votre préférence dans l'assistant.", "Both are possible: tell us your preference in the assistant.") },
    { q: t("L'application est-elle disponible sur iPhone ?", "Is the app on iPhone?"), a: t("Pour l'instant, edUloc est disponible sur Android. Sur iPhone, passez par un conseiller.", "For now edUloc is on Android. On iPhone, go through an advisor.") },
  ];
  return (
    <Section id="faq" eyebrow="FAQ" title={t("Questions fréquentes", "Frequently asked questions")} className="bg-card">
      <ScrollReveal className="mx-auto max-w-2xl"><Accordion type="single" collapsible>
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`q${i}`}><AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{f.a}</AccordionContent></AccordionItem>
        ))}
      </Accordion></ScrollReveal>
    </Section>
  );
};

const Footer = () => {
  const t = useT();
  const nav = useNav();
  return (
    <footer className="bg-foreground py-12 text-background dark:bg-card dark:text-foreground">
      <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><Logo inverted /><p className="mt-3 text-sm opacity-70">{t("Le bon accompagnement, au bon endroit.", "The right support, in the right place.")}</p></div>
        <nav className="flex flex-wrap gap-5 text-sm opacity-80">{nav.map((n) => <a key={n.href} href={n.href} className="hover:opacity-100">{n.label}</a>)}</nav>
        <p className="text-xs opacity-60">© {new Date().getFullYear()} edUloc</p>
      </div>
    </footer>
  );
};

const Index = () => {
  const t = useT();
  const dots = [
    { id: "top", label: t("Accueil", "Home") },
    { id: "fonctionnement", label: t("Comment ça marche", "How it works") },
    { id: "aide", label: t("Assistance", "Help") },
    { id: "services", label: "Services" },
    { id: "application", label: t("L'application", "The app") },
    { id: "faq", label: "FAQ" },
  ];
  return (
    <div className="min-h-screen">
      <Header />
      <SectionDots items={dots} />
      <main><Hero /><HowItWorks /><Help /><Services /><AppSection /><Faq /></main>
      <Footer />
      <SupportChat />
    </div>
  );
};

export default Index;
