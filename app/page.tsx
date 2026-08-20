import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/lib/utils";

const PASSOS = [
  {
    titulo: "Conectar o Supabase",
    descricao:
      "Crie o projeto em database.new e preencha o .env.local com a URL e a chave publishable.",
    pronto: hasEnvVars,
  },
  {
    titulo: "Aplicar o banco",
    descricao:
      "Rode npm run db:push e depois npm run db:types para criar as tabelas e gerar os tipos.",
    pronto: false,
  },
  {
    titulo: "Criar a primeira tela",
    descricao:
      "Peça para a IA: \"crie uma tela para cadastrar <o que você precisa>\". Ela já sabe o padrão.",
    pronto: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-svh flex flex-col items-center">
      <nav className="w-full flex justify-center border-b h-16">
        <div className="w-full max-w-4xl flex justify-between items-center px-5 text-sm">
          <Link href="/" className="font-semibold">
            Sistema interno
          </Link>
          {hasEnvVars ? (
            <Suspense>
              <AuthButton />
            </Suspense>
          ) : (
            <EnvVarWarning />
          )}
        </div>
      </nav>

      <div className="flex-1 w-full max-w-4xl flex flex-col gap-12 p-6 py-16">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Seu sistema começa aqui
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Este projeto já vem com login, banco de dados e os padrões do grupo
            configurados. Descreva o que você precisa para a IA — ela conhece as
            regras deste template e vai seguir todas elas.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Próximos passos
          </h2>
          <ol className="flex flex-col gap-3">
            {PASSOS.map((passo, i) => (
              <li
                key={passo.titulo}
                className="flex gap-4 rounded-lg border p-4"
              >
                {passo.pronto ? (
                  <CheckCircle2 className="size-5 shrink-0 text-green-600" />
                ) : (
                  <XCircle className="size-5 shrink-0 text-muted-foreground" />
                )}
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    {i + 1}. {passo.titulo}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {passo.descricao}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Antes de publicar
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Peça para a IA rodar a revisão de segurança. Ela confere se os dados
            estão protegidos e se ninguém consegue ver o cadastro de outra
            pessoa. É obrigatório antes de entregar o sistema.
          </p>
          <Button asChild variant="outline" className="self-start">
            <Link href="/protected">
              Entrar no sistema <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      </div>

      <footer className="w-full flex items-center justify-center border-t py-8 text-xs gap-6">
        <span className="text-muted-foreground">Template padrão do grupo</span>
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
