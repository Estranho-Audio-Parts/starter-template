# Segurança, explicada sem jargão

Você não precisa ser programador para entender esta página. Ela explica os dois
ou três conceitos que, se você ignorar, transformam um sistema interno num
vazamento de dados.

## A chave do seu sistema é pública. De propósito.

O arquivo `.env.local` tem uma chave chamada `publishable` (ou `anon`). Ela vai
junto com o site para o navegador de todo mundo que abrir a página. Qualquer
pessoa consegue vê-la apertando F12.

Isso **não** é um erro. É como o sistema foi projetado. A chave sozinha não dá
acesso a nada — ela só identifica o seu projeto.

A consequência é a mais importante deste documento:

> **A segurança dos seus dados não está no código do site. Está no banco.**

Se você escrever no site "só mostre os pedidos do usuário logado", isso funciona
para quem usa o site normalmente — e não funciona para quem sabe usar a chave
direto, pulando o seu site inteiro.

## RLS: a tranca de verdade

RLS (*Row Level Security*, segurança em nível de linha) é a regra escrita
**dentro do banco** dizendo quem pode ver cada linha da tabela. Ela vale para
todo mundo, sempre, venha o pedido de onde vier.

Sem RLS, uma tabela é um documento público. Com RLS, cada pessoa só enxerga o
que a regra permite.

Por isso a regra número um deste template é: **toda tabela tem RLS ligado, com
pelo menos uma policy, na mesma migration que a criou.** Não existe exceção
aceitável, nem "depois eu ligo".

Existe um verificador automático neste projeto que barra migration sem RLS.

## A outra chave, a que não pode vazar

No painel do Supabase existe uma segunda chave, chamada `service_role` (ou
`secret`). Essa **ignora todo o RLS** — é a chave mestra.

Ela não aparece em nenhum lugar deste projeto, e não deve aparecer. Se você
colar essa chave num arquivo do site, qualquer visitante lê e apaga tudo.

Regra prática: qualquer variável que comece com `NEXT_PUBLIC_` vai para o
navegador. Se é segredo, não pode ter esse prefixo — e a `service_role` não
pode estar nem com nem sem prefixo.

## Cadastro aberto

O template vem com cadastro aberto: qualquer pessoa com o link cria conta. Para
um sistema interno, isso normalmente está errado.

Decida logo no começo (`docs/playbooks/comecar.md`, passo 4) e anote a escolha
em `docs/DECISOES.md`.

## O teste que vale mais que qualquer código

Antes de entregar, faça isto à mão:

1. Crie duas contas.
2. Cadastre coisas com a primeira.
3. Entre com a segunda.
4. A segunda enxerga algo da primeira?

Se enxergar, o RLS está errado — não importa o que qualquer verificação
automática tenha dito.

## Se algo vazou

1. No painel do Supabase, em *Settings → API*, rotacione as chaves.
2. Se uma chave foi parar num commit, rotacionar é obrigatório: apagar o arquivo
   não tira do histórico do git.
3. Avise o time de devs. Vazamento não é assunto para resolver sozinho.
