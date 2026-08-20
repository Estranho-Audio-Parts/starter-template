# Estilo visual padrão

Todo sistema do grupo tem a mesma cara. Esta página descreve qual é.

A referência está em [`docs/examples/`](examples/) — seis telas reais.
**Abra as imagens antes de desenhar qualquer coisa.** Elas valem mais que
qualquer descrição, e você consegue lê-las.

Referência online: <https://shadcnblocks-admin.vercel.app/ecommerce/dashboard-1>

O resumo em uma frase: **painel administrativo neutro, denso de informação, sem
cor de marca.** Preto, branco e cinza. Cor só quando ela significa alguma coisa.

---

## 1. A regra que manda em todas as outras

**A base é rigorosamente neutra.** Não existe cor primária, não existe roxo de
startup, não existe gradiente. O template já vem com a paleta `neutral` do
shadcn — não a troque.

Cor aparece só para comunicar estado:

| Cor | Significa | Onde |
|---|---|---|
| Verde | Positivo, concluído, pago | Delta `+27.9%`, badge `Pago` |
| Vermelho | Negativo, erro, cancelado | Delta `-13.7%`, badge `Cancelado` |
| Âmbar | Atenção, aguardando | Badge `Pendente`, `Atrasado` |
| Azul | Informativo, em andamento | Badge `Em separação` |
| Cinza | Neutro, rascunho, inativo | Badge `Rascunho` |

Se a cor não está dizendo nada, ela não entra.

---

## 2. Estrutura da tela

Toda tela logada tem a mesma moldura:

```
┌────────────┬──────────────────────────────────────────────┐
│            │  topo: busca ⌘K · notificações · tema        │
│  sidebar   ├──────────────────────────────────────────────┤
│            │  migalha: Sistema / Seção / Página           │
│  (fixa)    ├──────────────────────────────────────────────┤
│            │  Título da página          [Ação secundária] │
│            │  Subtítulo explicando       [Ação principal] │
│            │                                              │
│  ────────  │  ┌── conteúdo ──────────────────────────┐   │
│  usuário   │  └───────────────────────────────────────┘   │
└────────────┴──────────────────────────────────────────────┘
```

### Sidebar
- Largura fixa, borda à direita, fundo `bg-sidebar`.
- **Topo**: logo + nome do sistema.
- **Meio**: itens agrupados. Cada grupo tem um rótulo pequeno e apagado
  (`text-xs text-muted-foreground`) — por exemplo "Cadastros", "Relatórios".
- Cada item = ícone `lucide` de 16px + texto. Item com filhos abre e mostra os
  sub-itens recuados.
- **Item ativo**: `bg-accent` com cantos arredondados. Nada de barra colorida.
- **Rodapé**: avatar + nome + e-mail do usuário logado, com menu de sair.

Não construa isso à mão:

```bash
npx shadcn@latest add sidebar breadcrumb avatar tabs command
```

O componente `sidebar` do shadcn já é exatamente este layout, com recolher,
atalho de teclado e responsivo resolvidos.

### Cabeçalho de página
```tsx
<div className="flex items-start justify-between gap-4">
  <div className="flex flex-col gap-1">
    <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
    <p className="text-muted-foreground">
      Acompanhe pagamentos, entregas e histórico do cliente.
    </p>
  </div>
  <div className="flex items-center gap-2">
    <Button variant="outline">Exportar</Button>
    <Button>Novo pedido</Button>
  </div>
</div>
```

**Uma só ação principal por tela** (botão preto sólido). O resto é `outline`.
O subtítulo não é enfeite — ele diz para que serve a tela.

---

## 3. Cartão de indicador (KPI)

O elemento mais característico do padrão. A ordem importa:

```tsx
<Card className="p-6">
  <div className="flex items-center gap-2">
    <DollarSign className="size-4 text-muted-foreground" />
    <span className="text-sm font-medium">Faturamento do mês</span>
  </div>
  <p className="mt-2 text-sm text-muted-foreground">
    R$ 148.230,00 no mês anterior
  </p>
  <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums">
    R$ 189.540,75
  </p>
  <div className="mt-2 flex items-center gap-1.5 text-sm">
    <TrendingUp className="size-3.5 text-emerald-600" />
    <span className="font-medium text-emerald-600">+27,9%</span>
    <span className="text-muted-foreground">vs. mês passado</span>
  </div>
</Card>
```

Regras:
- **Número grande, `font-bold tracking-tight`, e `tabular-nums`** — sem isso os
  dígitos dançam quando o valor atualiza.
- Sempre com comparação. Um número sozinho não informa nada: "R$ 189 mil" só
  quer dizer algo ao lado de "era R$ 148 mil".
