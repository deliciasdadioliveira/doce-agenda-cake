
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DailySummaryProps {
  date: string;
}

export const DailySummary = ({ date }: DailySummaryProps) => {
  const { orders, getDailySummary } = useOrders();
  const summary = getDailySummary(date);
  
  // Força re-renderização quando orders mudam
  const ordersCount = orders.length;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">
          📋 Resumo do Dia
        </h2>
        <p className="text-muted-foreground">
          {formatDate(date)}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resumo de Bolos */}
        <Card className="bg-white/70 backdrop-blur border-sweet-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-800">
              🎂 Bolos por Tamanho
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(summary.cakesBySize).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum bolo para hoje
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(summary.cakesBySize).map(([size, count]) => (
                  <div key={size} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{size}</span>
                    <Badge variant="secondary" className="bg-sweet-100 text-sweet-800">
                      {count} {count === 1 ? 'bolo' : 'bolos'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo de Doces e Bem-casados */}
        <Card className="bg-white/70 backdrop-blur border-sweet-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-800">
              <Package className="w-5 h-5" />
              Doces & Bem-casados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">🍭 Doces de festa</span>
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                {summary.totalSweets} unidades
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">💒 Bem-casados</span>
              <Badge variant="secondary" className="bg-lavender-100 text-lavender-800">
                {summary.totalWeddings} unidades
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Horários de Retirada */}
        <Card className="bg-white/70 backdrop-blur border-sweet-200 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-800">
              <Clock className="w-5 h-5" />
              Horários de Retirada
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary.pickupTimes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum horário agendado
              </p>
            ) : (
              <div className="space-y-3">
                {summary.pickupTimes.map((pickup, index) => (
                  <div key={index} className="border-l-2 border-sweet-300 pl-3">
                    <div className="font-medium text-sweet-800">
                      {pickup.time}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pickup.customer}
                    </div>
                    <div className="text-sm text-sweet-600">
                      {pickup.details}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo Geral */}
      <Card className="bg-gradient-to-r from-sweet-50 to-pink-50 border-sweet-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-sweet-800 mb-2">
              Resumo Geral do Dia
            </h3>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <Badge variant="outline" className="text-sweet-700 border-sweet-400 px-4 py-2">
                {summary.totalOrders} {summary.totalOrders === 1 ? 'pedido' : 'pedidos'} total
              </Badge>
              <Badge variant="outline" className="text-pink-700 border-pink-400 px-4 py-2">
                {Object.values(summary.cakesBySize).reduce((a, b) => a + b, 0)} bolos
              </Badge>
              <Badge variant="outline" className="text-lavender-700 border-lavender-400 px-4 py-2">
                {summary.totalSweets + summary.totalWeddings} doces/bem-casados
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
