"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormAlert, SubmitButton, type ActionState } from "@/components/ui/form";
import { resendConfirmationAction, signInAction } from "../actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<ActionState, FormData>(signInAction, {});
  const [resend, resendAction] = useActionState<ActionState, FormData>(resendConfirmationAction, {});

  return (
    <div className="space-y-5">
      <form action={action} className="space-y-5" noValidate>
        {next && <input type="hidden" name="next" value={next} />}
        {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
        <Field
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          error={state.errors?.email}
        />
        <div>
          <Field label="Senha" name="password" type="password" autoComplete="current-password" required error={state.errors?.password} />
          <Link href="/recuperar-senha" className="mt-2 inline-block text-xs font-medium text-muted hover:text-ink">
            Esqueci minha senha
          </Link>
        </div>
        <SubmitButton pendingLabel="Entrando…" className="w-full">
          Entrar
        </SubmitButton>
      </form>

      {state.errors?.unconfirmed && (
        <form action={resendAction} className="rounded-xl border border-line bg-surface p-4 text-sm">
          <input type="hidden" name="email" value={state.values?.email ?? ""} />
          {resend.message ? (
            <p className="text-muted">{resend.message}</p>
          ) : (
            <>
              <p className="text-muted">Não recebeu o e-mail de confirmação?</p>
              <SubmitButton variant="ghost" pendingLabel="Enviando…" className="mt-3">
                Reenviar link
              </SubmitButton>
            </>
          )}
        </form>
      )}
    </div>
  );
}
