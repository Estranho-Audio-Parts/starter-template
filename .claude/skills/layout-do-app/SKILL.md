---
name: layout-do-app
description: Monta a moldura do sistema — sidebar com menu, barra superior, migalha de navegação e área de conteúdo, no estilo padrão do grupo. Use uma vez por projeto, antes da primeira tela de verdade.
---

Leia `docs/ESTILO.md` e o código que já existe (`app/(app)/layout.tsx`,
`components/app-sidebar.tsx`, `components/app-topbar.tsx`) antes de mexer.
A moldura já vem montada: normalmente basta editar `lib/navegacao.ts`.

Depois siga `docs/playbooks/layout-do-app.md` passo a passo.

Não construa sidebar à mão: rode
`npx shadcn@latest add sidebar breadcrumb avatar tabs command chart` primeiro.

No passo 2, pergunte ao usuário quais são as áreas do sistema em linguagem de
negócio ("quais nomes você quer ver no menu da esquerda?"), não em termos
técnicos.
