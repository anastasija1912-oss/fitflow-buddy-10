import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export type WorkoutType = "kardio" | "snaga" | "joga";

export interface Workout {
  id: string;
  user_id: string;
  title: string;
  type: WorkoutType;
  duration_min: number;
  calories: number;
  date: string;
  notes: string | null;
  created_at: string;
}

export const TYPE_LABELS: Record<WorkoutType, string> = {
  kardio: "Kardio",
  snaga: "Snaga",
  joga: "Joga",
};

export const TYPE_STYLES: Record<WorkoutType, string> = {
  kardio: "bg-pink-soft text-accent-foreground",
  snaga: "bg-lilac-soft text-secondary-foreground",
  joga: "bg-success-soft text-success",
};

export const workoutSchema = z.object({
  title: z.string().trim().min(1, "Unesite naziv").max(100, "Najviše 100 karaktera"),
  type: z.enum(["kardio", "snaga", "joga"]),
  duration_min: z.coerce.number().int().min(1, "Minimum 1 min").max(1440, "Maksimum 1440 min"),
  calories: z.coerce.number().int().min(0, "Ne može biti negativno").max(20000, "Previše"),
  date: z.string().min(1, "Izaberite datum"),
  notes: z.string().trim().max(1000, "Najviše 1000 karaktera").optional(),
});

export const workoutsQueryKey = ["workouts"] as const;

export async function fetchWorkouts(): Promise<Workout[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Workout[];
}

export async function fetchWorkout(id: string): Promise<Workout | null> {
  const { data, error } = await supabase.from("workouts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Workout | null;
}

export function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("sr-Latn-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
