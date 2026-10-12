import Link from "next/link";
import { site } from "@/config/site";

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="3" y="3" width="26" height="26" rx="7" fill="var(--brand)" />
      <path d="M11 10h10M11 15h10M11 20h6" stroke="var(--brand-ink)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="21" r="3" fill="var(--accent)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} — início`}>
      <LogoMark />
      <span className="font-display text-[1.35rem] font-semibold tracking-tight text-ink">{site.name.toLowerCase()}</span>
    </Link>
  );
}
