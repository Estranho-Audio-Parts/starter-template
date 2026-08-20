import { requireUser } from "@/lib/supabase/require-user";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function BoasVindas() {
  // requireUser revalida a sessao no servidor. O proxy.ts barra visitante na
  // porta, mas ele nao e autorizacao — toda pagina protegida confere de novo.
  const { user } = await requireUser();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Olá, {String(user.email)}</h1>
      <p className="text-muted-foreground">
        Esta é a área logada do sistema. Peça para a IA criar as telas que você
        precisa — elas vão aparecer aqui dentro.
      </p>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <Suspense fallback={<Skeleton className="h-20 w-full" />}>
        <BoasVindas />
      </Suspense>
    </div>
  );
}
