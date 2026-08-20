# Stack padrão

Toda escolha aqui já está tomada. O objetivo é que qualquer pessoa da equipe
consiga abrir qualquer sistema e reconhecer a estrutura.

## Base

| Camada | Ferramenta | Por quê |
|---|---|---|
| Framework | Next.js 16 (App Router) | Renderiza no servidor por padrão, o que deixa o sistema rápido e mantém o dado longe do navegador |
| Linguagem | TypeScript `strict` | O erro aparece enquanto se escreve, não no dia da apresentação |
| Banco, login, arquivos | Supabase | Postgres de verdade, com autenticação e RLS embutidos |
| Estilo | Tailwind CSS v4 | Mesmo vocabulário visual em todos os sistemas |
| Componentes | shadcn/ui | O código dos componentes fica no seu projeto, então dá para adaptar |

## Bibliotecas fixas

| Para | Use |
|---|---|
| Formulários | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Tabelas com ordenação e filtro | `@tanstack/react-table` |
| Gráficos | `recharts` |
| Datas | `date-fns` (locale `ptBR`) |
| Avisos | `sonner` |
| Ícones | `lucide-react` |
| Tema claro/escuro | `next-themes` |
| Sidebar, migalha, abas | `sidebar`, `breadcrumb`, `tabs` do shadcn |

## Aparência

Definida em [`ESTILO.md`](ESTILO.md), com telas de referência em
[`examples/`](examples/). Resumo: painel administrativo neutro, sem cor de
marca, cor só para indicar estado.

## Como os dados andam

**Leitura** — Server Component busca direto no banco:

```
Página (servidor) → createClient() → Supabase → HTML pronto
```

Sem `useEffect`, sem API intermediária, sem tela piscando.

**Escrita** — Server Action:

```
Formulário → Server Action → requireUser() → zod → Supabase → revalidatePath()
```

## Estrutura de pastas

```
app/
  auth/                 login e cadastro (sem moldura)
  (app)/                telas logadas (com sidebar e barra de cima)
    layout.tsx          a moldura
    <entidade>/
      page.tsx          listagem (Server Component)
      actions.ts        Server Actions ("use server")
      <entidade>-form.tsx  formulário ("use client")
components/
  ui/                   shadcn — não edite à mão, use o CLI
  *.tsx                 componentes do sistema
lib/
  supabase/             clients, tipos gerados, requireUser
  auth/                 rotas públicas e proteção de redirect
  validators/           schemas zod
supabase/
  migrations/           todo o schema do banco, em ordem
docs/
  playbooks/            passo a passo das tarefas comuns
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o sistema local em localhost:3000 |
| `npm run check` | Lint + TypeScript + build. **Rode antes de entregar** |
| `npm run db:new <nome>` | Cria arquivo de migration |
| `npm run db:push` | Aplica as migrations no Supabase |
| `npm run db:types` | Regenera os tipos das tabelas |
| `npx shadcn@latest add <componente>` | Instala componente de interface |

## O que não usar

Prisma, Drizzle, NextAuth, MUI, Chakra, Bootstrap, styled-components, axios,
moment, Redux. Tudo isso resolve problema que a stack acima já resolve, e
duplicar solução é o que deixa os projetos impossíveis de manter juntos.
