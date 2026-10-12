"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/modelos", label: "Modelos" },
  { href: "/#funcionalidades", label: "Funcionalidades" },
  { href: "/planos", label: "Planos e preços" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-colors",
        scrolled || open ? "border-b border-line bg-paper/90 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Logo />
        <nav aria-label="Principal" className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
          {LINKS.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "rounded-full px-3 py-1.5 text-sm transition hover:text-ink",
                pathname === l.href ? "text-ink" : "text-muted",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface-2 sm:block">
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-ink transition hover:opacity-90 sm:block"
          >
            Criar meu cardápio
          </Link>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-line bg-paper px-5 pb-10 lg:hidden">
          <nav aria-label="Principal" className="flex flex-col py-4">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-line py-4 font-display text-xl text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-3">
            <Link href="/cadastro" className="rounded-full bg-brand py-3 text-center font-semibold text-brand-ink">
              Criar meu cardápio
            </Link>
            <Link href="/login" className="rounded-full border border-line py-3 text-center font-medium text-ink">
              Entrar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
