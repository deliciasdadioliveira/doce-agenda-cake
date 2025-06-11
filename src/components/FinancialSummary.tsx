import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Package, Calendar, CalendarDays } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useOrders } from '@/hooks/useOrders';

export const FinancialSummary = () => {
  const { getPeriodSummary, lastUpdateTimestamp } = useOrders();
  
  // Estados para controle de período
  const [viewMode, setViewMode] = useState<'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [showResults, setShowResults] = useState<boolean>(true);

  // Calcular resumo baseado no período selecionado
  const summary = useMemo(() => {
    if (viewMode === 'month') {
      // Para o modo mês, usar o período dos últimos 30 dias
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);
      return getPeriodSummary(
        format(thirtyDaysAgo, 'yyyy-MM-dd'),
        format(today, 'yyyy-MM-dd')
      );
    } else if (showResults) {
      // Para período customizado, usar as datas selecionadas
      return getPeriodSummary(startDate, endDate);
    }
    return null;
  }, [getPeriodSummary, viewMode, startDate, endDate, showResults, lastUpdateTimestamp]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPeriodTitle = () => {
    if (viewMode === 'month') {
      return 'Últimos 30 Dias';
    } else if (showResults) {
      return `Período de ${format(new Date(startDate), "dd/MM/yyyy")} a ${format(new Date(endDate), "dd/MM/yyyy")}`;
    }
    return 'Selecione um Período';
  };

  if (!summary) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gradient mb-2">
            💰 Análise Financeira
          </h2>
          <p className="text-muted-foreground">
            Gestão de Faturamento com Períodos Personalizados
          </p>
        </div>

        {/* Controles de Período */}
        <Card className="bg-white/70 backdrop-blur border-sweet-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-800">
              <CalendarDays className="w-5 h-5" />
              Selecionar Período de Análise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                onClick={() => {
                  setViewMode('month');
                  setShowResults(true);
                }}
                className={viewMode === 'month' ? 'bg-sweet-600 hover:bg-sweet-700' : ''}
              >
                📅 Últimos 30 Dias
              </Button>
              <Button
                variant={viewMode === 'custom' ? 'default' : 'outline'}
                onClick={() => {
                  setViewMode('custom');
                  setShowResults(false);
                }}
                className={viewMode === 'custom' ? 'bg-sweet-600 hover:bg-sweet-700' : ''}
              >
                📊 Período Personalizado
              </Button>
            </div>

            {viewMode === 'custom' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Data Inicial:</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setShowResults(false);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Data Final:</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setShowResults(false);
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        setStartDate(format(subDays(today, 7), 'yyyy-MM-dd'));
                        setEndDate(format(today, 'yyyy-MM-dd'));
                        setShowResults(false);
                      }}
                    >
                      Últimos 7 dias
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        setStartDate(format(subDays(today, 30), 'yyyy-MM-dd'));
                        setEndDate(format(today, 'yyyy-MM-dd'));
                        setShowResults(false);
                      }}
                    >
                      Últimos 30 dias
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                        setStartDate(format(firstDayOfMonth, 'yyyy-MM-dd'));
                        setEndDate(format(today, 'yyyy-MM-dd'));
                        setShowResults(false);
                      }}
                    >
                      Este mês
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => setShowResults(true)}
                    className="bg-sweet-600 hover:bg-sweet-700 text-white"
                    disabled={!startDate || !endDate}
                    size="sm"
                  >
                    🔍 Analisar Período
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Configure o período para análise
            </h3>
            <p className="text-gray-600">
              Selecione um período acima para visualizar o relatório financeiro
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">
          💰 Análise Financeira
        </h2>
        <p className="text-muted-foreground">
          {getPeriodTitle()}
        </p>
      </div>

      {/* Controles de Período */}
      <Card className="bg-white/70 backdrop-blur border-sweet-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sweet-800">
            <CalendarDays className="w-5 h-5" />
            Selecionar Período de Análise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              onClick={() => {
                setViewMode('month');
                setShowResults(true);
              }}
              className={viewMode === 'month' ? 'bg-sweet-600 hover:bg-sweet-700' : ''}
            >
              📅 Últimos 30 Dias
            </Button>
            <Button
              variant={viewMode === 'custom' ? 'default' : 'outline'}
              onClick={() => {
                setViewMode('custom');
                setShowResults(false);
              }}
              className={viewMode === 'custom' ? 'bg-sweet-600 hover:bg-sweet-700' : ''}
            >
              📊 Período Personalizado
            </Button>
          </div>

          {viewMode === 'custom' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Data Inicial:</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setShowResults(false);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Data Final:</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setShowResults(false);
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      setStartDate(format(subDays(today, 7), 'yyyy-MM-dd'));
                      setEndDate(format(today, 'yyyy-MM-dd'));
                      setShowResults(false);
                    }}
                  >
                    Últimos 7 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      setStartDate(format(subDays(today, 30), 'yyyy-MM-dd'));
                      setEndDate(format(today, 'yyyy-MM-dd'));
                      setShowResults(false);
                    }}
                  >
                    Últimos 30 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                      setStartDate(format(firstDayOfMonth, 'yyyy-MM-dd'));
                      setEndDate(format(today, 'yyyy-MM-dd'));
                      setShowResults(false);
                    }}
                  >
                    Este mês
                  </Button>
                </div>
                
                <Button
                  onClick={() => setShowResults(true)}
                  className="bg-sweet-600 hover:bg-sweet-700 text-white"
                  disabled={!startDate || !endDate}
                  size="sm"
                >
                  🔍 Analisar Período
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cards de Resumo Financeiro */}
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
              Total do período
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
              {Object.values(summary.cakesBySize).reduce((sum, count) => sum + count, 0)}
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
                {Object.values(summary.cakesBySize).reduce((sum, count) => sum + count, 0)} unidades
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
                    ? ((Object.values(summary.cakesBySize).reduce((sum, count) => sum + count, 0) + summary.totalSweets + summary.totalWeddings) / summary.totalOrders).toFixed(1)
                    : '0'
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor médio por bolo</span>
                <span className="font-medium">
                  {Object.values(summary.cakesBySize).reduce((sum, count) => sum + count, 0) > 0 
                    ? formatCurrency(summary.totalValue / Object.values(summary.cakesBySize).reduce((sum, count) => sum + count, 0))
                    : formatCurrency(0)
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quebra Diária */}
      {summary.dailyBreakdown && summary.dailyBreakdown.length > 0 && (
        <Card className="bg-white/70 backdrop-blur border-sweet-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sweet-800">
              📊 Quebra Diária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {summary.dailyBreakdown.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {format(new Date(day.date), "dd 'de' MMMM", { locale: ptBR })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {day.totalOrders} {day.totalOrders === 1 ? 'pedido' : 'pedidos'} • 
                      {day.cakes > 0 && ` ${day.cakes} ${day.cakes === 1 ? 'bolo' : 'bolos'}`}
                      {day.sweets > 0 && ` • ${day.sweets} doces`}
                      {day.weddings > 0 && ` • ${day.weddings} bem-casados`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-700">
                      {formatCurrency(day.totalValue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {summary.totalOrders === 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nenhum pedido registrado
            </h3>
            <p className="text-gray-600">
              Não há pedidos para o período selecionado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};