# Template de sistemas internos — Next.js 16 + Supabase

Um template para **pessoas que não programam construírem sistemas internos com
IA**, de um jeito que a equipe de desenvolvimento consiga assumir depois.

O starter oficial do Supabase entrega login e uma página em branco. Este aqui
acrescenta o que faltava para o resultado não sair despadronizado quando quem
está no teclado é a IA: regras que ela lê sozinha, playbooks para as tarefas
comuns, e um verificador que barra o erro mais caro antes que ele aconteça.

```bash
npx @estranho-audio-parts/criar-sistema meu-sistema
```

## O modelo de trabalho

1. Alguém da operação descreve o problema para a IA e constrói a solução.
2. As regras deste template mantêm stack, segurança e aparência padronizadas.
3. A equipe de desenvolvimento assume depois — e encontra um projeto que
   reconhece, com o histórico das decisões escrito.

O risco central desse modelo não é a IA escrever código feio. É **RLS**: quem
está criando tabelas não sabe que a chave do banco fica visível no navegador, e
que uma tabela sem política de acesso é um documento público. É nesse ponto que
o template não negocia.

## O que vem pronto

| | |
|---|---|
| **Stack fixa** | Next.js 16 (App Router), React 19, TypeScript strict, Supabase, Tailwind v4, shadcn/ui |
| **Autenticação** | Login, cadastro, recuperação de senha, confirmação por e-mail |
| **Rotas fechadas por padrão** | Tudo exige sessão, menos o que estiver listado em um arquivo só |
| **Banco** | Migration base com RLS, `profiles` e criação automática de perfil |
| **Layout** | Sidebar, barra superior, breadcrumb e painel com indicadores |
| **Regras para IA** | `AGENTS.md` lido por Codex, Cursor e Claude Code |
| **Playbooks** | Passo a passo para criar tabela, criar tela, revisar segurança e publicar |
| **Trava de RLS** | Hook que bloqueia migration que cria tabela sem `enable row level security` |
| **CI** | Todo projeto gerado já nasce com lint, typecheck e build no push |

## As regras que a IA segue

Ficam em [`AGENTS.md`](AGENTS.md). As invioláveis:

1. Toda tabela nasce com RLS ligado e pelo menos uma política, na mesma migration.
2. A chave `service_role` nunca toca código de cliente; nada secreto usa `NEXT_PUBLIC_`.
3. Todo schema nasce em migration — nunca clicando no painel.
4. Toda Server Action valida a entrada com zod **no servidor**.
5. Toda página protegida revalida a sessão: o proxy não é autorização.
6. Nada de `any` — os tipos das tabelas são gerados.

A primeira é a única verificada por máquina, porque é a que causa o pior
estrago quando passa batido.

## Documentação

| Arquivo | Assunto |
|---|---|
| [`AGENTS.md`](AGENTS.md) | As regras. Fonte única, lida pelas três ferramentas |
| [`docs/ESTILO.md`](docs/ESTILO.md) | O padrão visual: painel neutro, cor só para estado |
| [`docs/SEGURANCA.md`](docs/SEGURANCA.md) | RLS explicado para quem não é programador |
| [`docs/STACK.md`](docs/STACK.md) | As escolhas técnicas e o porquê |
| [`docs/playbooks/`](docs/playbooks/) | Um roteiro por tarefa comum |
| [`cli/README.md`](cli/README.md) | Como manter e publicar o template |

## Adaptando para a sua equipe

O conteúdo é opinativo de propósito, e é em português. Para usar na sua
organização:

1. Faça um fork.
2. Reescreva [`AGENTS.md`](AGENTS.md) com as suas decisões de stack.
3. Ajuste [`docs/ESTILO.md`](docs/ESTILO.md) para a sua identidade visual.
4. Troque o escopo em [`cli/package.json`](cli/package.json) e publique.

O mecanismo — regras em arquivo, playbooks referenciados por skills, hook de
verificação, CLI que empacota a raiz do repositório — funciona com qualquer
conteúdo. Veja [`cli/README.md`](cli/README.md).

## Desenvolvimento

```bash
npm install
npm run dev          # sobe em localhost:3000
npm run check        # lint + typecheck + build
npx supabase start   # banco local, se tiver Docker
```

Para testar o gerador sem publicar:

```bash
node scripts/sync-template.mjs
cd /tmp && node /caminho/do/repo/cli/index.mjs teste && cd teste && npm run check
```

## Licença

MIT — veja [`LICENSE`](LICENSE).
