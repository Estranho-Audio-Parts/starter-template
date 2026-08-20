import { Suspense } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { requireUser } from "@/lib/supabase/require-user";

/**
 * A moldura do sistema: sidebar + barra de cima.
 *
 * O grupo "(app)" entre parenteses nao vira URL. Ele separa as telas que tem
 * moldura (tudo que e logado) das que nao tem (login, cadastro).
 * Toda tela nova em app/(app)/<nome>/page.tsx ja nasce dentro daqui.
 *
 * ATENCAO ao Suspense em volta da sidebar: este projeto usa cacheComponents
 * (PPR) do Next 16. Ler cookie ou sessao no corpo de um layout, sem limite de
 * Suspense, faz o build falhar com "uncached or runtime data during
 * prerendering". Por isso a parte que depende do usuario fica isolada num
 * componente proprio, e o resto da moldura sai pronto do cache.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<SidebarCarregando />}>
        <SidebarDoUsuario />
      </Suspense>
      <SidebarInset>
        <AppTopbar />
        <main className="flex flex-1 flex-col gap-8 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

/**
 * Confere a sessao e monta a sidebar com o e-mail de quem esta logado.
 *
 * Esta checagem e defesa em profundidade: o proxy.ts ja barra visitante antes
 * de chegar aqui, e o RLS e o que de fato protege os dados. Cada pagina que
 * le dado continua chamando requireUser() por conta propria.
 */
async function SidebarDoUsuario() {
  const { user } = await requireUser();
  return <AppSidebar email={String(user.email)} />;
}

function SidebarCarregando() {
  return (
    <div className="bg-sidebar hidden w-(--sidebar-width) shrink-0 border-r md:block" />
  );
}
