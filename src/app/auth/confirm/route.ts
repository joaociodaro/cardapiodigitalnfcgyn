import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth/helpers";

/**
 * Destino dos links enviados por e-mail (confirmação de cadastro e
 * recuperação de senha). Aceita os dois formatos do Supabase:
 *  - ?code=...                       (fluxo PKCE, modelo de e-mail padrão)
 *  - ?token_hash=...&type=signup     (modelo de e-mail personalizado)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();
  let ok = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  }

  if (ok) return NextResponse.redirect(new URL(next, origin));

  const fail = new URL("/login", origin);
  fail.searchParams.set("motivo", searchParams.get("error_code") === "otp_expired" ? "link-expirado" : "link-invalido");
  return NextResponse.redirect(fail);
}
