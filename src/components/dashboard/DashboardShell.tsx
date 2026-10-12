"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronsUpDown, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { NAV_GROUPS } from "./nav";
import { signOutAction } from "@/app/(auth)/actions";
import { switchEstablishmentAction } from "@/app/dashboard/actions";

interface Props {
  children: ReactNode;
  userName: string;
  userEmail: string;
  isAdmin: boolean;
  establishments: Array<{ id: string; name: string }>;
  currentId: string | null;
  planLabel: string;
}

export function DashboardShell({ children, userName, userEmail, isAdmin, establishments, currentId, planLabel }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const current = establishments.find((e) => e.id === currentId);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      {current && (
        <div className="px-3">
          {establishments.length > 1 ? (
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-left [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{current.name}</span>
                  <span className="block text-xs text-muted">{planLabel}</span>
                </span>
                <ChevronsUpDown className="size-4 shrink-0 text-muted" />
              </summary>
              <div className="absolute inset-x-0 top-full z-20 mt-1 rounded-xl border border-line bg-surface p-1 shadow-lg">
                {establishments.map((e) => (
                  <form key={e.id} action={switchEstablishmentAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <button
                      type="submit"
                      className={clsx("w-full truncate rounded-lg px-3 py-2 text-left text-sm", e.id === currentId ? "bg-surface-2 font-semibold text-ink" : "text-muted hover:bg-surface-2 hover:text-ink")}
                    >
                      {e.name}
                    </button>
                  </form>
                ))}
                <Link href="/dashboard/bem-vindo?nova=1" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2 hover:text-ink">
                  Adicionar estabelecimento
                </Link>
              </div>
            </details>
          ) : (
            <div className="rounded-xl border border-line bg-surface px-3 py-2.5">
              <span className="block truncate text-sm font-semibold text-ink">{current.name}</span>
              <span className="block text-xs text-muted">{planLabel}</span>
            </div>
          )}
        </div>
      )}

      <nav aria-label="Painel" className="mt-4 flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((g) => (
          <div key={g.label} className="mt-4 first:mt-0">
            <p className="px-3 pb-1.5 text-xs font-medium text-muted">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map(({ href, label, Icon, exact }) => {
                const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                        active ? "bg-brand text-brand-ink" : "text-muted hover:bg-surface-2 hover:text-ink",
                      )}
                    >
                      <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {isAdmin && (
          <Link href="/admin" className="mt-6 flex items-center gap-3 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-muted hover:text-ink">
            <ShieldCheck className="size-4" /> Administração
          </Link>
        )}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-ink" aria-hidden>
            {(userName || userEmail).charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-ink">{userName || "Minha conta"}</span>
            <span className="block truncate text-xs text-muted">{userEmail}</span>
          </span>
          <ThemeToggle />
        </div>
        <form action={signOutAction}>
          <button type="submit" className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface-2 hover:text-ink">
            <LogOut className="size-4" /> Sair
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-svh bg-paper lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-svh border-r border-line bg-paper lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur lg:hidden">
        <Logo />
        <button type="button" onClick={() => setOpen(true)} aria-label="Abrir menu" aria-expanded={open} className="grid size-9 place-items-center rounded-full text-ink">
          <Menu className="size-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu do painel">
          <button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs bg-paper shadow-xl">
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="absolute right-3 top-3.5 z-10 grid size-9 place-items-center rounded-full text-ink">
              <X className="size-5" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <main id="conteudo" className="min-w-0">
        {children}
      </main>
    </div>
  );
}
