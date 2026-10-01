import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TYPE_LABELS, TYPE_STYLES, todayISO, workoutSchema, workoutsQueryKey, type WorkoutType } from "@/lib/workouts";

export const Route = createFileRoute("/_authenticated/new")({
  head: () => ({
    meta: [
      { title: "Novi trening — FitTracker" },
      { name: "description", content: "Zabeleži novi trening: tip, trajanje, kalorije i napomene." },
      { property: "og:title", content: "Novi trening — FitTracker" },
      { property: "og:description", content: "Zabeleži novi trening: tip, trajanje, kalorije i napomene." },
    ],
  }),
  component: NewWorkout,
});

const inputCls = "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

function NewWorkout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [type, setType] = useState<WorkoutType>("kardio");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = workoutSchema.safeParse({ ...Object.fromEntries(fd), type });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("workouts").insert({
      ...parsed.data,
      notes: parsed.data.notes || null,
      user_id: u.user!.id,
    });
    setSaving(false);
    if (error) { toast.error("Greška pri čuvanju: " + error.message); return; }
    await qc.invalidateQueries({ queryKey: workoutsQueryKey });
    toast.success("Trening je sačuvan!");
    navigate({ to: "/workouts" });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold">Novi trening</h1>
      <p className="mb-6 text-muted-foreground">Zabeleži šta si danas uradio/la.</p>
      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-soft">
        <Field error={errors["title"]} label="Naziv treninga">
          <input name="title" maxLength={100} placeholder="npr. Jutarnje trčanje" className={inputCls} />
        </Field>
        <div className="space-y-1.5">
          <span className="text-sm font-medium">Tip</span>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(TYPE_LABELS) as WorkoutType[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${type === t ? `${TYPE_STYLES[t]} border-transparent ring-2 ring-ring/40` : "bg-background text-muted-foreground hover:bg-muted"}`}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field error={errors["duration_min"]} label="Trajanje (min)">
            <input name="duration_min" type="number" min={1} max={1440} placeholder="45" className={inputCls} />
          </Field>
          <Field error={errors["calories"]} label="Kalorije (kcal)">
            <input name="calories" type="number" min={0} max={20000} placeholder="350" className={inputCls} />
          </Field>
          <Field error={errors["date"]} label="Datum">
            <input name="date" type="date" defaultValue={todayISO()} className={inputCls} />
          </Field>
        </div>
        <Field error={errors["notes"]} label="Napomena">
          <textarea name="notes" rows={4} maxLength={1000} placeholder="Kako si se osećao/la?" className={inputCls} />
        </Field>
        <button disabled={saving} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 disabled:opacity-60">
          {saving ? "Čuvanje…" : "Sačuvaj trening"}
        </button>
      </form>
    </div>
  );
}
