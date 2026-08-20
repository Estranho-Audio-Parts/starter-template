---
name: nova-tela
description: Cria tela completa de CRUD (listar, cadastrar, editar, apagar) com Server Actions, react-hook-form e zod, seguindo o padrão do grupo. Use quando o usuário pedir uma tela para cadastrar ou consultar informação.
---

Leia `docs/playbooks/nova-tela.md` e siga a estrutura de arquivos e os modelos
de código exatamente como estão lá.

Para a aparência, siga `docs/ESTILO.md` e abra as imagens de `docs/examples/`:
base neutra, cabeçalho com título e subtítulo, uma única ação principal, estado
sempre em badge, tabela com os três estados (carregando, vazio, erro).

Pré-requisitos: a tabela precisa existir (skill `nova-tabela`) e a moldura do
sistema precisa estar montada (skill `layout-do-app`). A tela nova entra em
`app/(app)/<nome>/page.tsx`, dentro da moldura.

Antes de dizer que terminou, percorra o checklist no final do playbook e rode
`npm run check`.
