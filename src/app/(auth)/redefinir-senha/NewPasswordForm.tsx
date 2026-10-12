"use client";

import { useActionState } from "react";
import { Field, FormAlert, SubmitButton, type ActionState } from "@/components/ui/form";
import { updatePasswordAction } from "../actions";

export function NewPasswordForm() {
  const [state, action] = useActionState<ActionState, FormData>(updatePasswordAction, {});
  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
      <Field
        label="Nova senha"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        error={state.errors?.password}
        hint="Pelo menos 8 caracteres, com letras e números."
      />
      <Field label="Confirme a nova senha" name="confirm" type="password" autoComplete="new-password" required error={state.errors?.confirm} />
      <SubmitButton pendingLabel="Salvando…" className="w-full">
        Salvar nova senha
      </SubmitButton>
    </form>
  );
}
