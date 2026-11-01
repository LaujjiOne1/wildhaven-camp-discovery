import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/components/site/prefs";

export default function ResetPassword() {
  const t = useT();
  const [recovery, setRecovery] = useState(new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") setRecovery(true); });
    return () => subscription.unsubscribe();
  }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError("");
    if (password !== confirm) { setError(t("Les mots de passe ne correspondent pas.", "Passwords do not match.")); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(t("Ce lien a expiré ou le mot de passe est refusé. Demandez un nouveau lien.", "This link expired or the password was rejected. Request a new link."));
    else { setDone(true); setPassword(""); setConfirm(""); }
  };
  return <main className="container flex min-h-screen items-center justify-center py-12"><div className="w-full max-w-md space-y-6">
    <h1 className="text-3xl">{t("Nouveau mot de passe", "New password")}</h1>
    {done ? <p role="status">{t("Votre mot de passe a été modifié.", "Your password has been updated.")}</p> : recovery ? <form onSubmit={submit} className="space-y-4">
      <Label htmlFor="new-password">{t("Mot de passe", "Password")}</Label><Input id="new-password" type="password" minLength={6} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Label htmlFor="confirm-password">{t("Confirmer le mot de passe", "Confirm password")}</Label><Input id="confirm-password" type="password" minLength={6} required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <Button type="submit" disabled={busy}>{t("Enregistrer", "Save")}</Button>
    </form> : <p>{t("Ouvrez le lien reçu par e-mail pour réinitialiser votre mot de passe.", "Open the link from your email to reset your password.")}</p>}
    <Button asChild variant="outline"><Link to="/">{t("Retour à edUloc", "Back to edUloc")}</Link></Button>
  </div></main>;
}