CREATE TYPE public.workout_type AS ENUM ('kardio','snaga','joga');
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  title TEXT NOT NULL,
  type public.workout_type NOT NULL,
  duration_min INTEGER NOT NULL CHECK (duration_min > 0 AND duration_min <= 1440),
  calories INTEGER NOT NULL DEFAULT 0 CHECK (calories >= 0 AND calories <= 20000),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workouts TO authenticated;
GRANT ALL ON public.workouts TO service_role;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own workouts select" ON public.workouts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own workouts insert" ON public.workouts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own workouts update" ON public.workouts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own workouts delete" ON public.workouts FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX workouts_user_date_idx ON public.workouts(user_id, date DESC);