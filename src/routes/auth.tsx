import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Prijava — FitTracker" },
      { name: "description", content: "Prijavi se ili napravi nalog za FitTracker." },
      { property: "og:title", content: "Prijava — FitTracker" },
      { property: "og:description", content: "Prijavi se ili napravi nalog za FitTracker." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Neispravan email").max(255),
  password: z.string().min(6, "Lozinka mora imati bar 6 karaktera").max(72),
});

const inputCls = "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      if (error) toast.error("Pogrešan email ili lozinka");
    } else {
      const { error } = await supabase.auth.signUp({
        ...parsed.data,
        options: { emailRedirectTo: window.location.origin + "/dashboard" },
      });
      if (error) toast.error(error.message);
      else setSent(true);
    }
    setLoading(false);
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (res.error) toast.error("Prijava preko Google-a nije uspela");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-soft">
            <Activity className="h-7 w-7" />
          </span>
          <h1 className="text-3xl font-semibold">FitTracker</h1>
          <p className="text-muted-foreground">Evidencija treninga</p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          {sent ? (
            <div className="rounded-xl bg-success-soft p-5 text-center text-success">
              <p className="font-medium">Proveri svoj email ✉️</p>
              <p className="text-sm">Poslali smo ti link za potvrdu naloga.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-lg py-2 text-sm transition ${mode === m ? "bg-card font-medium shadow-soft" : "text-muted-foreground"}`}
                  >
                    {m === "login" ? "Prijava" : "Registracija"}
                  </button>
                ))}
              </div>
              <form onSubmit={onSubmit} className="space-y-4">
                <input name="email" type="email" placeholder="Email" className={inputCls} />
                <input name="password" type="password" placeholder="Lozinka" className={inputCls} />
                <button disabled={loading} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
                  {loading ? "Sačekaj…" : mode === "login" ? "Prijavi se" : "Napravi nalog"}
                </button>
              </form>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> ili <div className="h-px flex-1 bg-border" />
              </div>
              <button onClick={google} className="w-full rounded-xl border bg-background py-3 text-sm font-medium hover:bg-muted">
                Nastavi sa Google nalogom
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
