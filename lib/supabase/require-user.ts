import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * Garante que existe alguem logado, no servidor.
 *
 * Use no inicio de TODA pagina protegida e de TODA Server Action.
 * O proxy.ts ja barra visitante na porta, mas ele nao e autorizacao: uma Server
 * Action pode ser chamada direto, sem passar por navegacao de pagina.
 *
 * Devolve os claims do JWT (id, email, etc).
 */
export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return { supabase, user: data.claims };
}
