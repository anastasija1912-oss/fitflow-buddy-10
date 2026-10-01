import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Search } from "lucide-react";
import { fetchWorkouts, TYPE_LABELS, workoutsQueryKey, type WorkoutType } from "@/lib/workouts";
import { WorkoutRow } from "@/components/WorkoutRow";

const searchSchema = z.object({
  type: z.enum(["all", "kardio", "snaga", "joga"]).catch("all").default("all"),
  q: z.string().catch("").default(""),
});

export const Route = createFileRoute("/_authenticated/workouts/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Moji treninzi — FitTracker" },
      { name: "description", content: "Pregled i filtriranje svih zabeleženih treninga." },
      { property: "og:title", content: "Moji treninzi — FitTracker" },
      { property: "og:description", content: "Pregled i filtriranje svih zabeleženih treninga." },
    ],
  }),
  component: WorkoutsList,
});

function WorkoutsList() {
  const { type, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: workouts = [], isLoading } = useQuery({ queryKey: workoutsQueryKey, queryFn: fetchWorkouts });

  const filtered = workouts.filter(
    (w) => (type === "all" || w.type === type) && w.title.toLowerCase().includes(q.toLowerCase()),
  );
  const tabs: ("all" | WorkoutType)[] = ["all", "kardio", "snaga", "joga"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Moji treninzi</h1>
        <p className="text-muted-foreground">{workouts.length} ukupno zabeleženih</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-1 rounded-xl border bg-card p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => navigate({ search: (p) => ({ ...p, type: t }) })}
              className={`rounded-lg px-4 py-1.5 text-sm transition ${type === t ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t === "all" ? "Svi" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => navigate({ search: (p) => ({ ...p, q: e.target.value }), replace: true })}
            placeholder="Pretraži po nazivu…"
            className="w-full rounded-xl border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Učitavanje…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">Nema treninga za izabrani filter.</div>
      ) : (
        <div className="space-y-3">{filtered.map((w) => <WorkoutRow key={w.id} w={w} />)}</div>
      )}
    </div>
  );
}
