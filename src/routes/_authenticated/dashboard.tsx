import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Dumbbell, Flame, Plus, TrendingUp } from "lucide-react";
import { fetchWorkouts, todayISO, workoutsQueryKey } from "@/lib/workouts";
import { WorkoutRow } from "@/components/WorkoutRow";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Početna — FitTracker" },
      { name: "description", content: "Statistika, nedeljni pregled i poslednji treninzi." },
      { property: "og:title", content: "Početna — FitTracker" },
      { property: "og:description", content: "Statistika, nedeljni pregled i poslednji treninzi." },
    ],
  }),
  component: Dashboard,
});

const DAYS = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];

function weekDates() {
  const today = new Date(todayISO() + "T00:00:00");
  const dow = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  });
}

function Dashboard() {
  const { data: workouts = [], isLoading } = useQuery({ queryKey: workoutsQueryKey, queryFn: fetchWorkouts });

  const week = weekDates();
  const weekly = week.map((d) => workouts.filter((w) => w.date === d).reduce((s, w) => s + w.duration_min, 0));
  const max = Math.max(60, ...weekly);
  const weekWorkouts = workouts.filter((w) => week.includes(w.date));
  const totalMin = workouts.reduce((s, w) => s + w.duration_min, 0);
  const totalCal = workouts.reduce((s, w) => s + w.calories, 0);
  const today = todayISO();

  const stats = [
    { label: "Ukupno treninga", value: workouts.length, icon: Dumbbell, tone: "bg-pink-soft text-accent-foreground" },
    { label: "Ukupno minuta", value: totalMin, icon: Clock, tone: "bg-lilac-soft text-secondary-foreground" },
    { label: "Utrošeno kcal", value: totalCal, icon: Flame, tone: "bg-pink-soft text-accent-foreground" },
    { label: "Ove nedelje", value: weekWorkouts.length, icon: TrendingUp, tone: "bg-success-soft text-success" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Zdravo! 👋</h1>
          <p className="text-muted-foreground">Evo kako napreduješ.</p>
        </div>
        <Link to="/new" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90">
          <Plus className="h-4 w-4" /> Novi trening
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-soft">
            <span className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="font-display text-2xl font-semibold">{isLoading ? "—" : s.value.toLocaleString("sr-Latn-RS")}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="text-lg font-semibold">Nedeljni pregled</h2>
          <p className="mb-6 text-sm text-muted-foreground">Minuti treninga po danu</p>
          <div className="flex h-44 items-end justify-between gap-2">
            {weekly.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{v || ""}</span>
                <div
                  className={`w-full rounded-lg ${v ? "bg-brand-gradient" : "bg-muted"}`}
                  style={{ height: `${Math.max(6, (v / max) * 120)}px` }}
                />
                <span className={`text-xs ${week[i] === today ? "font-semibold text-primary" : "text-muted-foreground"}`}>{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Poslednji treninzi</h2>
            <Link to="/workouts" className="text-sm text-primary hover:underline">Vidi sve</Link>
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Učitavanje…</p>
          ) : workouts.length === 0 ? (
            <div className="rounded-2xl bg-muted p-8 text-center">
              <p className="font-medium">Još nema treninga</p>
              <p className="mb-4 text-sm text-muted-foreground">Dodaj svoj prvi trening i počni da pratiš napredak.</p>
              <Link to="/new" className="text-sm font-medium text-primary hover:underline">+ Dodaj trening</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.slice(0, 5).map((w) => <WorkoutRow key={w.id} w={w} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
