"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import {
  authErrorMessage,
  emailOnlySchema,
  newPasswordSchema,
  safeNext,
  signInSchema,
  signUpSchema,
  zodFieldErrors,
} from "@/lib/auth/helpers";
import type { ActionState } from "@/components/ui/form";

const TOO_MANY: ActionState = { message: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente." };

export async function signInAction(_: ActionState, form: FormData): Promise<ActionState> {
  const values = { email: String(form.get("email") ?? "") };
  if (!(await rateLimit("login", 10, 5 * 60_000))) return { ...TOO_MANY, values };

  const parsed = signInSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error), values };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { message: authErrorMessage(error), values, ok: false, errors: error.code === "email_not_confirmed" ? { unconfirmed: "1" } : undefined };

  redirect(safeNext(form.get("next")));
}

export async function signUpAction(_: ActionState, form: FormData): Promise<ActionState> {
  const values = { fullName: String(form.get("fullName") ?? ""), email: String(form.get("email") ?? "") };
  // Campo invisível: bots costumam preenchê-lo.
  if (String(form.get("company") ?? "").length > 0) return { ok: true, message: "Verifique seu e-mail para confirmar o cadastro." };
  if (!(await rateLimit("signup", 5, 15 * 60_000))) return { ...TOO_MANY, values };

  const parsed = signUpSchema.safeParse({
    fullName: form.get("fullName"),
    email: form.get("email"),
    password: form.get("password"),
    terms: form.get("terms") ?? undefined,
  });
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error), values };

  const next = safeNext(form.get("next"), "/dashboard/bem-vindo");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${siteUrl()}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { message: authErrorMessage(error), values };

  // Se a confirmação de e-mail estiver desativada no projeto, a sessão já vem pronta.
  if (data.session) redirect(next);

  return {
    ok: true,
    values: { email: parsed.data.email },
    message: `Enviamos um link de confirmação para ${parsed.data.email}. Abra o e-mail para ativar sua conta.`,
  };
}

export async function resendConfirmationAction(_: ActionState, form: FormData): Promise<ActionState> {
  if (!(await rateLimit("resend", 3, 15 * 60_000))) return TOO_MANY;
  const parsed = emailOnlySchema.safeParse({ email: form.get("email") });
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error) };
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: { emailRedirectTo: `${siteUrl()}/auth/confirm?next=/dashboard/bem-vindo` },
  });
  if (error && error.status === 429) return { message: authErrorMessage(error) };
  return { ok: true, message: "Se houver um cadastro pendente para este e-mail, enviamos um novo link de confirmação." };
}

export async function requestPasswordResetAction(_: ActionState, form: FormData): Promise<ActionState> {
  const values = { email: String(form.get("email") ?? "") };
  if (!(await rateLimit("reset", 5, 15 * 60_000))) return { ...TOO_MANY, values };
  const parsed = emailOnlySchema.safeParse({ email: form.get("email") });
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error), values };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl()}/auth/confirm?next=/redefinir-senha`,
  });
  if (error && error.status === 429) return { message: authErrorMessage(error), values };
  // Mesma resposta exista ou não a conta (não revela e-mails cadastrados).
  return { ok: true, message: `Se ${parsed.data.email} tiver uma conta, você receberá um link para criar uma nova senha.` };
}

export async function updatePasswordAction(_: ActionState, form: FormData): Promise<ActionState> {
  const parsed = newPasswordSchema.safeParse({ password: form.get("password"), confirm: form.get("confirm") });
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error) };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { message: "O link de redefinição expirou. Solicite um novo." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { message: authErrorMessage(error) };
  redirect("/dashboard?aviso=senha-atualizada");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login?motivo=saiu");
}
