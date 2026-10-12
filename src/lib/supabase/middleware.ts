import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { supabasePublicEnv } from "@/lib/env";

const PROTECTED = ["/dashboard", "/admin"];
const AUTH_PAGES = ["/login", "/cadastro"];

/** Renova a sessão em cada requisição e protege as áreas logadas. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = supabasePublicEnv();
  if (!env) return response;

  const supabase = createServerClient<Database>(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet) {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() valida o token no servidor de autenticação (não confia só no cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(`${p}/`));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", path + request.nextUrl.search);
    url.searchParams.set("motivo", "sessao");
    return redirectWithCookies(url, response);
  }

  if (user && AUTH_PAGES.includes(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return redirectWithCookies(url, response);
  }

  return response;
}

function redirectWithCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((c) => redirect.cookies.set(c));
  return redirect;
}
