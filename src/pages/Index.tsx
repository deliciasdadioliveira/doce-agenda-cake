import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar as CalendarIcon, TrendingUp, LogOut } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { AddOrderModal } from '@/components/AddOrderModal';
import { OrderCard } from '@/components/OrderCard';
import { DailySummary } from '@/components/DailySummary';
import { MonthlySummary } from '@/components/MonthlySummary';
import { LoginForm } from '@/components/LoginForm';

const Index = () => {
  // TODOS os hooks devem estar aqui no topo
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { orders, getOrdersByDate, getDailySummary } = useOrders();
  const { user, logout, loading } = useAuth();

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const [dayOrders, setDayOrders] = useState(getOrdersByDate(selectedDateString));
  const [dailySummary, setDailySummary] = useState(getDailySummary(selectedDateString));

  // useEffect também deve estar no topo
  useEffect(() => {
    setDayOrders(getOrdersByDate(selectedDateString));
    setDailySummary(getDailySummary(selectedDateString));
  }, [orders, selectedDateString, getOrdersByDate, getDailySummary]);

  // Função helper também no topo
  const hasOrdersOnDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return getOrdersByDate(dateString).length > 0;
  };

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
            <Button 
              onClick={logout}
              variant="outline"
              size="sm"
              className="ml-auto flex-shrink-0"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
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

          <TabsContent value="daily">
            <DailySummary date={format(new Date(), 'yyyy-MM-dd')} />
          </TabsContent>

          <TabsContent value="monthly">
            <MonthlySummary 
              year={selectedDate.getFullYear()} 
              month={selectedDate.getMonth()} 
            />
          </TabsContent>
        </Tabs>

        <AddOrderModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          defaultDate={selectedDateString}
        />
      </div>
    </div>
  );
};

export default Index;
