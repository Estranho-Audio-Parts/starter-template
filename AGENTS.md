# Regras do projeto

Você está construindo um **sistema interno** em cima do template padrão do grupo.
Estas regras não são sugestões. Elas existem para que qualquer desenvolvedor da
equipe consiga assumir este projeto depois sem reescrever tudo.

Quem está te pedindo as coisas provavelmente **não é programador**. Ele conhece o
problema de negócio, não a solução técnica. Traduza o pedido para a stack abaixo
sem perguntar qual biblioteca usar — isso já está decidido.

---

## 1. Stack fixa — não troque, não adicione equivalente

| Necessidade | Use | Não use |
|---|---|---|
| Framework | Next.js 16, App Router | Pages Router, Vite, CRA |
| Linguagem | TypeScript (`strict`) | JavaScript puro, `any` |
| Banco / Auth / Storage | Supabase | Prisma, Drizzle, NextAuth, Firebase |
| Estilo | Tailwind CSS v4 | CSS Modules, styled-components, Sass |
| Componentes | shadcn/ui (`npx shadcn@latest add ...`) | MUI, Chakra, Ant, Bootstrap |
| Ícones | `lucide-react` | react-icons, heroicons |
| Formulários | `react-hook-form` + `zod` | formik, estado manual com `useState` |
| Tabelas | `@tanstack/react-table` + `components/ui/table` | tabela HTML na mão |
| Gráficos | `recharts` | chart.js, d3 direto |
| Datas | `date-fns` com locale `ptBR` | moment, `Date` cru na interface |
| Avisos ao usuário | `sonner` (`toast`) | `alert()`, `window.confirm()` |
| Mutação de dados | **Server Actions** | route handlers para CRUD, `fetch` para API própria |
| Leitura de dados | Server Component + client do servidor | `useEffect` + `fetch` |

Precisa de algo que não está na tabela? Instale a opção mais popular e
mainstream, e **registre em `docs/DECISOES.md`** o que instalou e por quê.

---

## 2. Regras invioláveis

Quebrar qualquer uma destas é motivo de reprovação na revisão do time de devs.

### 2.1 RLS em toda tabela, sempre
Toda migration que cria tabela **precisa**, no mesmo arquivo:

```sql
alter table public.<tabela> enable row level security;
```

...seguido de pelo menos uma policy. Uma tabela com RLS ligado e nenhuma policy
fica invisível para todo mundo — isso é seguro, mas quebra o sistema. Uma tabela
**sem** RLS ligado é lida pelo mundo inteiro, porque a chave publishable fica
visível no navegador de qualquer usuário. Não existe meio-termo aceitável.

Veja `supabase/migrations/20260101000000_base.sql` — é a referência.

### 2.2 A chave `service_role` nunca toca o cliente
- Nunca use `service_role` em componente com `"use client"`.
- Nunca coloque segredo em variável com prefixo `NEXT_PUBLIC_` — esse prefixo
  significa literalmente "publique isto no navegador".
- Só `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` são
  públicas. Qualquer outra coisa é segredo.

### 2.3 Todo schema nasce em migration
Mudou tabela, coluna, policy, índice ou função? Vira arquivo em
`supabase/migrations/`, criado com `npm run db:new <nome>`.

Nunca altere o schema clicando no painel do Supabase: o próximo `db push`
sobrescreve, e ninguém consegue reproduzir o banco depois.

Migration já aplicada é história — não edite, crie outra por cima.

### 2.4 Valide no servidor, não só na tela
Validação no formulário é conveniência para o usuário. Validação na Server Action
é o que de fato protege o sistema. **Sempre as duas**, com o mesmo schema zod
importado de `lib/validators/`.

Quem chama sua Server Action pode ser um script, não o seu formulário.

### 2.5 Não confie só no proxy para autorização
`proxy.ts` decide quem passa da porta. Ele **não** é autorização.
Toda página protegida e toda Server Action revalida a sessão por conta própria:

```ts
const supabase = await createClient();
const { data, error } = await supabase.auth.getClaims();
if (error || !data?.claims) redirect("/auth/login");
```

E a proteção real do dado é o RLS (2.1), não o código.

### 2.6 Nada de `any`
As tabelas são tipadas em `lib/supabase/database.types.ts`. Criou tabela? Rode
`npm run db:types`. Se apareceu `any`, é porque você pulou esse passo.

---

## 3. Padrões de código

