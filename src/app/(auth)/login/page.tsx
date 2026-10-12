import type { Metadata } from "next";
import Link from "next/link";
import { FormAlert } from "@/components/ui/form";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

const NOTICES: Record<string, { tone: "info" | "error" | "success"; text: string }> = {
  sessao: { tone: "info", text: "Entre na sua conta para continuar." },
  saiu: { tone: "success", text: "Você saiu da sua conta." },
  "link-expirado": { tone: "error", text: "O link expirou. Entre com sua senha ou solicite um novo link." },
  "link-invalido": { tone: "error", text: "Este link não é mais válido. Entre com sua senha ou solicite um novo link." },
  "conta-indisponivel": { tone: "error", text: "Esta conta está indisponível. Fale com o suporte se acredita que é um engano." },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; motivo?: string }> }) {
  const { next, motivo } = await searchParams;
  const notice = motivo ? NOTICES[motivo] : undefined;
  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Entrar</h1>
      <p className="mt-2 text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4">
          Crie agora
        </Link>
      </p>
      {notice && (
        <div className="mt-6">
          <FormAlert tone={notice.tone}>{notice.text}</FormAlert>
        </div>
      )}
      <div className="mt-8">
        <LoginForm next={next} />
      </div>
    </>
  );
}
