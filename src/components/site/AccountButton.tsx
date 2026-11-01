import { useEffect, useState, type FormEvent } from "react";
import { LogIn, LogOut, UserRound, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import "@lovable.dev/cloud-auth-js/styles.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./AuthProvider";
import { useT } from "./prefs";

export function AccountButton() {
  const t = useT();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!open || !user) return;
    let alive = true;
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle().then(({ data, error }) => {
      if (!alive) return;
      if (error) { setFailed(true); setMessage(t("Impossible de charger le profil.", "Could not load your profile.")); }
      else setName(data?.display_name ?? "");
    });
    return () => { alive = false; };
  }, [open, user?.id]);
  const switchMode = (next: typeof mode) => { setMode(next); setMessage(""); setFailed(false); setPassword(""); };
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMessage(""); setFailed(false);
    try {
      if (user) {
        const { error } = await supabase.from("profiles").upsert({ id: user.id, display_name: name.trim() }).select("display_name").single();
        if (error) throw error;
        setMessage(t("Profil enregistré.", "Profile saved."));
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setMessage(t("Si cette adresse correspond à un compte, un lien de réinitialisation vous a été envoyé.", "If this address has an account, a reset link has been sent."));
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim() } } });
        if (error) throw error;
        setPassword("");
        if (!data.session) setMessage(t("Consultez votre e-mail pour confirmer votre compte avant de vous connecter.", "Check your email to confirm your account before signing in."));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        setPassword(""); setOpen(false);
      }
    } catch {
      setFailed(true); setMessage(mode === "login" && !user ? t("Connexion impossible. Vérifiez vos identifiants et la confirmation de votre e-mail.", "Unable to sign in. Check your credentials and email confirmation.") : t("L’opération a échoué. Réessayez dans un instant.", "The operation failed. Please try again shortly."));
    } finally { setBusy(false); }
  };
  const social = async (provider: "google" | "lovable") => {
    setBusy(true); setMessage(""); setFailed(false);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
      if (result.error) throw result.error;
      if (!result.redirected) setOpen(false);
    } catch { setFailed(true); setMessage(t("Connexion interrompue. Réessayez.", "Sign-in interrupted. Please try again.")); }
    finally { setBusy(false); }
  };
  return <Dialog open={open} onOpenChange={(value) => { setOpen(value); setMessage(""); setFailed(false); setPassword(""); }}>
    <DialogTrigger asChild><Button variant="outline" size="sm" disabled={loading} className="rounded-full" aria-label={user ? t("Mon profil", "My profile") : t("Se connecter", "Sign in")}>
      {user ? <UserRound /> : <LogIn />}<span className="hidden sm:inline">{user ? t("Mon profil", "My profile") : t("Se connecter", "Sign in")}</span>
    </Button></DialogTrigger>
    <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-md">
      <DialogHeader><DialogTitle>{user ? t("Mon profil", "My profile") : mode === "signup" ? t("Créer un compte", "Create an account") : mode === "forgot" ? t("Mot de passe oublié", "Forgot password") : t("Se connecter à edUloc", "Sign in to edUloc")}</DialogTitle></DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        {(user || mode === "signup") && <div className="space-y-2"><Label htmlFor="account-name">{t("Nom affiché", "Display name")}</Label><Input id="account-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required autoComplete="name" /></div>}
        {user ? <p className="break-all text-sm text-muted-foreground">{user.email}</p> : <>
          <div className="space-y-2"><Label htmlFor="account-email">E-mail</Label><Input id="account-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></div>
          {mode !== "forgot" && <div className="space-y-2"><Label htmlFor="account-password">{t("Mot de passe", "Password")}</Label><Input id="account-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required autoComplete={mode === "signup" ? "new-password" : "current-password"} /></div>}
        </>}
        {message && <p role={failed ? "alert" : "status"} className={failed ? "text-sm text-destructive" : "text-sm text-emerald"}>{message}</p>}
        <Button className="w-full" disabled={busy} type="submit">{user && <Save />}{busy ? t("Patientez…", "Please wait…") : user ? t("Enregistrer", "Save") : mode === "signup" ? t("Créer mon compte", "Create account") : mode === "forgot" ? t("Envoyer le lien", "Send reset link") : t("Se connecter", "Sign in")}</Button>
      </form>
      {user ? <Button variant="outline" disabled={busy} onClick={async () => {
        setBusy(true); const { error } = await supabase.auth.signOut(); setBusy(false);
        if (error) { setFailed(true); setMessage(t("Déconnexion impossible. Réessayez.", "Could not sign out. Try again.")); } else setOpen(false);
      }}><LogOut />{t("Se déconnecter", "Sign out")}</Button> : <>
        {mode !== "forgot" && <div className="space-y-2 border-t pt-4">
          <Button variant="outline" className="w-full" disabled={busy} onClick={() => social("google")}>{t("Continuer avec Google", "Continue with Google")}</Button>
          <button type="button" className="lovable-auth-button w-full" disabled={busy} onClick={() => social("lovable")}>{t("Continuer avec Lovable", "Continue with Lovable")}</button>
        </div>}
        <div className="flex flex-wrap justify-center gap-1">
          <Button variant="link" size="sm" disabled={busy} onClick={() => switchMode(mode === "signup" || mode === "forgot" ? "login" : "signup")}>{mode === "login" ? t("Créer un compte", "Create account") : t("J’ai déjà un compte", "I already have an account")}</Button>
          {mode === "login" && <Button variant="link" size="sm" disabled={busy} onClick={() => switchMode("forgot")}>{t("Mot de passe oublié ?", "Forgot password?")}</Button>}
        </div>
      </>}
    </DialogContent>
  </Dialog>;
}