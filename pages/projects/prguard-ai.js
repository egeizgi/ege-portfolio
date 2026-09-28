import Layout from "@/components/site/Layout";
import { PROFILE } from "@/components/site/data";
import { Icon, btn } from "@/components/site/ui";

const checks = [
  "Pull request diff analizi",
  "Bug ve güvenlik riski işaretleme",
  "Eksik test önerileri",
  "GitHub App entegrasyonu",
];

const waitlist = `mailto:${PROFILE.email}?subject=PRGuard%20AI%20Waitlist`;

export default function PrguardAiProject() {
  return (
    <Layout title="PRGuard AI" description="Küçük ekipler için pull request'leri merge öncesi inceleyen AI code review aracı.">
      <section className="relative mx-auto w-full max-w-6xl px-5 md:px-6">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[280px] w-[640px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]" />
        <div className="relative grid items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card-low px-3.5 py-1.5 font-mono text-badge uppercase tracking-wider text-muted shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-outline" />
              Geliştiriliyor
            </span>
            <h1 className="font-display text-display-mobile text-fg md:text-display">PRGuard AI</h1>
            <p className="max-w-2xl text-body-lg text-muted">
              Küçük ekipler için pull request'leri merge öncesi inceleyen; hataları, güvenlik risklerini ve eksik testleri
              yakalamaya odaklanan AI code review aracı.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={waitlist} className={btn.primary}>
                <Icon name="mail" className="text-[18px]" />
                Bekleme Listesine Katıl
              </a>
              <a href={PROFILE.github} target="_blank" rel="noreferrer" className={btn.secondary}>
                <Icon name="code" className="text-[18px] text-accent" />
                GitHub
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-md">
            <div className="flex items-center justify-between gap-4 border-b border-card-high pb-4">
              <div>
                <p className="font-display text-headline-sm text-fg">Yol haritası</p>
                <p className="mt-1 text-body-sm text-muted">Tanıtım sayfası hazır</p>
              </div>
              <span className="rounded bg-accent-soft px-2.5 py-1 font-mono text-badge font-semibold text-on-accent-soft">
                Faz 1
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {checks.map((check) => (
                <div key={check} className="flex items-center gap-2.5 rounded-xl bg-card-low px-4 py-3 text-body-md text-fg">
                  <Icon name="check_circle" className="text-[18px] text-accent" />
                  {check}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
