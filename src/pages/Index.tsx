import { useState, useEffect, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Calendar as CalendarIcon, TrendingUp, LogOut, CalendarDays } from 'lucide-react';
import { format, parseISO, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { AddOrderModal } from '@/components/AddOrderModal';
import { OrderCard } from '@/components/OrderCard';
import { PeriodSummary } from '@/components/PeriodSummary';
import { MonthlySummary } from '@/components/MonthlySummary';
import { FinancialSummary } from '@/components/FinancialSummary';
import { LoginForm } from '@/components/LoginForm';

const Index = () => {
  // TODOS os hooks devem estar aqui no topo
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'today' | 'single' | 'period'>('today');
  const [customDate, setCustomDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [showPeriodResults, setShowPeriodResults] = useState<boolean>(false);

  const { orders, getOrdersByDate, getDailySummary, refreshOrders, lastUpdateTimestamp } = useOrders();
  const { user, logout, loading } = useAuth();





  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const todayString = format(new Date(), 'yyyy-MM-dd');



  // Calcular os pedidos diretamente sem useState separado
  const dayOrders = useMemo(() => {
    const orders = getOrdersByDate(selectedDateString);
    console.log('🔄 [Index] Recalculando dayOrders para', selectedDateString, '- Encontrados:', orders.length, 'pedidos. Timestamp:', lastUpdateTimestamp);
    return orders;
  }, [getOrdersByDate, selectedDateString, lastUpdateTimestamp]);
  
  const dailySummary = useMemo(() => {
    const summary = getDailySummary(selectedDateString);
    console.log('🔄 [Index] Recalculando dailySummary para', selectedDateString, '- Total orders:', summary.totalOrders);
    return summary;
  }, [getDailySummary, selectedDateString, lastUpdateTimestamp]);

  // Função helper otimizada com useMemo
  const hasOrdersOnDate = useMemo(() => {
    const datesWithOrders = new Set(orders.map(order => order.date));
    return (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      return datesWithOrders.has(dateString);
    };
  }, [orders, lastUpdateTimestamp]);

  // AGORA sim podemos ter returns condicionais
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sweet-50 to-lavender-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sweet-300 border-t-sweet-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sweet-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user?.isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sweet-50 to-lavender-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-lavender-100 flex items-center justify-center overflow-hidden border-4 border-sweet-200 shadow-lg flex-shrink-0">
              <img 
                src="/lovable-uploads/62298848-6d22-47d7-abd3-f08b363a1bcf.png" 
                alt="Delícias da Di" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gradient">
                Delícias da Di
              </h1>
              <p className="text-muted-foreground text-lg">
                Gestão de Encomendas
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  logout();
                  // Auto-refresh após logout
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center gap-2">
              📋 Hoje
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Mensal
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              💰 Faturamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-1 bg-white/70 backdrop-blur border-sweet-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      📅 Calendário
                    </span>
                    <Button 
                      onClick={() => setIsAddModalOpen(true)}
                      size="sm"
                      className="bg-gradient-to-r from-pink-400 to-lavender-400 hover:from-pink-500 hover:to-lavender-500 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    locale={ptBR}
                    className="rounded-md border-0"
                    modifiers={{
                      hasOrders: hasOrdersOnDate,
                    }}
                    modifiersStyles={{
                      hasOrders: {
                        backgroundColor: '#f4d3c7',
                        color: '#d66850',
                        fontWeight: 'bold',
                      },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Orders for selected date */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-white/70 backdrop-blur border-sweet-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        📋 Pedidos de {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                      <Badge variant="secondary" className="bg-sweet-100 text-sweet-800">
                        {dayOrders.length} pedidos
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dayOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="text-6xl mb-4">🍰</div>
                        <p>Nenhum pedido para esta data</p>
                        <Button 
                          onClick={() => setIsAddModalOpen(true)}
                          className="mt-4 bg-gradient-to-r from-pink-400 to-lavender-400 hover:from-pink-500 hover:to-lavender-500 text-white"
                        >
                          Adicionar primeiro pedido
                        </Button>
                      </div>
                    ) : (
                      dayOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            {/* Controles de Seleção */}
            <Card className="bg-white/70 backdrop-blur border-sweet-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sweet-800">
                  <CalendarDays className="w-5 h-5" />
                  Selecionar Período de Análise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant={viewMode === 'today' ? 'default' : 'outline'}
                    onClick={() => {
                      setViewMode('today');
                      setShowPeriodResults(false);
                    }}
                    className={viewMode === 'today' ? 'bg-sweet-600 hover:bg-sweet-700' : ''}
                  >
                    📅 Hoje
                  </Button>
                  <Button
                    variant={viewMode === 'single' ? 'default' : 'outline'}
                    onClick={() => {
                      setViewMode('single');
                      setShowPeriodResults(false);
                    }}
                    className={viewMode === 'single' ? 'bg-sweet-600 hover:bg-sweet-700' : ''}
                  >
                    📆 Data Específica
                  </Button>
                  <Button
                    variant={viewMode === 'period' ? 'default' : 'outline'}
                    onClick={() => {
                      setViewMode('period');
                      setShowPeriodResults(false);
                    }}
                    className={viewMode === 'period' ? 'bg-sweet-600 hover:bg-sweet-700' : ''}
                  >
                    📊 Período
                  </Button>
                </div>

                {viewMode === 'single' && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-date">Selecionar Data:</Label>
                    <Input
                      id="custom-date"
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full md:w-auto"
                    />
                  </div>
                )}

                {viewMode === 'period' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Data Inicial:</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setShowPeriodResults(false);
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
                          setShowPeriodResults(false);
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex gap-2 flex-wrap items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const today = new Date();
                              setStartDate(format(subDays(today, 7), 'yyyy-MM-dd'));
                              setEndDate(format(today, 'yyyy-MM-dd'));
                              setShowPeriodResults(false);
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
                              setShowPeriodResults(false);
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
                              setShowPeriodResults(false);
                            }}
                          >
                            Este mês
                          </Button>
                        </div>
                        
                        <Button
                          onClick={() => {
                            console.log('🔍 [Index] Botão Buscar clicado:', { startDate, endDate });
                            // Ativa a exibição dos resultados do período
                            setShowPeriodResults(true);
                          }}
                          className="bg-sweet-600 hover:bg-sweet-700 text-white"
                          disabled={!startDate || !endDate}
                          size="sm"
                        >
                          🔍 Buscar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Renderizar o Resumo baseado no viewMode */}
            {viewMode === 'today' && (
              <div>
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gradient mb-2">
                      📋 Resumo do Dia
                    </h2>
                    <p className="text-muted-foreground">
                      {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cards do resumo diário - versão simplificada inline */}
                    <Card className="bg-white/70 backdrop-blur border-sweet-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sweet-800">
                          🎂 Bolos de Hoje
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Object.keys(getDailySummary(todayString).cakesBySize).length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">
                            Nenhum bolo para hoje
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {Object.entries(getDailySummary(todayString).cakesBySize).map(([size, count]) => (
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

                    <Card className="bg-white/70 backdrop-blur border-sweet-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sweet-800">
                          🍭 Doces & Bem-casados
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Doces de festa</span>
                          <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                            {getDailySummary(todayString).totalSweets} unidades
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Bem-casados</span>
                          <Badge variant="secondary" className="bg-lavender-100 text-lavender-800">
                            {getDailySummary(todayString).totalWeddings} unidades
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-sweet-50 to-pink-50 border-sweet-200">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-sweet-800 mb-2">
                            Total de Hoje
                          </h3>
                          <Badge variant="outline" className="text-sweet-700 border-sweet-400 px-4 py-2">
                            {getDailySummary(todayString).totalOrders} {getDailySummary(todayString).totalOrders === 1 ? 'pedido' : 'pedidos'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'single' && (
              <div>
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gradient mb-2">
                      📋 Resumo do Dia
                    </h2>
                    <p className="text-muted-foreground">
                      {format(parseISO(customDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-white/70 backdrop-blur border-sweet-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sweet-800">
                          🎂 Bolos do Dia
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Object.keys(getDailySummary(customDate).cakesBySize).length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">
                            Nenhum bolo para esta data
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {Object.entries(getDailySummary(customDate).cakesBySize).map(([size, count]) => (
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

                    <Card className="bg-white/70 backdrop-blur border-sweet-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sweet-800">
                          🍭 Doces & Bem-casados
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Doces de festa</span>
                          <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                            {getDailySummary(customDate).totalSweets} unidades
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Bem-casados</span>
                          <Badge variant="secondary" className="bg-lavender-100 text-lavender-800">
                            {getDailySummary(customDate).totalWeddings} unidades
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-sweet-50 to-pink-50 border-sweet-200">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-sweet-800 mb-2">
                            Total do Dia
                          </h3>
                          <Badge variant="outline" className="text-sweet-700 border-sweet-400 px-4 py-2">
                            {getDailySummary(customDate).totalOrders} {getDailySummary(customDate).totalOrders === 1 ? 'pedido' : 'pedidos'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'period' && showPeriodResults && (
              <PeriodSummary 
                startDate={startDate}
                endDate={endDate}
                title={`Resumo do Período`}
              />
            )}
          </TabsContent>

          <TabsContent value="monthly">
            <MonthlySummary 
              year={selectedDate.getFullYear()} 
              month={selectedDate.getMonth()} 
            />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialSummary />
          </TabsContent>
        </Tabs>

        <AddOrderModal 
          isOpen={isAddModalOpen} 
          onClose={() => {
            console.log('🔄 [Index] Fechando modal de adicionar pedido');
            setIsAddModalOpen(false);
            console.log('✅ [Index] Modal fechado');
          }}
          defaultDate={selectedDateString}
        />
      </div>
    </div>
  );
};

export default Index;
