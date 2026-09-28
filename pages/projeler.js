import { useState } from "react";
import Layout from "@/components/site/Layout";
import { PROFILE, PROJECTS, STATUS_LABEL } from "@/components/site/data";
import { Chip, Icon, btn } from "@/components/site/ui";

const FILTERS = [
  { id: "all", label: "Tümü", match: () => true },
  { id: "live", label: "Yayında", match: (p) => p.status === "live" },
  { id: "wip", label: "Geliştiriliyor", match: (p) => p.status === "wip" },
];

function ProjectCard({ project }) {
  const live = project.status === "live";
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-card-low via-card-mid to-accent-soft/70">
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, #c6c6cc 1px, transparent 1px)", backgroundSize: "18px 18px" }}
        />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-card text-accent shadow-lg transition-transform duration-500 group-hover:scale-105">
          <Icon name={project.icon} className="text-[48px]" />
        </div>
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-md bg-card/90 px-2.5 py-1 font-mono text-badge font-semibold uppercase text-fg backdrop-blur-md">
            {project.category === "ai" ? "AI Aracı" : "Geliştirici Aracı"}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-card/95 px-3 py-1.5 shadow-sm backdrop-blur-md">
          <span className={`h-2 w-2 rounded-full ${live ? "bg-live" : "bg-outline"}`} />
          <span className="font-mono text-badge font-semibold text-fg">{STATUS_LABEL[project.status]}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-6 p-7 md:p-8">
        <div className="space-y-3">
          <h2 className="font-display text-headline-md text-fg transition-colors group-hover:text-accent">{project.title}</h2>
          <p className="text-label-md text-accent">{project.tagline}</p>
          <p className="text-body-md text-muted">{project.description}</p>
          <ul className="space-y-1.5 pt-1">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-body-sm text-muted">
                <Icon name="check_circle" className="mt-0.5 text-[16px] text-accent" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-5">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <Chip key={t} className="bg-card-low px-2.5 py-1">{t}</Chip>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <a href={project.href} className="inline-flex items-center gap-1.5 text-label-md text-fg transition-colors hover:text-accent">
              {live ? "Aracı Aç" : "Proje Sayfası"}
              <Icon name={live ? "open_in_new" : "arrow_forward"} className="text-[16px]" />
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-label-md text-muted transition-colors hover:text-accent"
            >
              GitHub
              <Icon name="north_east" className="text-[16px]" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const active = FILTERS.find((f) => f.id === filter);
  const visible = PROJECTS.filter(active.match);

  return (
    <Layout title="Projeler" description="Ege İzgi'nin geliştirdiği yapay zeka destekli web araçları ve projeler.">
      <section className="mx-auto w-full max-w-6xl px-5 pb-10 pt-12 md:px-6">
        <div className="flex flex-col justify-between gap-8 pb-10 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-card-high px-3 py-1">
              <span className="font-mono text-badge uppercase tracking-widest text-muted">Seçilmiş İşler — {new Date().getFullYear()}</span>
            </div>
            <h1 className="font-display text-display-mobile text-fg md:text-display">Projeler</h1>
            <p className="text-body-lg text-muted">
              Fikirden yayına kadar kendim geliştirdiğim; CV analizinden mülakat pratiğine, sınav hazırlığından kod incelemeye
              uzanan yapay zeka destekli araçlar.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-xl bg-card-low px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="font-mono text-badge text-fg">
              {PROJECTS.filter((p) => p.status === "live").length} yayında · {PROJECTS.filter((p) => p.status === "wip").length} geliştiriliyor
            </span>
          </div>
        </div>
        <div className="flex w-fit flex-wrap items-center gap-2 rounded-xl bg-card-low p-1.5">
          {FILTERS.map((f) => {
            const count = PROJECTS.filter(f.match).length;
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={on}
                className={`rounded-lg px-4 py-2 text-label-md transition-all duration-200 ${
                  on ? "bg-card text-fg shadow-sm" : "text-muted hover:bg-card-mid hover:text-fg"
                }`}
              >
                {f.label}
                <span className="ml-1.5 font-mono text-badge opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {visible.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="mt-16 w-full bg-card-low py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-center md:px-6">
          <div className="max-w-xl space-y-2">
            <h2 className="font-display text-headline-lg text-fg">Tüm kodlar GitHub'da</h2>
            <p className="text-body-md text-muted">
              Denemelerimi, ders projelerimi ve yeni fikirlerimi GitHub profilimde paylaşıyorum.
            </p>
          </div>
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className={btn.primary}>
            <Icon name="code" className="text-[18px]" />
            github.com/{PROFILE.githubHandle}
          </a>
        </div>
      </section>
    </Layout>
  );
}
