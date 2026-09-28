import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { NAV, PROFILE } from "./data";
import { Icon, PulseDot } from "./ui";

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink font-display text-[13px] font-bold text-white">
        {PROFILE.initials}
      </span>
      <span className="font-display text-headline-sm tracking-tight text-fg">
        egeizgi<span className="text-accent">.dev</span>
      </span>
    </Link>
  );
}

function Header() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 bg-card/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 rounded-lg bg-card-low p-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-label-md transition-colors ${
                  active ? "bg-card-high font-semibold text-fg" : "text-muted hover:bg-card-mid hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/ozgecmis"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-ink px-3.5 text-label-md text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:bg-ink-soft"
          >
            <Icon name="description" className="text-[16px]" />
            <span className="hidden sm:inline">Özgeçmiş</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-card-mid md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menüyü aç/kapat"
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} className="text-[22px]" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-card-high bg-card px-5 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-label-md ${
                pathname === item.href ? "bg-card-low font-semibold text-fg" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="no-print mt-24 w-full bg-card shadow-[0_-1px_6px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row md:px-6">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-card-low px-2.5 py-1">
            <PulseDot />
            <span className="font-mono text-badge uppercase tracking-wider text-muted">
              {PROFILE.location} · GMT+3
            </span>
          </div>
          <p className="text-body-sm text-muted">
            © {new Date().getFullYear()} {PROFILE.name}. Tüm hakları saklıdır.
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 p-1.5 text-label-sm hover:text-fg"
          >
            <Icon name="code" className="text-[18px]" />
            GitHub
          </a>
          <a href={`mailto:${PROFILE.email}`} className="flex items-center gap-1.5 p-1.5 text-label-sm hover:text-fg">
            <Icon name="mail" className="text-[18px]" />
            E-posta
          </a>
          <a href="#top" className="flex items-center gap-1.5 p-1.5 text-label-sm hover:text-fg">
            <Icon name="arrow_upward" className="text-[18px]" />
            Yukarı
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ title, description, children }) {
  const fullTitle = title ? `${title} · ${PROFILE.name}` : `${PROFILE.name} · Portfolyo & CV`;
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description || PROFILE.bio} />
      </Head>
      <div id="top" className="min-h-screen bg-canvas text-fg">
        <Header />
        <main className="w-full overflow-x-clip pt-16">{children}</main>
        <Footer />
      </div>
    </>
  );
}
