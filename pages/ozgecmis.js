import Link from "next/link";
import Layout from "@/components/site/Layout";
import { HOBBIES, INTERESTS, PROFILE, SKILLS } from "@/components/site/data";
import { Chip, Icon } from "@/components/site/ui";

const card = "print-flat rounded-xl bg-card p-6 shadow-sm";

function SectionTitle({ icon, children, meta }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Icon name={icon} className="text-[20px] text-accent" />
        <h2 className="font-display text-headline-md text-fg">{children}</h2>
      </div>
      {meta && <span className="font-mono text-badge text-muted">{meta}</span>}
    </div>
  );
}

export default function Resume() {
  const summary = [
    { label: "Eğitim", value: PROFILE.year, unit: "", sub: `${PROFILE.department} · ${PROFILE.school}` },
    { label: "İlgi Alanları", value: "AI", unit: "· ML · Veri", sub: "Yapay zeka ve veri bilimi" },
    { label: "Ana Diller", value: "C", unit: "· Python · JS", sub: "Sistem ve veri" },
    { label: "Konum", value: "Ankara", unit: "GMT+3", sub: PROFILE.timezone },
  ];

  return (
    <Layout title="Özgeçmiş" description="Ege İzgi — Bilgisayar Mühendisliği öğrencisi. Eğitim, ilgi alanları ve teknik yetkinlikler.">
      <div className="relative w-full overflow-hidden pb-12 pt-8">
        <div className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-6">
          <div className="flex flex-col justify-between gap-6 pb-10 lg:flex-row lg:items-end">
            <div className="flex max-w-2xl flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card-mid px-2.5 py-1 font-mono text-badge text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {PROFILE.name}
                </span>
                <span className="font-mono text-badge uppercase tracking-wider text-muted">{PROFILE.email}</span>
              </div>
              <h1 className="font-display text-headline-lg text-fg">Özgeçmiş</h1>
              <p className="text-body-lg text-muted">{PROFILE.bio}</p>
            </div>
            <div className="no-print flex shrink-0 flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-label-md text-white shadow-sm transition-all hover:bg-ink-soft"
              >
                <Icon name="picture_as_pdf" className="text-[18px]" />
                PDF Olarak Kaydet
              </button>
            </div>
          </div>

          <div className="print-flat mb-12 grid grid-cols-2 gap-4 rounded-xl bg-card p-5 shadow-sm md:grid-cols-4">
            {summary.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="font-mono text-badge uppercase text-muted">{s.label}</span>
                <span className="font-display text-headline-md text-fg">
                  {s.value} {s.unit && <span className="text-body-sm text-accent">{s.unit}</span>}
                </span>
                <span className="text-body-sm text-muted">{s.sub}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* SOL KOLON */}
            <div className="flex flex-col gap-8 lg:col-span-7">
              <section className="flex flex-col gap-6">
                <SectionTitle icon="school">Eğitim</SectionTitle>
                <div className={`${card} flex flex-col justify-between gap-6 md:flex-row md:items-center`}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-card-mid text-accent">
                      <Icon name="account_balance" className="text-[24px]" />
                    </div>
                    <div>
                      <h3 className="font-display text-headline-sm text-fg">{PROFILE.school}</h3>
                      <p className="text-body-md text-accent">{PROFILE.department} (Lisans)</p>
                      <p className="mt-1 text-body-sm text-muted">Ankara</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-end justify-between border-t border-card-high pt-3 md:flex-col md:justify-center md:border-l md:border-t-0 md:pl-6 md:pt-0">
                    <span className="font-mono text-badge text-muted">DURUM</span>
                    <span className="font-display text-headline-sm text-fg">{PROFILE.year}</span>
                    <span className="text-label-sm font-medium text-accent">Devam ediyor</span>
                  </div>
                </div>
              </section>
              <div className={`${card} flex flex-col gap-4`}>
                <div className="flex items-center gap-2">
                  <Icon name="neurology" className="text-[20px] text-accent" />
                  <h3 className="font-display text-headline-sm text-fg">İlgi Alanları</h3>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {INTERESTS.map((i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-card-low p-3">
                      <span className="text-label-md text-fg">{i}</span>
                      <Icon name="arrow_outward" className="text-[16px] text-outline" />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${card} flex flex-col gap-4`}>
                <div className="flex items-center gap-2">
                  <Icon name="sports_basketball" className="text-[20px] text-accent" />
                  <h3 className="font-display text-headline-sm text-fg">Kod Dışında</h3>
                </div>
                <p className="text-body-sm text-muted">{PROFILE.about}</p>
                <div className="flex flex-wrap gap-1.5">
                  {HOBBIES.map((h) => (
                    <Chip key={h}>{h}</Chip>
                  ))}
                </div>
              </div>
            </div>

            {/* SAĞ KOLON */}
            <div className="flex flex-col gap-8 lg:col-span-5">
              <div className={`${card} flex flex-col gap-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="terminal" className="text-[20px] text-accent" />
                    <h2 className="font-display text-headline-sm text-fg">Teknik Yetkinlikler</h2>
                  </div>
                  <span className="font-mono text-badge text-muted">STACK</span>
                </div>
                <div className="flex flex-col gap-5">
                  {SKILLS.map((s) => (
                    <div key={s.group} className="flex flex-col gap-2">
                      <span className="text-label-sm uppercase tracking-wider text-muted">{s.group}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {s.items.map((item) => (
                          <span
                            key={item}
                            className={`rounded px-2.5 py-1 font-mono text-code ${
                              s.strong.includes(item) ? "bg-accent-soft font-semibold text-on-accent-soft" : "bg-card-high text-fg"
                            }`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>



              <div className="no-print flex flex-col gap-4 rounded-xl bg-ink p-6 text-white shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-hover" />
                  <span className="font-mono text-badge uppercase tracking-widest text-on-ink-muted">İletişim</span>
                </div>
                <h3 className="font-display text-headline-sm">Birlikte çalışalım</h3>
                <p className="text-body-sm text-on-ink-muted">
                  Bir proje, staj ya da iş birliği fikrin varsa konuşmaktan memnuniyet duyarım.
                </p>
                <Link
                  href="/iletisim"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-label-md text-white transition-all hover:bg-accent-hover"
                >
                  İletişime Geç
                  <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
