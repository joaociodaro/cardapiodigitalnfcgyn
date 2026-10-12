"use client";

import { useActionState } from "react";
import { Field, FormAlert, SubmitButton, type ActionState } from "@/components/ui/form";
import { createEstablishmentAction } from "../actions";

export function OnboardingForm({ next }: { next: string }) {
  const [state, action] = useActionState<ActionState, FormData>(createEstablishmentAction, {});
  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
      <Field
        label="Nome do estabelecimento"
        name="name"
        required
        autoFocus
        placeholder="Ex.: Cantina da Praça"
        defaultValue={state.values?.name}
        error={state.errors?.name}
        hint="É o nome que seus clientes verão no cardápio. Você pode alterar depois."
      />
      <Field
        label="WhatsApp (opcional)"
        name="whatsapp"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="(62) 99999-0000"
        defaultValue={state.values?.whatsapp}
        error={state.errors?.whatsapp}
        hint="Usado no botão de contato e nos pedidos pelo WhatsApp."
      />
      <SubmitButton pendingLabel="Criando…">Continuar</SubmitButton>
    </form>
  );
}
