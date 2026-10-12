import Link from "next/link";
import { Logo } from "@/components/site/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-paper px-5 text-center">
      <Logo />
      <p className="mt-12 font-display text-7xl font-semibold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Esta página não existe</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        O link pode estar incorreto ou o cardápio foi despublicado pelo estabelecimento.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-ink">Ir para o início</Link>
        <Link href="/modelos" className="rounded-full border border-line px-5 py-3 text-sm font-medium text-ink">Ver modelos</Link>
      </div>
    </div>
  );
}
