import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { TEMPLATES } from "@/templates/registry";
import { isSupabaseConfigured } from "@/lib/env";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh bg-paper lg:grid-cols-[1fr_minmax(0,520px)]">
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/modelos" className="text-sm text-muted hover:text-ink">
            Ver modelos
          </Link>
        </div>
        <main id="conteudo" className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          {isSupabaseConfigured() ? (
            children
          ) : (
            <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
              A autenticação ainda não foi configurada neste ambiente. Defina as variáveis do Supabase (veja o README).
            </p>
          )}
        </main>
        <p className="text-center text-xs text-muted">
          Ao continuar, você concorda com os{" "}
          <Link href="/termos" className="underline underline-offset-2">
            termos de uso
          </Link>{" "}
          e a{" "}
          <Link href="/privacidade" className="underline underline-offset-2">
            política de privacidade
          </Link>
          .
        </p>
      </div>

      <aside className="relative hidden overflow-hidden bg-brand text-brand-ink lg:flex lg:flex-col lg:justify-between lg:p-12">
        <p className="font-display text-3xl font-semibold leading-tight">
          Dez cardápios prontos, esperando o seu logotipo.
        </p>
        <ul className="grid grid-cols-2 gap-3" aria-hidden>
          {TEMPLATES.slice(0, 6).map((t) => (
            <li key={t.meta.slug} className="overflow-hidden rounded-2xl" style={{ background: t.theme.colors.background }}>
              <div className="flex h-2">
                {[t.theme.colors.primary, t.theme.colors.secondary, t.theme.colors.highlight].map((c) => (
                  <span key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              <p className="px-4 py-4 text-sm" style={{ color: t.theme.colors.heading }}>
                {t.meta.name}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-sm opacity-75">Sem fidelidade. Seu QR Code continua o mesmo para sempre.</p>
      </aside>
    </div>
  );
}
