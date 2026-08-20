import { redirect } from "next/navigation";
import { hasEnvVars } from "@/lib/utils";
import { LOGIN_PATH } from "@/lib/auth/routes";

/**
 * A raiz nao e tela.
 *
 * Com o Supabase configurado, o proxy (proxy.ts) intercepta "/" antes daqui e
 * manda para o login ou para dentro do sistema. Esta pagina so roda no caso em
 * que o proxy se desliga: quando faltam as variaveis de ambiente.
 *
 * Por isso ela e curta de proposito. Explicacao de como configurar mora no
 * README, nao numa tela do sistema.
 */
export default function Home() {
  if (hasEnvVars) {
    redirect(LOGIN_PATH);
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md flex-col gap-2 rounded-xl border p-6">
        <h1 className="text-lg font-semibold">Falta conectar o Supabase</h1>
        <p className="text-sm text-muted-foreground">
          Preencha <code className="font-mono">.env.local</code> com a URL e a
          chave publishable do projeto. O passo a passo está no{" "}
          <code className="font-mono">README.md</code>.
        </p>
      </div>
    </main>
  );
}
