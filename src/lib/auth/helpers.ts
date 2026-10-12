import { z } from "zod";

/**
 * Aceita apenas caminhos internos (evita redirecionamento aberto para outro site).
 */
export function safeNext(next: unknown, fallback = "/dashboard"): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (/[\r\n]/.test(next)) return fallback;
  return next;
}

/** Traduz erros do Supabase Auth para mensagens claras, sem revelar se o e-mail existe. */
export function authErrorMessage(err: { code?: string; message?: string; status?: number } | null | undefined): string {
  const code = err?.code ?? "";
  const msg = (err?.message ?? "").toLowerCase();
  if (code === "invalid_credentials" || msg.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (code === "email_not_confirmed" || msg.includes("email not confirmed"))
    return "Confirme seu e-mail antes de entrar. Procure a mensagem que enviamos (verifique também o spam).";
  if (code === "user_already_exists" || msg.includes("already registered")) return "Este e-mail já tem uma conta. Entre ou recupere sua senha.";
  if (code === "weak_password" || msg.includes("password should")) return "Senha fraca. Use pelo menos 8 caracteres, com letras e números.";
  if (code === "same_password") return "A nova senha precisa ser diferente da atual.";
  if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit" || err?.status === 429)
    return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";
  if (code === "otp_expired" || msg.includes("expired")) return "O link expirou. Solicite um novo.";
  if (code === "session_not_found" || code === "refresh_token_not_found") return "Sua sessão expirou. Entre novamente.";
  if (code === "signup_disabled") return "Novos cadastros estão temporariamente desativados.";
  if (code === "email_address_invalid") return "Este endereço de e-mail não é aceito. Use outro e-mail.";
  return "Não foi possível concluir agora. Tente novamente em instantes.";
}

const email = z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(254);
export const passwordRule = z
  .string()
  .min(8, "A senha precisa ter pelo menos 8 caracteres.")
  .max(72, "A senha pode ter no máximo 72 caracteres.")
  .regex(/[A-Za-z]/, "Inclua pelo menos uma letra.")
  .regex(/[0-9]/, "Inclua pelo menos um número.");

export const signInSchema = z.object({ email, password: z.string().min(1, "Informe sua senha.") });

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome.").max(80),
  email,
  password: passwordRule,
  terms: z.literal("on", { message: "Aceite os termos de uso e a política de privacidade." }),
});

export const emailOnlySchema = z.object({ email });

export const newPasswordSchema = z
  .object({ password: passwordRule, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "As senhas não coincidem.", path: ["confirm"] });

export type FieldErrors = Partial<Record<string, string>>;

export function zodFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Normaliza WhatsApp brasileiro para dígitos com DDI 55. */
export function normalizeWhatsapp(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  const withCountry = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
  return /^\d{12,15}$/.test(withCountry) ? withCountry : null;
}