- Ícone pequeno e apagado, nunca colorido nem grande.
- Em linha: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`.

Existe a variante de um cartão único dividido por bordas verticais
(`divide-x`) — veja `example-1.png`. Use quando os indicadores forem do mesmo
assunto.

---

## 4. Gráficos

**Em escala de cinza**, não coloridos. É o que mais destoa do shadcn padrão, e é
proposital: num painel denso, gráfico colorido vira poluição e rouba a atenção
dos badges de status, que são o que realmente precisa saltar.

A série principal é preta; as demais vão clareando. Para isso, sobrescreva os
tokens de gráfico no `app/globals.css`:

```css
:root {
  --chart-1: hsl(0 0% 9%);
  --chart-2: hsl(0 0% 32%);
  --chart-3: hsl(0 0% 51%);
  --chart-4: hsl(0 0% 68%);
  --chart-5: hsl(0 0% 83%);
}
.dark {
  --chart-1: hsl(0 0% 98%);
  --chart-2: hsl(0 0% 78%);
  --chart-3: hsl(0 0% 60%);
  --chart-4: hsl(0 0% 45%);
  --chart-5: hsl(0 0% 32%);
}
```

Outras regras:
- Grade só na horizontal, bem clara. Sem borda em volta da área do gráfico.
- Área preenchida com cinza bem claro, nunca com gradiente saturado.
- O valor total aparece **como texto grande acima do gráfico**, não só no eixo.
- Legenda em cima, com bolinha + rótulo, alinhada à direita do título.

Use `npx shadcn@latest add chart` (Recharts com os wrappers do shadcn).

---

## 5. Tabelas

É onde o sistema interno vive. Veja `example-4.png` e `example-6.png`.

Estrutura de cima para baixo:

1. **Abas** de recorte rápido — `Todos` · `Pendentes` · `Pagos`. Estilo
   sublinhado, não pílula.
2. **Barra de filtros**: campo de busca com ícone à esquerda, selects `outline`
   para os recortes, e à direita as ações da tabela.
3. **Tabela**.

Dentro da tabela:
- Cabeçalho em `text-sm text-muted-foreground`, com seta de ordenação.
- Linhas separadas por borda sutil. **Sem zebra.**
- Números e dinheiro com `tabular-nums`, alinhados à direita.
- Datas por extenso e abreviadas: `18 mar 2026`. Use `date-fns` com `ptBR`.
- Estado sempre como badge, nunca texto solto.
- Última coluna: botão `...` com o menu de ações da linha.
- Um ponto colorido antes do identificador marca "precisa de atenção".

Toda tabela precisa dos três estados: carregando (`Skeleton`), vazia (frase
explicando o que fazer) e erro.

---

## 6. Badges de estado

```tsx
const ESTADOS = {
  pago:      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  pendente:  "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  cancelado: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  andamento: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  rascunho:  "bg-muted text-muted-foreground",
} as const;
```

Fundo bem claro, texto escuro da mesma cor, sem borda forte. Rótulo de uma
palavra, em português, sempre o mesmo termo no sistema inteiro — se é "Pago" na
tabela, é "Pago" no detalhe também.

---

## 7. Formulários

Veja `example-5.png`. Formulário longo **não** é uma pilha de campos: é uma
sequência de cartões por assunto.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Dados da entrega</CardTitle>
    <CardDescription>
      Escolha a transportadora, a velocidade e a proteção do pacote.
    </CardDescription>
  </CardHeader>
  <CardContent className="grid gap-4 md:grid-cols-2">
    {/* campos */}
  </CardContent>
</Card>
```

- Dois campos por linha no desktop, um no celular.
- Texto de ajuda abaixo do campo, `text-sm text-muted-foreground`.
- Quando houver total ou resumo, ele vai numa **coluna lateral à direita**,
  grudada na rolagem (`sticky top-6`), num cartão próprio.
- Botões de salvar ficam **no topo à direita**, junto do título — não no fim de
  uma página de dois metros.

---

## 8. Tipografia e espaçamento

| Uso | Classe |
|---|---|
| Título de página | `text-3xl font-bold tracking-tight` |
| Título de cartão | `text-base font-semibold` |
| Número de destaque | `text-4xl font-bold tracking-tight tabular-nums` |
| Rótulo | `text-sm font-medium` |
| Apoio / descrição | `text-sm text-muted-foreground` |
| Rótulo de grupo | `text-xs text-muted-foreground` |

- Cartões: `p-6`. Espaço entre cartões: `gap-4`. Entre blocos: `gap-8`.
- Cantos: `rounded-xl` nos cartões, `rounded-md` em campo e botão.
- Sombra quase nula (`shadow-xs`). A separação vem da borda, não da sombra.
- Ícones `lucide` de 16px (`size-4`), sempre `text-muted-foreground` quando são
  decorativos.

---

## 9. O que não fazer

- Cor de marca em botão, cartão ou gráfico.
- Gradiente, sombra pesada, animação de entrada.
- Emoji no lugar de ícone.
- Card dentro de card dentro de card.
- Tabela sem estado vazio.
- Número sem comparação.
- Mais de uma ação principal por tela.
- Inventar componente que o shadcn já tem — rode `npx shadcn@latest add` antes.

---

## 10. Modo escuro

O template já vem com claro/escuro funcionando. Só não estrague:

- Nunca escreva cor fixa (`bg-white`, `text-black`, `#fff`). Use os tokens:
  `bg-background`, `text-foreground`, `bg-muted`, `border-border`.
- Cor semântica precisa das duas variantes, como na tabela da seção 6.
- Depois de montar a tela, **troque o tema e olhe**. É onde o erro aparece.
