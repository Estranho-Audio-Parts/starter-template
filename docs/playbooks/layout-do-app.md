# Playbook: montar a moldura do sistema

A "moldura" é a sidebar + a barra de cima que aparecem em todas as telas
logadas. Monte **uma vez**, logo no começo do projeto, antes da primeira tela de
verdade. Depois disso, toda tela nova só preenche o miolo.

**Antes de começar, leia [`docs/ESTILO.md`](../ESTILO.md) e abra as imagens de
[`docs/examples/`](../examples/).** É exatamente essa a aparência a alcançar.

## Passo 1 — Instalar os componentes

Não construa sidebar à mão. O shadcn já tem, com recolher, atalho de teclado e
comportamento no celular resolvidos:

```bash
npx shadcn@latest add sidebar breadcrumb avatar tabs command chart
```

## Passo 2 — Descobrir as seções

Pergunte ao usuário, em linguagem de negócio:

> "Quais são as áreas principais do sistema? Pensa no menu da esquerda: quais
> nomes você quer ver ali?"

Agrupe em no máximo 3 grupos. Grupo com um item só não é grupo — deixe solto.

## Passo 3 — Estrutura de arquivos

```
app/(app)/
  layout.tsx           a moldura: sidebar + topbar + <main>
  dashboard/page.tsx   primeira tela
components/
  app-sidebar.tsx      a navegação
  app-topbar.tsx       busca, notificações, tema, usuário
lib/
  navegacao.ts         os itens do menu, num lugar só
```

O grupo `(app)` entre parênteses não vira URL: serve só para separar as páginas
que têm moldura das que não têm (login, cadastro).

## Passo 4 — Centralizar o menu

Todo item de navegação vive em um arquivo só. Assim ninguém precisa caçar JSX
para adicionar uma tela:

```ts
// lib/navegacao.ts
import { LayoutDashboard, Package, Users, type LucideIcon } from "lucide-react";

export type ItemNav = {
  titulo: string;
  href: string;
  icone: LucideIcon;
  filhos?: { titulo: string; href: string }[];
};

export const NAVEGACAO: { grupo: string; itens: ItemNav[] }[] = [
  {
    grupo: "Operação",
    itens: [
      { titulo: "Painel", href: "/dashboard", icone: LayoutDashboard },
      {
        titulo: "Produtos",
        href: "/produtos",
        icone: Package,
        filhos: [
          { titulo: "Todos os produtos", href: "/produtos" },
          { titulo: "Novo produto", href: "/produtos/novo" },
        ],
      },
    ],
  },
  {
    grupo: "Cadastros",
    itens: [{ titulo: "Clientes", href: "/clientes", icone: Users }],
  },
];
```

## Passo 5 — Montar o layout

```tsx
// app/(app)/layout.tsx
import { Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { requireUser } from "@/lib/supabase/require-user";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<div className="w-(--sidebar-width) border-r" />}>
        <SidebarDoUsuario />
      </Suspense>
      <SidebarInset>
        <AppTopbar />
        <main className="flex flex-1 flex-col gap-8 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function SidebarDoUsuario() {
  const { user } = await requireUser();
  return <AppSidebar email={String(user.email)} />;
}
```

> **Não tire o `Suspense` daqui.** Este projeto usa `cacheComponents` (PPR) do
> Next 16. Se você ler sessão ou cookie direto no corpo do layout, o `npm run
> build` falha com *"uncached or runtime data during prerendering"* — e o erro
> só aparece no build, não no `npm run dev`. Isolando a parte que depende do
> usuário, o resto da moldura sai pronto do cache e a página fica mais rápida.

## Passo 6 — Marcar o item ativo

O item da tela atual fica com `bg-accent`. Use `usePathname()` num componente
cliente e compare com o `href`. Cuidado com a raiz: `/` casa com tudo se você
usar `startsWith` sem pensar.

## Passo 7 — Conferir

- [ ] A sidebar recolhe e volta
- [ ] No celular ela vira gaveta, e o conteúdo não estoura para o lado
- [ ] O item da tela atual está destacado
- [ ] A migalha (breadcrumb) mostra o caminho certo
- [ ] O rodapé da sidebar mostra o e-mail de quem está logado, com opção de sair
- [ ] **Troque para o tema escuro e olhe tudo de novo**
- [ ] `npm run check` passando

## Passo 8 — A partir daqui

Toda tela nova entra em `app/(app)/<nome>/page.tsx` e já nasce dentro da
moldura. Siga [`nova-tela.md`](nova-tela.md) para o conteúdo e
[`../ESTILO.md`](../ESTILO.md) para a aparência.
