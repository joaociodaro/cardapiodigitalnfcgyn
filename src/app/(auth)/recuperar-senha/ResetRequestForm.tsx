"use client";

import { useActionState } from "react";
import { Field, FormAlert, SubmitButton, type ActionState } from "@/components/ui/form";
import { requestPasswordResetAction } from "../actions";

export function ResetRequestForm() {
  const [state, action] = useActionState<ActionState, FormData>(requestPasswordResetAction, {});
  if (state.ok) return <FormAlert tone="success">{state.message}</FormAlert>;
  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
      <Field label="E-mail" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} error={state.errors?.email} />
      <SubmitButton pendingLabel="Enviando…" className="w-full">
        Enviar link
      </SubmitButton>
    </form>
  );
}
