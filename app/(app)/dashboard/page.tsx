import { CreditCard, DollarSign, ShoppingCart, Users } from "lucide-react";

import { CardIndicador } from "@/components/card-indicador";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Painel de exemplo.
 *
 * Os numeros abaixo sao FICTICIOS: servem para mostrar o padrao visual
 * (docs/ESTILO.md secao 3). Troque por dados reais do seu banco — o jeito certo
 * de buscar esta em docs/playbooks/nova-tela.md.
 */
const INDICADORES = [
  {
    rotulo: "Faturamento do mês",
    valor: "R$ 189.540,75",
    comparacao: "R$ 148.230,00 no mês anterior",
    variacao: 27.9,
    icone: DollarSign,
  },
  {
    rotulo: "Pedidos atendidos",
    valor: "21.847",
    comparacao: "18.452 no mês anterior",
    variacao: 18.4,
    icone: ShoppingCart,
  },
  {
    rotulo: "Novos clientes",
    valor: "4.975",
    comparacao: "4.120 no mês anterior",
    variacao: 20.8,
    icone: Users,
  },
  {
    rotulo: "Devoluções",
    valor: "R$ 8.473,00",
    comparacao: "R$ 9.821,00 no mês anterior",
    variacao: -13.7,
    icone: CreditCard,
  },
];

export default function DashboardPage() {
  return (
    <>
      {/* Cabecalho de pagina: titulo, subtitulo e, quando houver, as acoes. */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema. Substitua estes números pelos dados que
          importam para você.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INDICADORES.map((indicador) => (
          <CardIndicador key={indicador.rotulo} {...indicador} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximo passo</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground flex flex-col gap-2 text-sm">
          <p>
            Peça para a IA criar a primeira tela do seu sistema. Por exemplo:
            <span className="text-foreground block pt-2 font-medium">
              &ldquo;crie uma tela para cadastrar os veículos da frota, com
              placa, modelo, ano e quilometragem&rdquo;
            </span>
          </p>
          <p>
            Ela vai criar a tabela no banco, a tela de cadastro e adicionar o
            item no menu — seguindo o padrão do grupo.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
