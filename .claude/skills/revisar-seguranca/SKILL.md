---
name: revisar-seguranca
description: Revisa o sistema procurando tabela sem RLS, segredo vazado, Server Action desprotegida e uso de any. Use antes de publicar ou antes de entregar o projeto para o time de desenvolvedores.
---

Leia `docs/playbooks/revisar-seguranca.md` e execute **todas** as verificações
de verdade, rodando os comandos. Não presuma resultado.

O teste do item 6 (duas contas, confirmar que uma não vê os dados da outra)
depende do usuário. Peça para ele fazer e aguarde a resposta.

Termine com o relatório do item 7, em português de negócio. Se algo falhou,
diga claramente o que um estranho conseguiria fazer — não amenize.
