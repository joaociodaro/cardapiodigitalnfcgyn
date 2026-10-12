import Link from "next/link";
import { Logo } from "./Logo";

/**
 * Tela provisória enquanto a autenticação (etapa 3) não está ligada.
 * Será substituída pelos formulários reais com Supabase Auth.
 */
export function AuthPending({ title }: { title: string }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-paper px-5 py-16">
      <Logo />
      <div className="mt-10 w-full max-w-md rounded-3xl border border-line bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          O cadastro e o login estão em implantação e serão ativados na próxima etapa da plataforma. Enquanto isso, você pode explorar todos os
          modelos de cardápio.
        </p>
        <div className="mt-6 grid gap-2">
          <Link href="/modelos" className="rounded-full bg-brand py-3 text-center text-sm font-semibold text-brand-ink">
            Explorar modelos
          </Link>
          <Link href="/" className="rounded-full border border-line py-3 text-center text-sm font-medium text-ink">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
