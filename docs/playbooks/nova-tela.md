# Playbook: criar tela de CRUD

CRUD = listar, cadastrar, editar e apagar. É a tela mais comum de sistema
interno. Siga esta estrutura para todas — assim qualquer dev da equipe abre o
projeto e já sabe onde está cada coisa.

**Pré-requisito**: a tabela já existe. Se não existe, faça
`docs/playbooks/nova-tabela.md` primeiro.

## Estrutura de arquivos

Para uma entidade chamada `itens`:

```
app/itens/
  page.tsx          Server Component: busca e lista
  actions.ts        Server Actions: criar, atualizar, apagar
  item-form.tsx     Client Component: o formulário
lib/validators/
  item.ts           schema zod, usado nos dois lados
```

## 1. Validador (`lib/validators/item.ts`)

```ts
import { z } from "zod";

export const itemSchema = z.object({
  titulo: z.string().trim().min(1, "Informe um título").max(120),
  descricao: z.string().trim().max(2000).optional(),
});

export type ItemInput = z.infer<typeof itemSchema>;
```

## 2. Server Actions (`app/itens/actions.ts`)

```ts
"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/require-user";
import { itemSchema } from "@/lib/validators/item";

export type ActionResult = { ok: true } | { ok: false; erro: string };

export async function criarItem(dados: unknown): Promise<ActionResult> {
  // 1. Sempre confirme quem está chamando. Server Action é um endpoint público.
  const { supabase, user } = await requireUser();

  // 2. Sempre valide no servidor, mesmo que o formulário já tenha validado.
  const parsed = itemSchema.safeParse(dados);
  if (!parsed.success) {
    return { ok: false, erro: parsed.error.issues[0].message };
  }

  // 3. O user_id vem da sessão, NUNCA do que o cliente mandou.
  const { error } = await supabase.from("itens").insert({
    ...parsed.data,
    user_id: user.sub as string,
  });

  if (error) return { ok: false, erro: error.message };

  // 4. Faz a listagem recarregar.
  revalidatePath("/itens");
  return { ok: true };
}

export async function apagarItem(id: string): Promise<ActionResult> {
  const { supabase } = await requireUser();

  // Não precisa filtrar por user_id aqui: o RLS já impede apagar o que não é seu.
  // Mas o requireUser acima continua sendo obrigatório.
  const { error } = await supabase.from("itens").delete().eq("id", id);
  if (error) return { ok: false, erro: error.message };

  revalidatePath("/itens");
  return { ok: true };
}
```

## 3. Listagem (`app/itens/page.tsx`)

Server Component. Busca direto no banco, sem `useEffect`, sem API intermediária.

```tsx
import { Suspense } from "react";
import { requireUser } from "@/lib/supabase/require-user";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

async function ListaItens() {
  const { supabase } = await requireUser();

  const { data: itens, error } = await supabase
    .from("itens")
    .select("id, titulo, descricao, created_at")
    .order("created_at", { ascending: false });

  // Estado de erro: nunca deixe a tela em branco sem explicação.
  if (error) {
    return (
      <p className="text-sm text-destructive">
        Não foi possível carregar os itens: {error.message}
      </p>
    );
  }

  // Estado vazio: tabela vazia sem texto parece sistema quebrado.
  if (!itens?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum item cadastrado ainda. Use o formulário acima para criar o primeiro.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Descrição</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {itens.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.titulo}</TableCell>
            <TableCell>{item.descricao ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ItensPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-bold">Itens</h1>
      {/* Estado de carregando: o Suspense mostra o skeleton enquanto busca. */}
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <ListaItens />
      </Suspense>
    </div>
  );
}
```

## 4. Formulário (`app/itens/item-form.tsx`)

Aqui sim `"use client"`, porque tem estado e evento.

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { itemSchema, type ItemInput } from "@/lib/validators/item";
import { criarItem } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

export function ItemForm() {
  const form = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: { titulo: "", descricao: "" },
  });

  async function onSubmit(valores: ItemInput) {
    const resultado = await criarItem(valores);
    if (!resultado.ok) {
      toast.error(resultado.erro);
      return;
    }
    toast.success("Item criado.");
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: Trocar o filtro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
```

> O `<Toaster />` precisa estar no `app/layout.tsx` uma vez, senão o `toast()`
> não aparece. O template já vem com ele.

## Checklist antes de dizer que terminou

- [ ] `requireUser()` no começo de toda action e de toda página protegida
- [ ] `safeParse` no servidor, com o mesmo schema do formulário
- [ ] `user_id` vindo da sessão, nunca do corpo da requisição
- [ ] `revalidatePath` depois de toda escrita
- [ ] Os três estados na tela: carregando, vazio e erro
- [ ] `npm run check` passando
