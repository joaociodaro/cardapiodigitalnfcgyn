"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, FormAlert, SubmitButton, TextArea, inputClass, type ActionState } from "@/components/ui/form";
import {
  changePasswordAction,
  deleteAccountAction,
  signOutEverywhereAction,
  updateEstablishmentAction,
  updateProfileAction,
} from "../actions";

function Result({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return <FormAlert tone={state.ok ? "success" : "error"}>{state.message}</FormAlert>;
}

type Hours = Array<{ days: string; hours: string }>;

export function EstablishmentForm({
  initial,
  canEdit,
}: {
  initial: {
    name: string;
    description: string;
    phone: string;
    whatsapp: string;
    address: string;
    instagram: string;
    website: string;
    extra_info: string;
    hours: Hours;
  };
  canEdit: boolean;
}) {
  const [state, action] = useActionState<ActionState, FormData>(updateEstablishmentAction, {});
  const [hours, setHours] = useState<Hours>(initial.hours.length ? initial.hours : [{ days: "Segunda a sexta", hours: "11h – 22h" }]);
  const v = state.values ?? {};
  const err = state.errors ?? {};

  return (
    <form action={action} className="space-y-5" noValidate>
      <fieldset disabled={!canEdit} className="space-y-5">
        <Result state={state} />
        <Field label="Nome comercial" name="name" required defaultValue={v.name ?? initial.name} error={err.name} />
        <TextArea
          label="Descrição"
          name="description"
          maxLength={400}
          defaultValue={v.description ?? initial.description}
          error={err.description}
          hint="Aparece nas informações do cardápio. Até 400 caracteres."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Telefone" name="phone" type="tel" inputMode="tel" defaultValue={v.phone ?? initial.phone} error={err.phone} />
          <Field
            label="WhatsApp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            placeholder="(62) 99999-0000"
            defaultValue={v.whatsapp ?? initial.whatsapp}
            error={err.whatsapp}
            hint="Recebe os pedidos e o botão de contato."
          />
        </div>
        <Field label="Endereço" name="address" autoComplete="street-address" defaultValue={v.address ?? initial.address} error={err.address} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Instagram" name="instagram" placeholder="@seurestaurante" defaultValue={v.instagram ?? initial.instagram} error={err.instagram} />
          <Field label="Site" name="website" type="url" placeholder="https://" defaultValue={v.website ?? initial.website} error={err.website} />
        </div>

        <div>
          <p className="text-sm font-medium text-ink">Horário de funcionamento</p>
          <input type="hidden" name="hours" value={JSON.stringify(hours.filter((h) => h.days.trim() && h.hours.trim()))} />
          <ul className="mt-2 space-y-2">
            {hours.map((h, i) => (
              <li key={i} className="flex gap-2">
                <input
                  aria-label={`Dias, linha ${i + 1}`}
                  className={inputClass}
                  value={h.days}
                  maxLength={40}
                  placeholder="Dias"
                  onChange={(e) => setHours(hours.map((x, j) => (j === i ? { ...x, days: e.target.value } : x)))}
                />
                <input
                  aria-label={`Horário, linha ${i + 1}`}
                  className={`${inputClass} max-w-40`}
                  value={h.hours}
                  maxLength={40}
                  placeholder="Horário"
                  onChange={(e) => setHours(hours.map((x, j) => (j === i ? { ...x, hours: e.target.value } : x)))}
                />
                <button
                  type="button"
                  aria-label={`Remover linha ${i + 1}`}
                  onClick={() => setHours(hours.filter((_, j) => j !== i))}
                  className="grid size-10 shrink-0 place-items-center rounded-xl border border-line text-muted hover:text-ink"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          {hours.length < 10 && (
            <button type="button" onClick={() => setHours([...hours, { days: "", hours: "" }])} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
              <Plus className="size-4" /> Adicionar horário
            </button>
          )}
          {err.hours && <p className="mt-1.5 text-xs font-medium text-red-700 dark:text-red-400">{err.hours}</p>}
        </div>

        <TextArea
          label="Informações complementares"
          name="extra_info"
          maxLength={400}
          defaultValue={v.extra_info ?? initial.extra_info}
          error={err.extra_info}
          hint="Ex.: estacionamento, taxa de serviço, reservas."
        />
        {canEdit ? (
          <SubmitButton pendingLabel="Salvando…">Salvar dados</SubmitButton>
        ) : (
          <p className="text-sm text-muted">Somente o proprietário ou gerente pode alterar estes dados.</p>
        )}
      </fieldset>
    </form>
  );
}

export function ProfileForm({ fullName, phone, email }: { fullName: string; phone: string; email: string }) {
  const [state, action] = useActionState<ActionState, FormData>(updateProfileAction, {});
  return (
    <form action={action} className="space-y-5" noValidate>
      <Result state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Seu nome" name="fullName" autoComplete="name" defaultValue={fullName} error={state.errors?.fullName} />
        <Field label="Seu telefone" name="phone" type="tel" autoComplete="tel" defaultValue={phone} error={state.errors?.phone} />
      </div>
      <Field label="E-mail" value={email} readOnly disabled hint="Para trocar o e-mail da conta, fale com o suporte." />
      <SubmitButton pendingLabel="Salvando…">Salvar</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState<ActionState, FormData>(changePasswordAction, {});
  return (
    <form action={action} className="space-y-5" noValidate key={state.ok ? "ok" : "form"}>
      <Result state={state} />
      <Field label="Senha atual" name="current" type="password" autoComplete="current-password" error={state.errors?.current} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nova senha" name="password" type="password" autoComplete="new-password" error={state.errors?.password} hint="Mínimo de 8 caracteres, com letras e números." />
        <Field label="Confirme a nova senha" name="confirm" type="password" autoComplete="new-password" error={state.errors?.confirm} />
      </div>
      <SubmitButton pendingLabel="Alterando…">Alterar senha</SubmitButton>
    </form>
  );
}

export function SessionsForm() {
  return (
    <form action={signOutEverywhereAction}>
      <SubmitButton variant="ghost" pendingLabel="Encerrando…">
        Sair de todos os dispositivos
      </SubmitButton>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action] = useActionState<ActionState, FormData>(deleteAccountAction, {});
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40">
        Excluir minha conta
      </button>
    );
  }
  return (
    <form action={action} className="space-y-4" noValidate>
      {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
      <Field label="Digite EXCLUIR para confirmar" name="confirm" autoComplete="off" error={state.errors?.confirm} />
      <div className="flex flex-wrap gap-2">
        <SubmitButton variant="danger" pendingLabel="Excluindo…">
          Excluir definitivamente
        </SubmitButton>
        <button type="button" onClick={() => setOpen(false)} className="rounded-full px-5 py-2.5 text-sm font-medium text-muted hover:text-ink">
          Cancelar
        </button>
      </div>
    </form>
  );
}
