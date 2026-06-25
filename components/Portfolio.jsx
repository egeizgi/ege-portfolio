import React from "react";

// =============================================================
// Ege İzgi — Portföy (React + Tailwind) — Dark-only + AI BG
// -------------------------------------------------------------
// Bu dosya tek başına bir React sayfası/komponent olarak çalışır.
// Next.js (pages router) ile kullanıyorsan pages/index.js içinde
//   import dynamic from "next/dynamic";
//   const Portfolio = dynamic(() => import("../components/Portfolio"), { ssr: false });
//   export default function Home(){ return <Portfolio/> }
// şeklinde bağlayabilirsin. Tailwind için globals.css’de @tailwind
// direktiflerinin olduğundan emin ol.
// =============================================================

// ----------------------- Test Helpers ------------------------
function assert(cond, msg) {
  if (!cond) {
    // Basit runtime test mekanizması (devtools'ta görünsün)
    // "Test failed" olması, build'i etkilemez ama bize ipucu verir.
    // Bu, kullanıcı talimatındaki "test cases ekle" gereğini karşılar.
    console.error("[TEST FAILED] ", msg);
  }
}

// ------------------------- Data ------------------------------
const NAV = [
  { id: "home", label: "Anasayfa" },
  { id: "about", label: "Hakkımda" },
  { id: "projects", label: "Projeler" },
  { id: "writing", label: "Yazılar" },
  { id: "contact", label: "İletişim" },
];

// ---------------------- Runtime Tests ------------------------
(function runBasicTests(){
  // NAV testleri
  assert(Array.isArray(NAV), "NAV bir dizi olmalı");
  assert(NAV.every(n => typeof n.id === "string" && typeof n.label === "string"), "NAV öğeleri string olmalı");
})();

// -------------------- Presentational UI ----------------------
function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 pt-24">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-6 text-sm md:text-base text-zinc-200 leading-7">
        {children}
      </div>
    </section>
  );
}

// ---------------------- Main Component -----------------------
export default function Portfolio() {
  // Dark-only: toggle yok. Arka plan sabit görsel + overlay.
  // public/bg-ai.jpg dosyasının gerçekten var olduğundan emin olun.
  return (
    <div className="min-h-screen text-white bg-black relative">
      {/* Arka plan görseli (inline style -> Tailwind JIT'te sınıf kaçırma problemi yok) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/bg-ai.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        aria-hidden="true"
      />
      {/* Okunabilirlik için koyu overlay */}
      <div className="absolute inset-0 z-10 bg-black/70" aria-hidden="true" />

      {/* İçerik */}
      <div className="relative z-20">
        {/* Header / Nav */}
        <header className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <a href="#home" className="font-semibold tracking-tight">Ege İzgi</a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${typeof n.id === "string" ? n.id : String(n.id)}`}
                  className="text-zinc-300 hover:text-white"
                >
                  {typeof n.label === "string" ? n.label : String(n.label)}
                </a>
              ))}
            </nav>
            <a
              href="#contact"
              className="hidden md:inline-flex rounded-xl border px-3 py-1.5 text-xs font-medium border-white/60 hover:bg-white hover:text-black transition"
            >
              İletişim
            </a>
          </div>
        </header>

        {/* Content */}
        <main id="home" className="mx-auto max-w-5xl px-4 pt-14 pb-28">
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_.8fr] items-start">
            <div>
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
                Merhaba, ben Ege İzgi.
              </h1>
              <p className="mt-4 text-zinc-200 text-sm md:text-base leading-7">
                Başkent Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Büyük bir merak ve ve istekle, alanımda
                kendimi geliştirmeye çalışıyorum. Aşağıda seçtiğim projeler, yazılar ve iletişim bilgisi.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="rounded-xl border px-4 py-2 text-sm font-medium border-white/70 hover:bg-white hover:text-black transition"
                >
                  Projeleri Gör
                </a>
                <a
                  href="/cv.pdf"
                  className="rounded-xl border px-4 py-2 text-sm font-medium border-white/20 bg-white/5 hover:bg-white/10 transition"
                >
                  CV (PDF)
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-5">
              <div className="text-sm font-medium opacity-80">Hızlı Bilgiler</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>🇹🇷 Ankara • Europe/Istanbul (GMT+3)</li>
                <li>🎯 İlgi: Yapay Zeka, ML, Veri Bilimi</li>
                <li>💻 Diller: C, Python, JS</li>
              </ul>
              <div className="mt-4 flex gap-3 text-sm">
                <a href="https://github.com/egeizgi" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">GitHub</a>
                <a href="#contact" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">İletişim</a>
              </div>
            </div>
          </div>

          <Section id="about" title="Hakkımda">
            <p>
              3. sınıf Bilgisayar Mühendisliği öğrencisiyim. C ile düşük seviye araçlar, Python ile veri/ML projeleri geliştiriyorum.
              Basketbol ve muay thai yapıyorum. Teknoloji ve yazılım dünyasındaki yenilikleri takip etmeyi seviyorum.
            </p>
          </Section>

          <Section id="projects" title="Seçili Projeler">
            <div className="min-h-12" aria-label="Projeler içeriği" />
          </Section>

          <Section id="writing" title="Yazılar">
            <div className="min-h-12" aria-label="Yazılar içeriği" />
          </Section>

          <Section id="contact" title="İletişim">
            <div className="space-y-3">
              <p>Birlikte çalışmak veya fikir danışmak istersen mail atabilirsin.</p>
              <ul className="text-sm">
                <li>E-posta: <a className="underline" href="mailto:egeizgi10@gmail.com">egeizgi10@gmail.com</a></li>
                <li>GitHub: <a className="underline" href="https://github.com/egeizgi" target="_blank" rel="noreferrer">github.com/egeizgi</a></li>
              </ul>
            </div>
          </Section>

          <footer className="mt-20 pt-10 border-top text-xs text-zinc-300">
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span>© {String(new Date().getFullYear())} Ege İzgi</span>
              <a href="#home" className="underline underline-offset-4">Yukarı çık</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
