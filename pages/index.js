import Link from "next/link";
import Layout from "@/components/site/Layout";
import { FOCUS_AREAS, PROFILE } from "@/components/site/data";
import { Chip, CopyEmailButton, Eyebrow, Icon, PulseDot, btn } from "@/components/site/ui";

const HERO_TECH = ["Python", "C", "JavaScript"];

const FACTS = [
  { value: "3.", unit: "sınıf", label: "Bilgisayar Mühendisliği", sub: PROFILE.school },
  { value: "2", unit: "staj", label: "Yapay Zeka / ML", sub: "HAVELSAN · Sisoft" },
  { value: "3", unit: "dil", label: "C · Python · JS", sub: "Günlük kullandıklarım" },
  { value: "GMT", unit: "+3", label: "Ankara, Türkiye", sub: "Europe/Istanbul" },
];

function HeroCard() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      <div className="absolute -inset-4 scale-95 -rotate-2 rounded-3xl bg-gradient-to-tr from-accent/10 via-card-high to-transparent blur-sm" />
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-card shadow-xl">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-card-low via-card to-accent-soft/60">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: "radial-gradient(circle, #c6c6cc 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <span className="relative font-display text-[112px] font-bold leading-none tracking-tighter text-ink">
            {PROFILE.initials}
          </span>
        </div>
        <div className="flex items-end justify-between bg-ink p-4">
          <div>
            <p className="font-display text-headline-sm text-white">{PROFILE.name}</p>
            <p className="text-label-sm text-on-ink-muted">{PROFILE.title}</p>
          </div>
          <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono text-badge font-semibold text-white">
            {PROFILE.year.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="absolute -left-3 -top-3 flex animate-bounce items-center gap-2 rounded-xl bg-card px-3 py-2 shadow-lg [animation-duration:5s] sm:-left-6">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent">
          <Icon name="neurology" className="text-[16px]" />
        </div>
        <div className="flex flex-col">
          <span className="text-label-sm font-semibold text-fg">Yapay Zeka</span>
          <span className="font-mono text-[10px] text-muted">ML · Veri Bilimi</span>
        </div>
      </div>
      <div className="absolute -right-3 top-10 flex items-center gap-2 rounded-xl bg-card px-3 py-2 shadow-lg sm:-right-6">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-card-high text-fg">
          <Icon name="terminal" className="text-[16px]" />
        </div>
        <div className="flex flex-col">
          <span className="text-label-sm font-semibold text-fg">C & Python</span>
          <span className="font-mono text-[10px] text-muted">Low-level · Veri/ML</span>
        </div>
      </div>
      <div className="absolute -left-3 top-[58%] flex items-center gap-2 rounded-xl bg-card px-3 py-1.5 shadow-lg sm:-left-6">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="text-label-sm font-semibold text-fg">JavaScript</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-6">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[280px] w-[640px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]" />

        {/* HERO */}
        <section className="relative pb-16 pt-12 md:pb-24 md:pt-16">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col items-start space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-card-low px-3.5 py-1.5 shadow-sm">
                <PulseDot />
                <span className="font-mono text-badge uppercase tracking-wider text-muted">
                  {PROFILE.school} · {PROFILE.location}
                </span>
              </div>
              <h1 className="font-display text-display-mobile text-fg md:text-display">
                Merhaba, ben {PROFILE.name}. <span className="text-accent">Yapay zeka</span> ve veri bilimi üzerine öğreniyor,
                üretiyorum.
              </h1>
              <p className="max-w-xl text-body-lg text-muted">{PROFILE.bio}</p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/ozgecmis" className={btn.primary}>
                  Özgeçmişe Göz At
                  <Icon name="arrow_forward" className="text-[18px]" />
                </Link>
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className={btn.secondary}>
                  <Icon name="code" className="text-[18px] text-accent" />
                  GitHub
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-4">
                <span className="mr-2 font-mono text-badge uppercase tracking-wider text-outline">Odaklandığım teknolojiler:</span>
                {HERO_TECH.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <HeroCard />
            </div>
          </div>
        </section>

        {/* HIZLI BİLGİLER */}
        <section className="my-6 rounded-2xl bg-card py-8 shadow-sm">
          <div className="grid grid-cols-2 gap-6 px-6 md:grid-cols-4 md:px-8">
            {FACTS.map((f) => (
              <div key={f.label} className="flex flex-col items-center text-center md:items-start md:text-left">
                <span className="font-display text-[40px] font-bold leading-tight tracking-tight text-fg">
                  {f.value}
                  <span className="ml-1 text-headline-sm text-accent">{f.unit}</span>
                </span>
                <span className="mt-1 text-label-md text-muted">{f.label}</span>
                <span className="mt-0.5 font-mono text-[11px] text-outline">{f.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ODAK ALANLARI */}
        <section className="py-16">
          <div className="mb-12 max-w-2xl space-y-2">
            <Eyebrow>İlgi & Uzmanlık Alanları</Eyebrow>
            <h2 className="font-display text-headline-lg text-fg">Üzerinde Çalıştığım Alanlar</h2>
            <p className="text-body-md text-muted">
              Donanıma yakın C kodundan veri ve makine öğrenmesine kadar, her katmanı anlamaya çalışıyorum.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FOCUS_AREAS.map((area) => (
              <div
                key={area.title}
                className="flex flex-col justify-between rounded-xl bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-card-low text-accent">
                    <Icon name={area.icon} className="text-[26px]" />
                  </div>
                  <h3 className="mb-2 font-display text-headline-sm text-fg">{area.title}</h3>
                  <p className="text-body-sm text-muted">{area.text}</p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 pt-6 font-mono text-badge text-outline">
                  {area.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* İLETİŞİM BANDI */}
        <section className="py-16">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white shadow-2xl md:p-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-card-high/10 blur-3xl" />
            <div className="relative z-10 flex max-w-2xl flex-col items-start space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-accent-hover" />
                <span className="font-mono text-badge uppercase tracking-wider">İş birliği & fikir alışverişi</span>
              </div>
              <h2 className="font-display text-headline-lg leading-tight md:text-display">Birlikte bir şey inşa edelim.</h2>
              <p className="text-body-lg text-on-ink-muted">
                Birlikte çalışmak, bir proje fikrini konuşmak ya da sadece tanışmak istersen bana e-posta atabilirsin.
              </p>
              <div className="flex w-full flex-wrap items-center gap-4 pt-4 sm:w-auto">
                <Link
                  href="/iletisim"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-label-md text-ink shadow-md transition-all hover:bg-card-high"
                >
                  <Icon name="mail" className="text-[18px]" />
                  İletişime Geç
                </Link>
                <CopyEmailButton
                  email={PROFILE.email}
                  className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-white/10 px-5 font-mono text-code text-white backdrop-blur transition-all hover:bg-white/15 active:scale-95"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
