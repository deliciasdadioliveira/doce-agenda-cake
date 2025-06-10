import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, TrendingUp } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PeriodSummaryProps {
  startDate: string;
  endDate: string;
  title: string;
}

export const PeriodSummary = ({ startDate, endDate, title }: PeriodSummaryProps) => {
  const { getPeriodSummary } = useOrders();
  
  // Usar useMemo para garantir que o summary seja recalculado quando necessário
  const summary = useMemo(() => getPeriodSummary(startDate, endDate), [getPeriodSummary, startDate, endDate]);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatDateLong = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">
          📊 {title}
        </h2>
        <p className="text-muted-foreground">
          {formatDate(startDate)} - {formatDate(endDate)}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Resumo Geral */}
        <Card className="bg-gradient-to-r from-sweet-50 to-pink-50 border-sweet-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-800">
              <TrendingUp className="w-5 h-5" />
              Resumo Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total de Pedidos</span>
                <Badge variant="secondary" className="bg-sweet-100 text-sweet-800">
                  {summary.totalOrders}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Valor Total</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  R$ {summary.totalValue.toFixed(2)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

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
                Nenhum bolo no período
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

        {/* Resumo por Data */}
        <Card className="bg-white/70 backdrop-blur border-sweet-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-800">
              <Calendar className="w-5 h-5" />
              Dias com Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary.dailyBreakdown.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum pedido no período
              </p>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {summary.dailyBreakdown.map((day) => (
                  <div key={day.date} className="text-sm">
                    <div className="font-medium text-sweet-800">
                      {formatDateLong(day.date)}
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{day.totalOrders} pedidos</span>
                      <span>R$ {day.totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento por Dia */}
      {summary.dailyBreakdown.length > 0 && (
        <Card className="bg-white/70 backdrop-blur border-sweet-200">
          <CardHeader>
            <CardTitle className="text-sweet-800">
              📅 Detalhamento por Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {summary.dailyBreakdown.map((day) => (
                <Card key={day.date} className="border-sweet-100">
                  <CardContent className="p-4">
                    <div className="font-medium text-sweet-800 mb-2">
                      {formatDateLong(day.date)}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Pedidos:</span>
                        <span className="font-medium">{day.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bolos:</span>
                        <span className="font-medium">{day.cakes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Doces:</span>
                        <span className="font-medium">{day.sweets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bem-casados:</span>
                        <span className="font-medium">{day.weddings}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-green-700 border-t pt-1">
                        <span>Total:</span>
                        <span>R$ {day.totalValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 