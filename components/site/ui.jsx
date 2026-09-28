import { useState } from "react";

export function Icon({ name, className = "", filled = false }) {
  return (
    <span
      className={`ms-icon ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export function PulseDot({ color = "bg-accent" }) {
  return (
    <span className="relative flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${color}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}

export function Chip({ children, strong = false, className = "" }) {
  return (
    <span
      className={`rounded px-2 py-0.5 font-mono text-badge ${
        strong ? "bg-accent-soft font-semibold text-on-accent-soft" : "bg-card-mid text-muted"
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-6 rounded-full bg-accent" />
      <span className="font-mono text-badge font-semibold uppercase tracking-wider text-accent">{children}</span>
    </div>
  );
}

export function StatusBadge({ status, label }) {
  const live = status === "live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-badge font-semibold ${
        live ? "bg-accent-soft text-on-accent-soft" : "bg-card-mid text-muted"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-live" : "bg-outline"}`} />
      {label}
    </span>
  );
}

export function CopyEmailButton({ email, className = "", iconClass = "" }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button type="button" onClick={copy} className={className} title="E-postayı kopyala">
      <Icon name={copied ? "check" : "content_copy"} className={`text-[18px] ${iconClass}`} />
      <span aria-live="polite">{copied ? "Kopyalandı!" : email}</span>
    </button>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-ink text-white text-label-md shadow-md transition-all hover:bg-ink-soft hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-card text-fg text-label-md shadow-sm ring-1 ring-card-high transition-all hover:bg-card-low",
};
