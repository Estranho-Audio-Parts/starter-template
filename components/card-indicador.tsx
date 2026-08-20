import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * Card de indicador (KPI) no padrao visual do grupo.
 * Referencia: docs/ESTILO.md secao 3, e docs/examples/example-1.png.
 *
 * Reuse este componente em vez de recriar o markup. Regras que ele ja aplica:
 * - numero grande com tabular-nums (senao os digitos "dançam" ao atualizar)
 * - sempre com comparacao: numero sozinho nao informa nada
 * - verde para positivo, vermelho para negativo, e nada de cor fora disso
 */
export function CardIndicador({
  rotulo,
  valor,
  comparacao,
  variacao,
  icone: Icone,
  className,
}: {
  /** O que o numero mede. Ex.: "Faturamento do mes" */
  rotulo: string;
  /** Ja formatado para exibicao. Ex.: "R$ 189.540,75" */
  valor: string;
  /** Contexto do numero anterior. Ex.: "R$ 148.230,00 no mes anterior" */
  comparacao?: string;
  /** Variacao em porcento. Positivo sobe e fica verde, negativo desce e fica vermelho. */
  variacao?: number;
  icone?: LucideIcon;
  className?: string;
}) {
  const subiu = (variacao ?? 0) >= 0;
  const Seta = subiu ? TrendingUp : TrendingDown;
  const corVariacao = subiu
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-red-600 dark:text-red-400";

  return (
    <Card className={cn("gap-0 p-6", className)}>
      <div className="flex items-center gap-2">
        {Icone ? <Icone className="text-muted-foreground size-4" /> : null}
        <span className="text-sm font-medium">{rotulo}</span>
      </div>

      {comparacao ? (
        <p className="text-muted-foreground mt-2 text-sm">{comparacao}</p>
      ) : null}

      <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums">
        {valor}
      </p>

      {variacao !== undefined ? (
        <div className="mt-2 flex items-center gap-1.5 text-sm">
          <Seta className={cn("size-3.5", corVariacao)} />
          <span className={cn("font-medium tabular-nums", corVariacao)}>
            {subiu ? "+" : ""}
            {variacao.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%
          </span>
          <span className="text-muted-foreground">vs. mês passado</span>
        </div>
      ) : null}
    </Card>
  );
}
