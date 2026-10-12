import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewPasswordForm } from "./NewPasswordForm";

export const metadata: Metadata = { title: "Nova senha", robots: { index: false } };

export default async function RedefinirSenhaPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Criar nova senha</h1>
      {data.user ? (
        <>
          <p className="mt-2 text-sm text-muted">Conta: {data.user.email}</p>
          <div className="mt-8">
            <NewPasswordForm />
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">Este link expirou ou já foi usado. Solicite um novo para continuar.</p>
          <Link href="/recuperar-senha" className="mt-8 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-ink">
            Solicitar novo link
          </Link>
        </>
      )}
    </>
  );
}
