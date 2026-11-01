import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext<{ user: User | null; loading: boolean } | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    let version = 0;
    const validate = async () => {
      const request = ++version;
      const { data, error } = await supabase.auth.getUser();
      if (alive && request === version) { setUser(error ? null : data.user); setLoading(false); }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      queueMicrotask(() => { if (alive) void validate(); });
    });
    void validate();
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthProvider is required");
  return auth;
}