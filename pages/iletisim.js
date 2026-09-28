import { useState } from "react";
import Layout from "@/components/site/Layout";
import { PROFILE } from "@/components/site/data";
import { CopyEmailButton, Icon } from "@/components/site/ui";

const TOPICS = [
  "Proje / İş Birliği",
  "Staj veya İş Fırsatı",
  "Projelerim Hakkında Geri Bildirim",
  "Genel Sohbet",
];

const input =
  "w-full h-11 rounded-lg bg-card-low text-body-md text-fg placeholder:text-outline transition-all focus:bg-card focus:outline-none focus:ring-2 focus:ring-accent/20";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [sent, setSent] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    const subject = `[egeizgi.dev] ${form.topic} — ${form.name}`;
    const body = `${form.message}\n\n—\n${form.name}\n${form.email}`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <Layout title="İletişim" description="Ege İzgi ile iletişime geçin: e-posta ve GitHub.">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-6 md:py-16">
        <div className="relative mb-16 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card-high px-2.5 py-0.5 font-mono text-badge text-fg">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              STATUS: INBOX_OPEN
            </span>
            <span className="font-mono text-badge text-outline">LOC: ANKARA // 39.9334° N, 32.8597° E</span>
          </div>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <h1 className="font-display text-headline-lg text-fg">İletişime Geç</h1>
              <p className="mt-3 text-body-lg text-muted">
                Birlikte çalışmak veya bir fikir danışmak istersen mesaj bırakabilirsin. Form, e-posta uygulamanı hazır bir
                mesajla açar; doğrudan e-posta da atabilirsin.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 rounded-xl bg-card-low p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card-highest text-accent">
                <Icon name="schedule" className="text-[20px]" />
              </div>
              <div>
                <div className="font-mono text-badge uppercase text-outline">Saat Dilimi</div>
                <div className="font-display text-headline-sm text-fg">GMT+3 · Ankara</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* FORM */}
          <section className="flex flex-col gap-6 lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl bg-card p-7 shadow-md md:p-10">
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-accent via-accent-hover to-transparent" />
              <div className="flex items-center justify-between pb-6">
                <div>
                  <span className="font-mono text-badge uppercase tracking-wider text-accent">01 // Mesaj</span>
                  <h2 className="mt-1 font-display text-headline-md text-fg">Bana bir not bırak</h2>
                </div>
                <Icon name="send" className="text-[24px] text-outline-soft" />
              </div>
              <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-label-md text-fg" htmlFor="name">
                      Ad & Soyad <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Icon name="person" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline" />
                      <input id="name" required value={form.name} onChange={update("name")} placeholder="Adın Soyadın" className={`${input} pl-10 pr-3.5`} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-label-md text-fg" htmlFor="email">
                      E-posta Adresi <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Icon name="mail" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline" />
                      <input id="email" type="email" required value={form.email} onChange={update("email")} placeholder="ornek@mail.com" className={`${input} pl-10 pr-3.5`} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="text-label-md text-fg">Konu</span>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {TOPICS.map((t) => (
                      <label key={t} className="cursor-pointer">
                        <input type="radio" name="topic" value={t} checked={form.topic === t} onChange={update("topic")} className="peer sr-only" />
                        <div className="rounded-lg bg-card-low px-3 py-2.5 text-center text-label-sm text-muted transition-all hover:bg-card-mid peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40">
                          {t}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-label-md text-fg" htmlFor="message">
                    Mesajın <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Ne hakkında konuşmak istediğini birkaç cümleyle anlat..."
                    className={`${input} h-auto resize-y p-3.5`}
                  />
                </div>
                <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                  <p className="max-w-sm text-body-sm text-muted">
                    Gönder'e bastığında e-posta uygulaman açılır; mesaj senin hesabından gönderilir.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-ink px-6 text-label-md text-white shadow-sm transition-all hover:bg-ink-soft active:scale-[0.99]"
                  >
                    Mesajı Hazırla
                    <Icon name="rocket_launch" className="text-[18px]" />
                  </button>
                </div>
                {sent && (
                  <div className="flex items-center gap-2 rounded-lg bg-accent-soft p-3.5 text-body-sm text-on-accent-soft">
                    <Icon name="check_circle" className="text-[18px]" />
                    E-posta uygulaman açılmadıysa doğrudan {PROFILE.email} adresine yazabilirsin.
                  </div>
                )}
              </form>
            </div>
          </section>

          {/* DİREKT KANALLAR */}
          <section className="flex flex-col gap-6 lg:col-span-5">
            <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm">
              <span className="font-mono text-badge uppercase tracking-wider text-outline">02 // Direkt Kanallar</span>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-card-low p-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card-highest text-fg">
                    <Icon name="mail" className="text-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-label-sm text-outline">E-posta</div>
                    <a href={`mailto:${PROFILE.email}`} className="block truncate text-body-md font-medium text-fg hover:text-accent">
                      {PROFILE.email}
                    </a>
                  </div>
                </div>
              </div>
              <CopyEmailButton
                email={PROFILE.email}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-card-low text-label-sm text-fg transition-colors hover:bg-card-high"
                iconClass="text-[16px]"
              />
              <div className="flex items-center justify-between gap-3 rounded-xl bg-card-low p-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card-highest text-fg">
                    <Icon name="location_on" className="text-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-label-sm text-outline">Konum / Saat Dilimi</div>
                    <div className="text-body-md font-medium text-fg">{PROFILE.location} (GMT+3)</div>
                  </div>
                </div>
                <span className="shrink-0 rounded bg-card-high px-2 py-1 font-mono text-badge text-muted">TR</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between pb-1">
                <span className="font-mono text-badge uppercase tracking-wider text-outline">03 // Kod</span>
                <span className="font-mono text-badge text-accent">ACTIVE</span>
              </div>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl bg-card-low p-3 transition-all hover:bg-card-mid"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <Icon name="terminal" className="text-[18px] text-fg" />
                  <div className="min-w-0">
                    <div className="truncate text-label-md text-fg transition-colors group-hover:text-accent">GitHub</div>
                    <div className="font-mono text-badge text-outline">@{PROFILE.githubHandle}</div>
                  </div>
                </div>
                <Icon name="north_east" className="text-[16px] text-outline transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
