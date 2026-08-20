import { LayoutDashboard, type LucideIcon } from "lucide-react";

/**
 * O MENU DO SISTEMA MORA AQUI, E SO AQUI.
 * ========================================
 * Para adicionar uma tela ao menu, edite este arquivo. Nao mexa no JSX da
 * sidebar — ela le esta lista.
 *
 * O template vem com um item so, de proposito: o menu depende de cada sistema.
 *
 * Para adicionar um item simples:
 *
 *   { titulo: "Clientes", href: "/clientes", icone: Users }
 *
 * Para adicionar um item com sub-itens (vira uma seta que abre):
 *
 *   {
 *     titulo: "Produtos",
 *     href: "/produtos",
 *     icone: Package,
 *     filhos: [
 *       { titulo: "Todos os produtos", href: "/produtos" },
 *       { titulo: "Novo produto", href: "/produtos/novo" },
 *     ],
 *   }
 *
 * Regras:
 * - Icone vem do lucide-react (https://lucide.dev/icons) — importe no topo.
 * - Cada href precisa ter uma pasta correspondente em app/(app)/.
 *   Item apontando para rota que nao existe da 404.
 * - Grupo com um item so nao e grupo: deixe o item solto no grupo principal.
 * - No maximo 3 grupos. Mais que isso, ninguem acha nada.
 */

export type ItemFilho = {
  titulo: string;
  href: string;
};

export type ItemNav = {
  titulo: string;
  href: string;
  icone: LucideIcon;
  filhos?: ItemFilho[];
};

export type GrupoNav = {
  grupo: string;
  itens: ItemNav[];
};

export const NAVEGACAO: GrupoNav[] = [
  {
    grupo: "Sistema",
    itens: [{ titulo: "Painel", href: "/dashboard", icone: LayoutDashboard }],
  },
];

/** Nome que aparece no topo da sidebar. Troque pelo nome do seu sistema. */
export const NOME_DO_SISTEMA = "Sistema interno";
