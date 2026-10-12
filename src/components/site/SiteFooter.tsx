import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Produto",
    links: [
      { href: "/modelos", label: "Modelos de cardápio" },
      { href: "/como-funciona", label: "Como funciona" },
      { href: "/planos", label: "Planos e preços" },
      { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
    ],
  },
  {
    title: "Conta",
    links: [
      { href: "/cadastro", label: "Criar conta" },
      { href: "/login", label: "Entrar" },
      { href: "/recuperar-senha", label: "Recuperar senha" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/contato", label: "Contato" },
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Política de privacidade" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Cardápios digitais prontos para restaurantes, bares e cafeterias que levam a apresentação a sério.
          </p>
          <p className="mt-4 text-sm text-muted">
            <a href={`mailto:${site.email}`} className="hover:text-ink">
              {site.email}
            </a>
          </p>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <h2 className="text-sm font-semibold text-ink">{c.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          <p>Pagamentos processados pelo Mercado Pago. Não armazenamos dados de cartão.</p>
        </div>
      </div>
    </footer>
  );
}
