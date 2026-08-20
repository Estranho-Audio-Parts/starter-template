---
name: nova-tabela
description: Cria ou altera tabela no banco Supabase com RLS, policies, trigger de updated_at, índices e tipos TypeScript. Use sempre que precisar guardar um tipo novo de informação (cadastro, registro, lançamento, chamado).
---

Leia `docs/playbooks/nova-tabela.md` e siga todos os passos.

Comece **sempre** pelo passo 1: perguntar ao usuário quem pode ver e editar os
dados. Não escreva SQL antes dessa resposta — ela define as policies de RLS, e
não dá para adivinhar.

Nunca entregue uma migration sem `alter table ... enable row level security` e
pelo menos uma policy. Existe um hook neste projeto que bloqueia isso.
