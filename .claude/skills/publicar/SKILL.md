---
name: publicar
description: Coloca o sistema no ar na Vercel, aplica o banco em produção e ajusta as URLs de autenticação do Supabase. Use quando o sistema estiver pronto para as pessoas usarem.
---

Antes de qualquer coisa, rode a skill `revisar-seguranca`. Não publique sistema
que não passou na revisão.

Depois leia `docs/playbooks/publicar.md` e siga os passos.

Atenção especial ao passo 4 (URLs no painel do Supabase): é o esquecimento mais
comum, e o sintoma é o e-mail de confirmação apontando para localhost.
