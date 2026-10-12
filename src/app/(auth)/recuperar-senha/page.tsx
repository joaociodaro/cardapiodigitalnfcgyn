import type { Metadata } from "next";
import Link from "next/link";
import { ResetRequestForm } from "./ResetRequestForm";

export const metadata: Metadata = { title: "Recuperar senha", robots: { index: false } };

export default function RecuperarSenhaPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Recuperar senha</h1>
      <p className="mt-2 text-sm text-muted">Informe o e-mail da sua conta. Enviaremos um link para criar uma nova senha.</p>
      <div className="mt-8">
        <ResetRequestForm />
        <Link href="/login" className="mt-6 inline-block text-sm font-medium text-muted hover:text-ink">
          Voltar para o login
        </Link>
      </div>
    </>
  );
}
