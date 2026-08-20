# @grupo/criar-sistema

CLI que cria um projeto novo a partir do template padrão do grupo.

Este README é para **quem mantém o template**, não para quem usa.

## Como funciona

O template é a raiz deste repositório. O script `scripts/sync-template.mjs`
copia a raiz para `cli/template/`, que é o que vai dentro do pacote npm.

```
raiz do repo  ──sync──▶  cli/template/  ──npm publish──▶  npx @grupo/criar-sistema
```

Um arquivo só existe em um lugar: a raiz. Nunca edite `cli/template/` à mão —
o sync apaga e recria a pasta.

## Antes de publicar pela primeira vez

1. **Troque o escopo.** Em `cli/package.json`, o nome está como
   `@grupo/criar-sistema`. Troque `@grupo` pelo escopo real da organização no
   npm. Atualize também as menções em `README.md` e `cli/README.md`.
2. **Crie a organização no npm** (ou configure o registry privado do grupo).
3. `npm login`.

O pacote está com `"access": "restricted"` — publica privado. Se a organização
não tiver plano pago, mude para `"public"` ou use um registry interno.

## Publicar uma versão

```bash
cd cli
npm version patch     # ou minor / major
npm publish
```

O `prepack` roda o sync sozinho, então o template publicado é sempre o estado
atual da raiz do repositório.

## Testar sem publicar

```bash
node scripts/sync-template.mjs
mkdir -p /tmp/teste && cd /tmp/teste
node /caminho/para/o/repo/cli/index.mjs sistema-teste
cd sistema-teste && npm run check
```

`npm run check` precisa passar limpo. Se não passar, o template está quebrado
para todo mundo que criar projeto a partir dele.

## Ao alterar as regras

As regras vivem em `AGENTS.md` (fonte única). `CLAUDE.md` e
`.cursor/rules/projeto.mdc` só apontam para ele — não duplique conteúdo lá.

Os playbooks em `docs/playbooks/` são lidos pelas três ferramentas. As skills em
`.claude/skills/` são invólucros finos que apontam para os playbooks; se você
mudar um playbook, a skill acompanha sozinha.

Depois de mexer nas regras, suba uma versão `minor` para que os projetos novos
já nasçam com elas.

## O que o CLI faz

1. Copia `cli/template/` para a pasta nova.
2. Renomeia `_gitignore` → `.gitignore` (o npm remove `.gitignore` do pacote).
3. Ajusta o `name` no `package.json`.
4. Cria o `.env.local` a partir do `.env.example`.
5. `git init` e `npm install`.
