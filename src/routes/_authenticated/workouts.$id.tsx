import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, Flame, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchWorkout, formatDate, TYPE_LABELS, TYPE_STYLES, workoutsQueryKey } from "@/lib/workouts";

export const Route = createFileRoute("/_authenticated/workouts/$id")({
  head: () => ({
    meta: [
      { title: "Detalji treninga — FitTracker" },
      { name: "description", content: "Detaljne informacije o zabeleženom treningu." },
      { property: "og:title", content: "Detalji treninga — FitTracker" },
      { property: "og:description", content: "Detaljne informacije o zabeleženom treningu." },
    ],
  }),
  component: WorkoutDetail,
});

function WorkoutDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: w, isLoading } = useQuery({ queryKey: ["workout", id], queryFn: () => fetchWorkout(id) });

  async function onDelete() {
    if (!confirm("Da li sigurno želiš da obrišeš ovaj trening?")) return;
    const { error } = await supabase.from("workouts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await qc.invalidateQueries({ queryKey: workoutsQueryKey });
    toast.success("Trening obrisan");
    navigate({ to: "/workouts" });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/workouts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Nazad na listu
      </Link>
      {isLoading ? (
        <p className="text-muted-foreground">Učitavanje…</p>
      ) : !w ? (
        <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">Trening nije pronađen.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
          <div className="bg-brand-gradient p-6 text-primary-foreground">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${TYPE_STYLES[w.type]}`}>{TYPE_LABELS[w.type]}</span>
            <h1 className="mt-3 text-3xl font-semibold">{w.title}</h1>
          </div>
          <div className="grid grid-cols-3 divide-x border-b">
            {[
              { icon: Clock, label: "Trajanje", value: `${w.duration_min} min` },
              { icon: Flame, label: "Kalorije", value: `${w.calories} kcal` },
              { icon: Calendar, label: "Datum", value: formatDate(w.date) },
            ].map((s) => (
              <div key={s.label} className="p-5 text-center">
                <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <p className="font-display font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 p-6">
            <h2 className="text-sm font-semibold text-muted-foreground">Napomena</h2>
            <p className="whitespace-pre-wrap">{w.notes || "Bez napomene."}</p>
          </div>
          <div className="flex justify-end border-t p-4">
            <button onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" /> Obriši
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
