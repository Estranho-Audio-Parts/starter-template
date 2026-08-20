"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, ChevronRight, ChevronsUpDown, LogOut } from "lucide-react";

import { NAVEGACAO, NOME_DO_SISTEMA, type ItemNav } from "@/lib/navegacao";
import { createClient } from "@/lib/supabase/client";
import { LOGIN_PATH } from "@/lib/auth/routes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

/**
 * A sidebar le lib/navegacao.ts. Para mudar o menu, edite lá — nao aqui.
 */
export function AppSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  /**
   * Um item esta ativo quando e a rota atual, ou quando a rota atual esta
   * abaixo dele (/produtos/novo mantem "Produtos" destacado).
   * O `=== "/"` evita que a raiz case com tudo.
   */
  const estaAtivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Box className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{NOME_DO_SISTEMA}</span>
                  <span className="text-muted-foreground text-xs">
                    Next.js + Supabase
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAVEGACAO.map((grupo) => (
          <SidebarGroup key={grupo.grupo}>
            <SidebarGroupLabel>{grupo.grupo}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {grupo.itens.map((item) => (
                  <ItemDoMenu
                    key={item.href}
                    item={item}
                    ativo={estaAtivo(item.href)}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <MenuDoUsuario email={email} />
      </SidebarFooter>

      {/* Borda arrastavel que recolhe e expande a sidebar. */}
      <SidebarRail />
    </Sidebar>
  );
}

function ItemDoMenu({
  item,
  ativo,
  pathname,
}: {
  item: ItemNav;
  ativo: boolean;
  pathname: string;
}) {
  const Icone = item.icone;

  // Item sem filhos: link direto.
  if (!item.filhos?.length) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={ativo} tooltip={item.titulo}>
          <Link href={item.href}>
            <Icone />
            <span>{item.titulo}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Item com filhos: abre e fecha, e ja nasce aberto se voce esta dentro dele.
  return (
    <Collapsible defaultOpen={ativo} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={ativo} tooltip={item.titulo}>
            <Icone />
            <span>{item.titulo}</span>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.filhos.map((filho) => (
              <SidebarMenuSubItem key={filho.href}>
                <SidebarMenuSubButton asChild isActive={pathname === filho.href}>
                  <Link href={filho.href}>{filho.titulo}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function MenuDoUsuario({ email }: { email: string }) {
  const router = useRouter();

  const sair = async () => {
    await createClient().auth.signOut();
    // refresh limpa o cache dos Server Components antes de trocar de rota,
    // senao a tela antiga pode reaparecer por um instante.
    router.refresh();
    router.push(LOGIN_PATH);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {email.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="truncate font-medium">
                  {email.split("@")[0]}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width)"
          >
            <DropdownMenuItem onClick={sair}>
              <LogOut className="size-4" />
              Sair do sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
