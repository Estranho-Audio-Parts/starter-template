# Playbook: revisar antes de entregar

Rode esta revisão **antes** de publicar e antes de passar o projeto para o time
de devs. É o portão de qualidade do grupo.

Faça cada verificação de verdade — não presuma. Ao final, escreva um resumo
honesto do que passou e do que não passou.

## 1. RLS em todas as tabelas

```bash
grep -L "enable row level security" supabase/migrations/*.sql
```

Esse comando lista os arquivos **sem** RLS. O resultado esperado é vazio
(migrations que só criam função ou índice podem aparecer — confira uma a uma).

Depois, no *SQL Editor* do Supabase, o teste que vale:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public';
```

Toda linha precisa ter `rowsecurity = true`. Se alguma estiver `false`, essa
tabela está aberta para leitura pública. Corrija antes de qualquer outra coisa.

E confirme que toda tabela com RLS tem policy:

```sql
select t.tablename, count(p.policyname) as policies
from pg_tables t
left join pg_policies p
  on p.schemaname = t.schemaname and p.tablename = t.tablename
where t.schemaname = 'public'
group by t.tablename
order by policies asc;
```

Tabela com `0` policies fica invisível para todo mundo — o sistema vai parecer
quebrado. Tabela com policy `to public` ou `to anon` está exposta.

## 2. Nenhum segredo vazando

```bash
grep -rn "service_role\|SUPABASE_SERVICE\|secret" --include="*.ts" --include="*.tsx" app components lib
git ls-files | grep -E "^\.env" 
```

O primeiro não pode achar nada em código de cliente. O segundo só pode listar
`.env.example` — se aparecer `.env` ou `.env.local`, o segredo foi para o
histórico do git e precisa ser rotacionado no painel do Supabase.

## 3. Toda Server Action se protege

```bash
grep -rLn "requireUser" $(grep -rl '"use server"' app lib 2>/dev/null) 2>/dev/null
```

Arquivo que declara `"use server"` e não chama `requireUser()` está aceitando
chamada de qualquer pessoa na internet. Confira um a um.

Confirme também que cada uma faz `safeParse` da entrada.

## 4. Nada de `any`

```bash
grep -rn ": any\|as any" --include="*.ts" --include="*.tsx" app components lib
```

Se achar algo, quase sempre a causa é ter esquecido `npm run db:types`.

## 5. O básico funciona

```bash
npm run check
```

Lint, TypeScript e build precisam passar limpos.

## 6. Teste manual de vazamento

O mais importante e o mais pulado:

1. Crie **duas** contas diferentes no sistema.
2. Com a conta A, cadastre alguns registros.
3. Entre com a conta B.
4. Confirme que a conta B **não** vê nada da conta A.

Se a conta B enxergar dado da A, o RLS está errado — independente do que os
comandos acima disseram.

## 7. Relatório

Escreva para o usuário, em português simples:

- o que foi verificado e passou;
- o que falhou e qual o risco em linguagem de negócio
  ("qualquer pessoa com o link consegue ler os cadastros de todo mundo");
- o que você corrigiu;
- o que ficou pendente e precisa de decisão dele.

Não diga que está tudo certo se você não rodou as verificações.
