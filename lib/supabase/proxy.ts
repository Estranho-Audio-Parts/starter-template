import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import { isPublicPath, LOGIN_PATH, AFTER_LOGIN_PATH } from "../auth/routes";
import type { Database } from "./database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Sem as variaveis de ambiente nao da para falar com o Supabase.
  // Deixa passar para a home conseguir explicar o que falta configurar.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // Com Fluid compute, nunca guarde este client numa variavel global.
  // Crie um novo a cada request.
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // NAO coloque codigo entre createServerClient e supabase.auth.getClaims().
  // Um erro simples aqui faz usuarios serem deslogados aleatoriamente, e e
  // muito dificil de debugar.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // A raiz nao e tela. Sistema interno abre no login, ou ja dentro se a pessoa
  // tem sessao. O texto de "como configurar" mora no README, nao numa pagina.
  if (request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = user ? AFTER_LOGIN_PATH : LOGIN_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Padrao fechado: tudo exige login, menos o que estiver em lib/auth/routes.ts.
  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    // Guarda para onde a pessoa queria ir, para voltar depois do login.
    url.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(url);
  }

  // IMPORTANTE: retorne o supabaseResponse como esta.
  // Se voce criar um NextResponse novo, copie os cookies para ele:
  //   const novo = NextResponse.next({ request })
  //   novo.cookies.setAll(supabaseResponse.cookies.getAll())
  // Sem isso, navegador e servidor saem de sincronia e a sessao morre antes da hora.
  return supabaseResponse;
}