- **Idioma**: interface, mensagens de erro e nomes de tabela/coluna em
  português. Nomes de arquivo e de componente em inglês técnico quando for
  convenção (`page.tsx`, `layout.tsx`, `LoginForm`).
- **Arquivos**: `kebab-case.tsx`. Componentes em `PascalCase`.
- **Server Component é o padrão.** Só escreva `"use client"` quando precisar de
  `useState`, `useEffect`, evento de clique ou browser API. Coloque o
  `"use client"` na folha da árvore, não no topo da página.
- **Toda tabela nova tem**: `id uuid primary key default gen_random_uuid()`,
  `created_at timestamptz not null default now()`,
  `updated_at timestamptz not null default now()` com trigger
  `public.set_updated_at()`, e uma coluna de dono
  (`user_id uuid not null references auth.users (id) on delete cascade`).
- **Dinheiro**: guarde em centavos, como `integer`. Nunca `float`/`real` —
  `0.1 + 0.2` não dá `0.3` e o financeiro não perdoa.
- **Datas**: `timestamptz`, nunca `timestamp` sem fuso.
- **Estados de tela**: toda tela que carrega dado precisa de carregando, vazio e
  erro. Uma tabela vazia sem explicação parece sistema quebrado.
- **Acessibilidade**: todo ícone clicável tem `aria-label`. Todo input tem
  `<Label htmlFor>`.

---

## 4. Estilo visual

Todo sistema do grupo tem a mesma cara: **painel administrativo neutro, denso de
informação, sem cor de marca.**

A referência completa está em `docs/ESTILO.md`. **A moldura e o painel já vêm
implementados nesse padrão** — leia `app/(app)/layout.tsx`,
`app/(app)/dashboard/page.tsx` e `components/card-indicador.tsx` antes de criar
tela nova, e reaproveite em vez de recriar.

O essencial, que não se negocia:

- **Base neutra.** Preto, branco e cinza. Não existe cor primária de marca.
  Cor só aparece quando significa estado: verde positivo, vermelho negativo,
  âmbar atenção, azul em andamento, cinza inativo.
- **Gráficos em escala de cinza**, não coloridos (`docs/ESTILO.md`, seção 4).
- **Moldura fixa**: sidebar à esquerda com grupos e ícones, barra superior com
  busca e tema, migalha de navegação, título e subtítulo de página, uma única
  ação principal por tela.
- **Número de destaque sempre com comparação** e com `tabular-nums`.
- **Estado sempre em badge**, nunca texto solto.
- **Nunca cor fixa** (`bg-white`, `#fff`): só tokens (`bg-background`,
  `text-muted-foreground`). Senão o modo escuro quebra.
- **Não invente componente que o shadcn já tem.** Rode
  `npx shadcn@latest add <nome>` antes de escrever do zero — vale principalmente
  para `sidebar`, `chart`, `breadcrumb`, `tabs` e `command`.

---

## 5. Fluxos prontos

Antes de começar uma dessas tarefas, **leia o playbook inteiro** e siga o passo
a passo. Eles existem para a saída sair padronizada.

| Tarefa | Playbook |
|---|---|
| Configurar o projeto pela primeira vez | `docs/playbooks/comecar.md` |
| Montar a moldura do sistema (sidebar + topo) | `docs/playbooks/layout-do-app.md` |
| Criar tabela nova no banco | `docs/playbooks/nova-tabela.md` |
| Criar tela de cadastro/listagem (CRUD) | `docs/playbooks/nova-tela.md` |
| Revisar antes de entregar para os devs | `docs/playbooks/revisar-seguranca.md` |
| Publicar o sistema | `docs/playbooks/publicar.md` |

Referência: `docs/STACK.md` (stack detalhada), `docs/ESTILO.md` (aparência) e
`docs/SEGURANCA.md`.

---

## 6. Como se comportar

- **Não peça escolha técnica ao usuário.** Ele não sabe se prefere Drizzle ou
  Supabase client. Decida pela tabela da seção 1 e siga.
- **Pergunte sobre negócio.** "Quem pode ver esse dado: só quem criou, ou todo
  mundo da empresa?" é a pergunta certa — ela define a policy de RLS e você não
  tem como adivinhar.
- **Ao terminar qualquer alteração**, rode `npm run check`
  (lint + typecheck + build). Não entregue com isso vermelho.
- **Explique em português claro** o que você fez, sem jargão. Quem lê pode não
  saber o que é uma migration.
- Antes de criar arquivo novo, veja se já existe algo parecido em `components/`
  e `lib/`. Reaproveite.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
