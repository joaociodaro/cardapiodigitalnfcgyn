"use client";

import { useActionState } from "react";
import { Field, FormAlert, SubmitButton, TextArea, inputClass, type ActionState } from "@/components/ui/form";
import { sendContactAction } from "./actions";

const SUBJECTS = ["Quero contratar", "Criação personalizada do cardápio", "Dúvida sobre planos", "Suporte técnico", "Outro assunto"];

/** Formulário de contato: grava em support_requests, visível no painel administrativo. */
export function ContactForm() {
  const [state, action] = useActionState<ActionState, FormData>(sendContactAction, {});
  const v = state.values ?? {};
  const err = state.errors ?? {};

  if (state.ok) return <FormAlert tone="success">{state.message}</FormAlert>;

  return (
    <form action={action} noValidate className="space-y-5">
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Site
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome" name="name" autoComplete="name" required defaultValue={v.name} error={err.name} />
        <Field label="E-mail" name="email" type="email" autoComplete="email" required defaultValue={v.email} error={err.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Estabelecimento (opcional)" name="business" autoComplete="organization" defaultValue={v.business} error={err.business} />
        <label className="block text-sm font-medium text-ink">
          Assunto
          <select name="subject" defaultValue={v.subject ?? SUBJECTS[0]} className={`${inputClass} mt-1.5`}>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <TextArea label="Mensagem" name="message" rows={6} required defaultValue={v.message} error={err.message} />
      <SubmitButton pendingLabel="Enviando…">Enviar mensagem</SubmitButton>
    </form>
  );
}
