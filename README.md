# Sistema interno

Este projeto foi criado a partir do **template padrão do grupo**. Ele já vem com
login, banco de dados, tema claro/escuro e as regras de segurança configuradas.

Você não precisa saber programar para usar. Precisa saber explicar o que quer.

---

## Comece por aqui

### 1. Crie o banco de dados

Abra <https://database.new> e crie um projeto novo.
Escolha a região **South America (São Paulo)** e guarde a senha em lugar seguro.

### 2. Preencha as duas chaves

No painel do Supabase, vá em **Project Settings → API** e copie os dois valores
para o arquivo `.env.local` que já está na pasta do projeto:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

> Se você vir uma chave chamada `service_role` ou `secret`: **ela não vai aqui**
> e não vai em lugar nenhum. É a chave mestra do banco.

### 3. Chame a IA

Abra a pasta na sua ferramenta de IA (Codex, Cursor ou Claude Code) e escreva:

```
leia o AGENTS.md e me ajude a configurar o projeto
```

A IA lê as regras do grupo sozinha e segue o passo a passo. A partir daí, é só
descrever o que você precisa:

```
crie uma tela para cadastrar os veículos da frota, com placa,
modelo, ano e quilometragem
```

---

## Antes de mostrar para alguém

Peça para a IA:

```
rode a revisão de segurança
```

Ela confere se os dados estão protegidos — principalmente se um usuário não
consegue ver o cadastro de outro. **Isso é obrigatório antes de publicar.**

---

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Abre o sistema em <http://localhost:3000> |
| `npm run check` | Confere se está tudo certo antes de entregar |
| `npm run db:push` | Aplica as mudanças do banco |
| `npm run db:types` | Atualiza os tipos depois de mexer no banco |

---

## Documentação

| Arquivo | Para quê |
|---|---|
| [`AGENTS.md`](AGENTS.md) | As regras que a IA segue. Leia se quiser entender as decisões |
| [`docs/SEGURANCA.md`](docs/SEGURANCA.md) | **Leia este.** Explica sem jargão o que protege seus dados |
| [`docs/ESTILO.md`](docs/ESTILO.md) | A aparência padrão dos sistemas do grupo |
| [`docs/STACK.md`](docs/STACK.md) | As tecnologias usadas e por quê |
| [`docs/DECISOES.md`](docs/DECISOES.md) | Preencha conforme for decidindo. O time de devs lê primeiro |
| [`docs/playbooks/`](docs/playbooks/) | Passo a passo de cada tarefa comum |

---

## Quando chamar o time de devs

- O sistema vai lidar com dinheiro, dado de cliente ou informação sigilosa.
- A revisão de segurança apontou algo que você não entendeu.
- Mais de 20 ou 30 pessoas vão usar.
- Você precisa integrar com outro sistema do grupo.

Ao entregar, mande: a URL do sistema, a do repositório, o `ref` do projeto
Supabase e o `docs/DECISOES.md` preenchido.
