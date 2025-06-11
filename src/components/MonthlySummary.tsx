import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';

interface MonthlySummaryProps {
  year: number;
  month: number;
}

export const MonthlySummary = ({ year, month }: MonthlySummaryProps) => {
  const { getMonthlySummary, lastUpdateTimestamp } = useOrders();
  
  // Usar useMemo para garantir que o summary seja recalculado quando necessário
  const summary = useMemo(() => getMonthlySummary(year, month), [getMonthlySummary, year, month, lastUpdateTimestamp]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">
          📊 Resumo Mensal
        </h2>
        <p className="text-muted-foreground">
          {monthNames[month]} de {year}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Faturamento Total */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <DollarSign className="w-5 h-5" />
              Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(summary.totalValue)}
            </div>
            <p className="text-sm text-green-600">
              Total do mês
            </p>
          </CardContent>
        </Card>

        {/* Total de Pedidos */}
        <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Calendar className="w-5 h-5" />
              Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {summary.totalOrders}
            </div>
            <p className="text-sm text-blue-600">
              Total de encomendas
            </p>
          </CardContent>
        </Card>

        {/* Bolos Produzidos */}
        <Card className="bg-gradient-to-br from-sweet-50 to-pink-50 border-sweet-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sweet-800">
              🎂 Bolos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sweet-700">
              {summary.totalCakes}
            </div>
            <p className="text-sm text-sweet-600">
              Bolos produzidos
            </p>
          </CardContent>
        </Card>

        {/* Doces & Bem-casados */}
        <Card className="bg-gradient-to-br from-lavender-50 to-purple-50 border-lavender-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lavender-800">
              <Package className="w-5 h-5" />
              Doces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-lavender-700">
              {summary.totalSweets + summary.totalWeddings}
            </div>
            <p className="text-sm text-lavender-600">
              Unidades produzidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur border-sweet-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-800">
              🍰 Detalhamento de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-sweet-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎂</span>
                <span className="font-medium">Bolos</span>
              </div>
              <Badge variant="secondary" className="bg-sweet-100 text-sweet-800">
                {summary.totalCakes} unidades
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">🍭</span>
                <span className="font-medium">Doces de festa</span>
              </div>
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                {summary.totalSweets} unidades
              </Badge>
            </div>

            <div className="flex justify-between items-center p-3 bg-lavender-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">💒</span>
                <span className="font-medium">Bem-casados</span>
              </div>
              <Badge variant="secondary" className="bg-lavender-100 text-lavender-800">
                {summary.totalWeddings} unidades
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur border-sweet-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-800">
              <TrendingUp className="w-5 h-5" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ticket médio por pedido</span>
                <span className="font-medium">
                  {summary.totalOrders > 0 
                    ? formatCurrency(summary.totalValue / summary.totalOrders)
                    : formatCurrency(0)
                  }
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Produtos por pedido</span>
                <span className="font-medium">
                  {summary.totalOrders > 0 
                    ? ((summary.totalCakes + summary.totalSweets + summary.totalWeddings) / summary.totalOrders).toFixed(1)
                    : '0'
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor médio por bolo</span>
                <span className="font-medium">
                  {summary.totalCakes > 0 
                    ? formatCurrency(summary.totalValue / summary.totalCakes)
                    : formatCurrency(0)
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {summary.totalOrders === 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nenhum pedido registrado
            </h3>
            <p className="text-gray-600">
              Ainda não há pedidos para {monthNames[month]} de {year}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
