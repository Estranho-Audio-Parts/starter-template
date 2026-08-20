"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAVEGACAO, NOME_DO_SISTEMA } from "@/lib/navegacao";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/** Mapa href -> titulo, montado a partir do menu, para a migalha ter nome bonito. */
const TITULOS = new Map<string, string>();
for (const grupo of NAVEGACAO) {
  for (const item of grupo.itens) {
    TITULOS.set(item.href, item.titulo);
    for (const filho of item.filhos ?? []) TITULOS.set(filho.href, filho.titulo);
  }
}

/** "novo-produto" -> "Novo produto" (usado quando a rota nao esta no menu). */
function humanizar(segmento: string) {
  const texto = segmento.replace(/-/g, " ");
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function AppTopbar() {
  const pathname = usePathname();

  const segmentos = pathname.split("/").filter(Boolean);
  const trilha = segmentos.map((segmento, i) => {
    const href = `/${segmentos.slice(0, i + 1).join("/")}`;
    return { href, titulo: TITULOS.get(href) ?? humanizar(segmento) };
  });

  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href="/dashboard">{NOME_DO_SISTEMA}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {trilha.map((item, i) => (
            <Fragmento key={item.href}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {i === trilha.length - 1 ? (
                  <BreadcrumbPage>{item.titulo}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.titulo}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragmento>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1">
        <ThemeSwitcher />
      </div>
    </header>
  );
}

/** Envolve dois nos irmaos sem sujar o DOM. */
function Fragmento({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
