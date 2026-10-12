import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-5 pb-6 pt-8 sm:px-8 lg:pt-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function PageBody({ children, narrow }: { children: ReactNode; narrow?: boolean }) {
  return <div className={`px-5 py-8 sm:px-8 ${narrow ? "max-w-3xl" : "max-w-6xl"}`}>{children}</div>;
}

export function Panel({ title, description, children, className }: { title?: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-6 ${className ?? ""}`}>
      {title && <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>}
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className={title || description ? "mt-5" : ""}>{children}</div>
    </section>
  );
}

export function EmptyState({
  Icon,
  title,
  children,
  action,
}: {
  Icon: LucideIcon;
  title: string;
  children: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-start rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-10 sm:px-10">
      <Icon className="size-7 text-accent" strokeWidth={1.5} />
      <h2 className="mt-4 font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{children}</div>
      {action && (
        <Link href={action.href} className="mt-6 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink transition hover:opacity-90">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" | "accent" }) {
  const cls =
    variant === "primary"
      ? "bg-brand text-brand-ink hover:opacity-90"
      : variant === "accent"
        ? "bg-accent text-accent-ink hover:brightness-105"
        : "border border-line text-ink hover:border-ink/40";
  return (
    <Link href={href} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${cls}`}>
      {children}
    </Link>
  );
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}
