"use client";

import { useActionState } from "react";
import { Field, FormAlert, SubmitButton, TextArea, type ActionState } from "@/components/ui/form";
import { createSupportRequestAction } from "../actions";

export function SupportForm({ subject }: { subject?: string }) {
  const [state, action] = useActionState<ActionState, FormData>(createSupportRequestAction, {});
  if (state.ok) return <FormAlert tone="success">{state.message}</FormAlert>;
  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
      <Field label="Assunto" name="subject" defaultValue={state.values?.subject ?? subject} error={state.errors?.subject} />
      <TextArea
        label="Mensagem"
        name="message"
        rows={6}
        defaultValue={state.values?.message ?? (subject?.startsWith("Contratar") ? "Olá! Quero contratar este plano. Prefiro pagar por: Pix / cartão." : "")}
        error={state.errors?.message}
      />
      <SubmitButton pendingLabel="Enviando…">Enviar mensagem</SubmitButton>
    </form>
  );
}
