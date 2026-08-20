# Playbook: publicar o sistema

**Antes de tudo**: rode `docs/playbooks/revisar-seguranca.md`. Não publique
sistema que não passou na revisão.

## 1. Subir o código

O projeto precisa estar num repositório Git da organização.

```bash
git status          # confirme que .env.local NÃO aparece
git add .
git commit -m "primeira versão do sistema"
git push
```

## 2. Aplicar o banco em produção

```bash
npm run db:push
```

Confirme no painel do Supabase que as tabelas e as policies apareceram.

## 3. Publicar na Vercel

1. Em <https://vercel.com/new>, importe o repositório.
2. Em *Environment Variables*, adicione as duas:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Deploy.

> Essas variáveis são embutidas **durante o build**, não lidas quando o site
> sobe. Se você adicionar depois, precisa refazer o deploy (*Redeploy*) — senão
> o site publicado continua achando que não está configurado.

## 4. Ajustar as URLs no Supabase

Esse passo é esquecido quase sempre, e o sintoma é "o link do e-mail de
confirmação leva para localhost".

No painel do Supabase, em *Authentication → URL Configuration*:

- **Site URL**: `https://seu-sistema.vercel.app`
- **Redirect URLs**: adicione
  - `https://seu-sistema.vercel.app/**`
  - `http://localhost:3000/**` (para continuar desenvolvendo)

## 5. Testar em produção

Na URL publicada, de verdade:

- [ ] criar uma conta
- [ ] receber e abrir o e-mail de confirmação (o link aponta para o domínio certo?)
- [ ] entrar
- [ ] cadastrar um registro
- [ ] sair e entrar de novo
- [ ] com uma segunda conta, confirmar que não vê os dados da primeira

## 6. Entregar

Avise o time de devs com:

- URL do sistema;
- URL do repositório;
- `ref` do projeto Supabase;
- o relatório da revisão de segurança;
- o conteúdo de `docs/DECISOES.md`.
