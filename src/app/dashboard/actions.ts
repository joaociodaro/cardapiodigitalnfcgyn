"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CURRENT_EST_COOKIE, getDashboardContext } from "@/lib/dashboard/context";
import { authErrorMessage, normalizeWhatsapp, passwordRule, zodFieldErrors } from "@/lib/auth/helpers";
import { rateLimit } from "@/lib/rate-limit";
import type { ActionState } from "@/components/ui/form";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use no máximo ${max} caracteres.`)
    .transform((v) => (v === "" ? null : v));

/* ------------------------------------------------------------------ */
/* Onboarding                                                          */
/* ------------------------------------------------------------------ */

const onboardingSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do estabelecimento.").max(120),
  whatsapp: z.string().trim().optional(),
});

export async function createEstablishmentAction(_: ActionState, form: FormData): Promise<ActionState> {
  const values = { name: String(form.get("name") ?? ""), whatsapp: String(form.get("whatsapp") ?? "") };
  const parsed = onboardingSchema.safeParse(values);
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error), values };

  let whatsapp: string | null = null;
  if (parsed.data.whatsapp) {
    whatsapp = normalizeWhatsapp(parsed.data.whatsapp);
    if (!whatsapp) return { errors: { whatsapp: "Informe o número com DDD, ex.: (62) 99999-0000." }, values };
  }

  const supabase = await createClient();
  const { data: id, error } = await supabase.rpc("create_establishment", { p_name: parsed.data.name, p_whatsapp: whatsapp ?? undefined });
  if (error || !id) {
    const msg = error?.message.includes("establishment_limit")
      ? "Você atingiu o limite de estabelecimentos por conta. Fale com o suporte."
      : "Não foi possível criar o estabelecimento. Tente novamente.";
    return { message: msg, values };
  }

  (await cookies()).set(CURRENT_EST_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
  const next = String(form.get("next") ?? "");
  redirect(next.startsWith("/dashboard") ? next : "/dashboard?aviso=bem-vindo");
}

export async function switchEstablishmentAction(form: FormData) {
  const id = String(form.get("id") ?? "");
  const ctx = await getDashboardContext();
  if (!ctx.establishments.some((e) => e.id === id)) return; // só troca para estabelecimentos do próprio usuário
  (await cookies()).set(CURRENT_EST_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
  revalidatePath("/dashboard", "layout");
}

/* ------------------------------------------------------------------ */
/* Dados do estabelecimento                                            */
/* ------------------------------------------------------------------ */

const hoursSchema = z
  .array(z.object({ days: z.string().trim().min(1).max(40), hours: z.string().trim().min(1).max(40) }))
  .max(10);

const establishmentSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do estabelecimento.").max(120),
  description: optionalText(400),
  phone: optionalText(30),
  whatsapp: z.string().trim(),
  address: optionalText(200),
  instagram: optionalText(60).transform((v) => (v ? `@${v.replace(/^@+/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}` : null)),
  website: optionalText(200).refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), "Informe o endereço completo, começando com https://"),
  extra_info: optionalText(400),
  hours: z.string().transform((s, ctx) => {
    try {
      const parsed = hoursSchema.safeParse(JSON.parse(s || "[]"));
      if (parsed.success) return parsed.data;
    } catch {}
    ctx.addIssue({ code: "custom", message: "Revise os horários de funcionamento." });
    return z.NEVER;
  }),
});

export async function updateEstablishmentAction(_: ActionState, form: FormData): Promise<ActionState> {
  const ctx = await getDashboardContext();
  if (!ctx.current) return { message: "Crie um estabelecimento primeiro." };
  if (ctx.role !== "owner" && ctx.role !== "manager") return { message: "Somente o proprietário ou gerente pode alterar estes dados." };

  const raw = Object.fromEntries(["name", "description", "phone", "whatsapp", "address", "instagram", "website", "extra_info", "hours"].map((k) => [k, String(form.get(k) ?? "")]));
  const parsed = establishmentSchema.safeParse(raw);
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error), values: raw };

  let whatsapp: string | null = null;
  if (parsed.data.whatsapp) {
    whatsapp = normalizeWhatsapp(parsed.data.whatsapp);
    if (!whatsapp) return { errors: { whatsapp: "Informe o número com DDD, ex.: (62) 99999-0000." }, values: raw };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("establishments")
    .update({
      name: parsed.data.name,
      description: parsed.data.description,
      phone: parsed.data.phone,
      whatsapp,
      address: parsed.data.address,
      instagram: parsed.data.instagram,
      social_links: { website: parsed.data.website },
      extra_info: parsed.data.extra_info,
      opening_hours: parsed.data.hours,
    })
    .eq("id", ctx.current.id);
  if (error) return { message: "Não foi possível salvar. Tente novamente.", values: raw };

  revalidatePath("/dashboard", "layout");
  return { ok: true, message: "Dados do estabelecimento salvos." };
}

/* ------------------------------------------------------------------ */
/* Conta                                                               */
/* ------------------------------------------------------------------ */

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome.").max(80),
  phone: optionalText(30),
});

export async function updateProfileAction(_: ActionState, form: FormData): Promise<ActionState> {
  const ctx = await getDashboardContext();
  const parsed = profileSchema.safeParse({ fullName: form.get("fullName") ?? "", phone: form.get("phone") ?? "" });
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error) };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ full_name: parsed.data.fullName, phone: parsed.data.phone }).eq("id", ctx.user.id);
  if (error) return { message: "Não foi possível salvar. Tente novamente." };
  await supabase.auth.updateUser({ data: { full_name: parsed.data.fullName } });
  revalidatePath("/dashboard", "layout");
  return { ok: true, message: "Seus dados foram salvos." };
}

const changePasswordSchema = z
  .object({ current: z.string().min(1, "Informe a senha atual."), password: passwordRule, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "As senhas não coincidem.", path: ["confirm"] });

export async function changePasswordAction(_: ActionState, form: FormData): Promise<ActionState> {
  const ctx = await getDashboardContext();
  if (!(await rateLimit("change-password", 5, 15 * 60_000))) return { message: "Muitas tentativas. Aguarde alguns minutos." };
  const parsed = changePasswordSchema.safeParse({ current: form.get("current"), password: form.get("password"), confirm: form.get("confirm") });
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error) };

  const supabase = await createClient();
  // Confirma a senha atual antes de trocar.
  const { error: checkError } = await supabase.auth.signInWithPassword({ email: ctx.user.email, password: parsed.data.current });
  if (checkError) return { errors: { current: "Senha atual incorreta." } };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { message: authErrorMessage(error) };
  return { ok: true, message: "Senha alterada." };
}

export async function signOutEverywhereAction() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "global" });
  redirect("/login?motivo=saiu");
}

export async function deleteAccountAction(_: ActionState, form: FormData): Promise<ActionState> {
  const ctx = await getDashboardContext();
  if (String(form.get("confirm") ?? "").trim().toUpperCase() !== "EXCLUIR") return { errors: { confirm: "Digite EXCLUIR para confirmar." } };

  const supabase = await createClient();
  const { error } = await supabase.rpc("request_account_deletion");
  if (error) return { message: "Não foi possível excluir a conta agora. Fale com o suporte." };

  // Remove o login definitivamente quando a chave secreta estiver configurada;
  // caso contrário a conta fica anonimizada e bloqueada para acesso.
  const admin = createAdminClient();
  if (admin) await admin.auth.admin.deleteUser(ctx.user.id);

  await supabase.auth.signOut();
  redirect("/?conta=excluida");
}

/* ------------------------------------------------------------------ */
/* Suporte                                                             */
/* ------------------------------------------------------------------ */

const supportSchema = z.object({
  subject: z.string().trim().min(3, "Informe o assunto.").max(120),
  message: z.string().trim().min(10, "Descreva com pelo menos 10 caracteres.").max(5000),
});

export async function createSupportRequestAction(_: ActionState, form: FormData): Promise<ActionState> {
  const ctx = await getDashboardContext();
  if (!(await rateLimit("support", 5, 60 * 60_000))) return { message: "Você enviou muitas mensagens na última hora. Aguarde um pouco." };
  const values = { subject: String(form.get("subject") ?? ""), message: String(form.get("message") ?? "") };
  const parsed = supportSchema.safeParse(values);
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error), values };

  const supabase = await createClient();
  const { error } = await supabase.from("support_requests").insert({
    user_id: ctx.user.id,
    establishment_id: ctx.current?.id ?? null,
    name: ctx.profile?.full_name || ctx.user.email,
    email: ctx.user.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });
  if (error) return { message: "Não foi possível enviar. Tente novamente.", values };
  revalidatePath("/dashboard/suporte");
  return { ok: true, message: "Mensagem enviada. Respondemos pelo seu e-mail em até um dia útil." };
}
