import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * As duas variaveis abaixo sao NEXT_PUBLIC_, ou seja, sao embutidas no bundle
 * durante o `next build` — nao lidas em runtime. Se voce faz build em Docker ou
 * CI, elas precisam existir NA HORA DO BUILD, nao so quando o app sobe.
 */
export const hasEnvVars = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
