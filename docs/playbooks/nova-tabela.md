# Playbook: criar tabela no banco

Siga na ordem. Pular passo aqui é o jeito mais comum de vazar dado.

## Passo 1 — Descobrir quem pode ver o quê

Antes de escrever SQL, pergunte ao usuário **em português de negócio**:

> "Quem pode ver esses dados: só quem criou o registro, ou todo mundo que usa o
> sistema? E quem pode apagar?"

A resposta define as policies. Você não tem como adivinhar isso, e errar aqui é
o erro mais caro que existe neste projeto. Os três casos comuns:

| Situação | Regra |
|---|---|
| "Só meu" (anotações, tarefas pessoais) | `user_id = auth.uid()` em tudo |
| "Todo mundo vê, cada um edita o seu" (chamados, sugestões) | `select` liberado para `authenticated`; `insert`/`update`/`delete` só do dono |
| "Todo mundo vê e edita" (cadastro compartilhado) | tudo liberado para `authenticated` — **nunca** para `anon` |

## Passo 2 — Criar o arquivo de migration

```bash
npm run db:new nome_da_mudanca
```

Isso cria `supabase/migrations/<timestamp>_nome_da_mudanca.sql`.
Nunca crie o arquivo na mão: o timestamp define a ordem de execução.

## Passo 3 — Escrever a migration

Copie este modelo e adapte. Ele já tem tudo que é obrigatório.

```sql
-- Substitua "itens" pelo nome real da tabela (plural, minúsculo, sem acento).
create table public.itens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  -- suas colunas aqui
  titulo text not null,
  descricao text,
  concluido boolean not null default false,
  valor_centavos integer,        -- dinheiro SEMPRE em centavos, nunca float

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- OBRIGATÓRIO. Sem isto, a tabela inteira é legível por qualquer pessoa.
alter table public.itens enable row level security;

-- Policies — este exemplo é o caso "só meu".
-- Uma policy por operação. Não use "for all": fica difícil de auditar.
create policy "itens: dono le"
  on public.itens for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "itens: dono cria"
  on public.itens for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "itens: dono atualiza"
  on public.itens for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "itens: dono apaga"
  on public.itens for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Mantém updated_at correto sozinho.
create trigger itens_set_updated_at
  before update on public.itens
  for each row execute function public.set_updated_at();

-- Índice na coluna que o RLS filtra. Sem ele a listagem fica lenta
-- conforme a tabela cresce, porque o Postgres varre tudo.
create index itens_user_id_idx on public.itens (user_id);
```

### Detalhes que importam

- **`to authenticated`, nunca `to public`.** `public` inclui visitante
  não logado (`anon`).
- **`using` vs `with check`**: `using` filtra o que já existe (leitura, update,
  delete). `with check` valida o que está entrando (insert, update). Update
  precisa dos dois — senão o usuário edita o registro dele e transfere para
  outra pessoa.
- **`(select auth.uid())` com parênteses**, não `auth.uid()` solto. O Postgres
  avalia a subquery uma vez em vez de uma vez por linha. Em tabela grande a
  diferença é enorme.
- **Índice em toda coluna usada em policy ou em `where`.**

## Passo 4 — Aplicar e gerar os tipos

```bash
npm run db:push
npm run db:types
```

O segundo comando reescreve `lib/supabase/database.types.ts`. Sem ele, o
TypeScript não conhece a tabela nova e suas queries voltam como `any`.

## Passo 5 — Provar que o RLS funciona

Não confie: teste. No painel do Supabase, em *SQL Editor*:

```sql
-- Deve retornar 0 linhas: sem usuário logado, ninguém vê nada.
set role anon;
select * from public.itens;
reset role;
```

Se isso retornar qualquer linha, a policy está errada. Pare e corrija antes de
seguir.

## Passo 6 — Conferir

```bash
npm run check
```

## Erros comuns

| Sintoma | Causa quase sempre |
|---|---|
| "new row violates row-level security policy" | Falta policy de `insert`, ou o `user_id` não está sendo preenchido com o usuário logado |
| A listagem volta vazia mesmo tendo dado | RLS ligado sem policy de `select`, ou o `user_id` gravado é diferente do logado |
| Query volta `any` no TypeScript | Faltou `npm run db:types` |
| Listagem lenta | Faltou índice na coluna do RLS |
