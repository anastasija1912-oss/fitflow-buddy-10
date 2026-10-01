import { Link } from "@tanstack/react-router";
import { ChevronRight, Clock, Flame } from "lucide-react";
import { TYPE_LABELS, TYPE_STYLES, formatDate, type Workout } from "@/lib/workouts";

export function WorkoutRow({ w }: { w: Workout }) {
  return (
    <Link
      to="/workouts/$id"
      params={{ id: w.id }}
      className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft"
    >
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${TYPE_STYLES[w.type]}`}>
        {TYPE_LABELS[w.type]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{w.title}</p>
        <p className="text-sm text-muted-foreground">{formatDate(w.date)}</p>
      </div>
      <div className="hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{w.duration_min} min</span>
        <span className="flex items-center gap-1"><Flame className="h-4 w-4" />{w.calories} kcal</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
