import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Client do Supabase para componentes com "use client".
 * O <Database> e o que faz o TypeScript conhecer suas tabelas: sem ele,
 * toda query devolve `any` e voce perde o autocomplete e a checagem de erro.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
