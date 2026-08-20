# Validadores

Um arquivo por entidade. O MESMO schema zod é usado nos dois lados:

- no formulário, via `zodResolver` do `react-hook-form` (feedback pro usuário);
- na Server Action, via `schema.safeParse` (proteção de verdade).

Nunca valide só no formulário. Quem chama a Server Action pode ser um script.

Exemplo (`lib/validators/item.ts`):

```ts
import { z } from "zod";

export const itemSchema = z.object({
  titulo: z.string().trim().min(1, "Informe um título").max(120),
  descricao: z.string().trim().max(2000).optional(),
  valorCentavos: z.coerce.number().int().min(0).optional(),
});

export type ItemInput = z.infer<typeof itemSchema>;
```
