# Playbook: começar o projeto

Rode isto uma única vez, quando o projeto acabou de ser criado.

## 1. Criar o projeto no Supabase

O usuário precisa fazer isso pelo navegador (você não tem acesso à conta dele):

1. Abrir <https://database.new> e criar um projeto novo.
2. Escolher a região **South America (São Paulo)** — o banco fica mais perto,
   o sistema responde mais rápido.
3. Guardar a senha do banco em lugar seguro. Ela não aparece de novo.

Cada sistema tem o **seu próprio projeto Supabase**. Não reaproveite o projeto
de outro sistema: se alguém errar uma permissão, o problema fica contido aqui.

## 2. Preencher as variáveis de ambiente

Em *Project Settings → API* o usuário copia dois valores.

```bash
cp .env.example .env.local
```

Depois preencha `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

> A chave `publishable` (antiga `anon`) pode aparecer no navegador — é o esperado.
> Se você vir uma chave chamada `service_role` ou `secret`, **ela não vai aqui**
> e não vai em lugar nenhum deste repositório.

`.env.local` já está no `.gitignore`. Nunca comite esse arquivo.

## 3. Aplicar o banco

```bash
npx supabase login
npx supabase link --project-ref <ref-do-projeto>
npm run db:push
npm run db:types
```

O `ref` está na URL do painel: `https://supabase.com/dashboard/project/<ref>`.

Isso cria a tabela `profiles` com RLS e liga o gatilho que cria o perfil
sozinho quando alguém se cadastra.

## 4. Decidir quem pode entrar

O template vem com **cadastro aberto**: qualquer pessoa com o link cria conta.
Para a maioria dos sistemas internos isso está errado. Pergunte ao usuário:

> "Quem vai usar esse sistema? Só gente da empresa, ou clientes de fora também?"

- **Só gente da empresa** → no painel do Supabase, em *Authentication →
  Sign In / Providers*, desligue "Allow new users to sign up" e cadastre as
  pessoas por convite (*Authentication → Users → Invite*). Alternativa mais
  confortável: ligar o login com Google e restringir pelo domínio do e-mail.
- **Clientes de fora também** → mantenha o cadastro aberto, mas confirme que
  *Confirm email* está ligado, senão qualquer e-mail inventado vira conta.

Registre a escolha em `docs/DECISOES.md`.

## 5. Rodar

```bash
npm run dev
```

Abra <http://localhost:3000>, crie uma conta e confirme que consegue entrar.

## 6. Conferir

```bash
npm run check
```

Precisa passar limpo antes de você começar a construir qualquer coisa.
