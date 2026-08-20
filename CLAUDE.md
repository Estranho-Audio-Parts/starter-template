# Instruções para o Claude Code

**Leia `AGENTS.md` primeiro e siga tudo que está lá.** Aquele arquivo é a fonte
única das regras deste projeto — stack, segurança e padrões de código. Este aqui
só acrescenta o que é específico do Claude Code.

## Skills disponíveis

Use a skill em vez de improvisar. Elas seguem os mesmos playbooks de
`docs/playbooks/`, então o resultado sai igual para toda a equipe.

| Skill | Quando usar |
|---|---|
| `/comecar` | Primeira configuração do projeto (conectar Supabase, criar `.env.local`) |
| `/nova-tabela` | Criar ou alterar tabela no banco, com RLS e tipos |
| `/nova-tela` | Criar tela de listagem + cadastro + edição (CRUD completo) |
| `/revisar-seguranca` | Checklist antes de entregar para o time de devs |
| `/publicar` | Colocar o sistema no ar |

## Lembretes

- Rode `npm run check` antes de dizer que terminou.
- Existe um hook em `.claude/hooks/` que bloqueia migration sem `enable row
  level security`. Se ele te barrar, corrija a migration — não contorne o hook.
