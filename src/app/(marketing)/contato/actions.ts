"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { zodFieldErrors } from "@/lib/auth/helpers";
import type { ActionState } from "@/components/ui/form";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(80),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido para a resposta.").max(254),
  business: z.string().trim().max(120),
  subject: z.enum(["Quero contratar", "Criação personalizada do cardápio", "Dúvida sobre planos", "Suporte técnico", "Outro assunto"]),
  message: z.string().trim().min(10, "Conte um pouco mais (mínimo de 10 caracteres).").max(5000),
});

export async function sendContactAction(_: ActionState, form: FormData): Promise<ActionState> {
  const values = Object.fromEntries(["name", "email", "business", "subject", "message"].map((k) => [k, String(form.get(k) ?? "")]));
  if (String(form.get("website") ?? "")) return { ok: true, message: "Mensagem enviada." }; // armadilha para robôs
  if (!(await rateLimit("contact", 3, 60 * 60_000))) return { message: "Você enviou muitas mensagens. Tente novamente mais tarde.", values };

  const parsed = schema.safeParse(values);
  if (!parsed.success) return { errors: zodFieldErrors(parsed.error), values };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const d = parsed.data;
  const { error } = await supabase.from("support_requests").insert({
    user_id: auth.user?.id ?? null,
    name: d.name,
    email: d.email,
    subject: d.subject,
    message: d.business ? `Estabelecimento: ${d.business}\n\n${d.message}` : d.message,
  });
  if (error) return { message: "Não foi possível enviar agora. Tente novamente ou use o e-mail ao lado.", values };
  return { ok: true, message: `Mensagem enviada. Responderemos para ${d.email} em até um dia útil.` };
}
