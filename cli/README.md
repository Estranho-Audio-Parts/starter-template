# @eap-starter-template/criar-sistema

CLI que cria um projeto novo a partir do template padrão do grupo.

Este README é para **quem mantém o template**, não para quem usa.

## Como funciona

O template é a raiz deste repositório. O script `scripts/sync-template.mjs`
copia a raiz para `cli/template/`, que é o que vai dentro do pacote npm.

```
raiz do repo  ──sync──▶  cli/template/  ──npm publish──▶  npx @eap-starter-template/criar-sistema
```

Um arquivo só existe em um lugar: a raiz. Nunca edite `cli/template/` à mão —
o sync apaga e recria a pasta.

## Antes de publicar pela primeira vez

1. **Crie a organização `eap-starter-template` no npm** — o nome da org é o
   escopo do pacote. Plano Free basta para pacote público.
2. `npm login`, com 2FA ativo na conta.
3. Publique a `1.0.0` à mão (veja abaixo). Só a primeira vai assim: o trusted
   publisher é configurado na página do pacote, que ainda não existe.

Se você forkou este repositório para outra organização, troque `@eap-starter-template`
em `cli/package.json`, `README.md` e `cli/README.md`, e ajuste `repository`,
`homepage` e `bugs` em `cli/package.json` — o `--provenance` compara esse
`repository` com o repo que rodou o Actions e falha se não bater.

O pacote está com `"access": "public"`. Pacote privado no npm exige plano pago;
se precisar disso, troque para `"restricted"` ou use um registry interno.

## Publicar uma versão

O GitHub Actions publica sozinho quando você sobe uma tag:

```bash
cd cli
npm version minor          # cria o commit e a tag
git push --follow-tags     # dispara .github/workflows/publicar.yml
```

Exige o secret `NPM_TOKEN` no repositório: um granular access token com
*Bypass 2FA* marcado e escrita no escopo `eap-starter-template`.

Para publicar à mão:

```bash
cd cli && npm publish
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
