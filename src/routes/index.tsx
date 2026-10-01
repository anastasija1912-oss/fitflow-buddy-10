import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, BarChart3, ListChecks, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FitTracker - Evidencija Treninga" },
      { name: "description", content: "Lako beleži treninge, prati statistiku i svoj napredak." },
      { property: "og:title", content: "FitTracker - Evidencija Treninga" },
      { property: "og:description", content: "Lako beleži treninge, prati statistiku i svoj napredak." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const features = [
    { icon: PlusCircle, title: "Brz unos", text: "Kardio, snaga ili joga — za par sekundi.", tone: "bg-pink-soft text-accent-foreground" },
    { icon: BarChart3, title: "Statistika", text: "Nedeljni pregled minuta i kalorija.", tone: "bg-lilac-soft text-secondary-foreground" },
    { icon: ListChecks, title: "Istorija", text: "Filtriraj i pregledaj svaki trening.", tone: "bg-success-soft text-success" },
  ];
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4">
      <header className="flex h-20 items-center justify-between">
        <span className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground"><Activity className="h-5 w-5" /></span>
          FitTracker
        </span>
        <Link to="/auth" className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-muted">Prijava</Link>
      </header>
      <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <span className="mb-6 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground">Evidencija treninga</span>
        <h1 className="max-w-2xl text-5xl font-semibold leading-tight sm:text-6xl">
          Prati svaki trening. <span className="bg-brand-gradient bg-clip-text text-transparent">Vidi napredak.</span>
        </h1>
        <p className="mt-5 max-w-lg text-lg text-muted-foreground">Jednostavan dnevnik za tvoje vežbe, minute i kalorije.</p>
        <Link to="/dashboard" className="mt-8 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-soft hover:opacity-90">
          Započni besplatno
        </Link>
        <div className="mt-16 grid w-full gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-6 text-left shadow-soft">
              <span className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${f.tone}`}><f.icon className="h-5 w-5" /></span>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
