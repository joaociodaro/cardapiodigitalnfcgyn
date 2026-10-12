import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Só onde a sessão importa: áreas logadas, telas de acesso e callbacks.
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/cadastro", "/redefinir-senha", "/auth/:path*"],
};
