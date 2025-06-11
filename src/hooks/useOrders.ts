import { useState, useEffect, useCallback } from 'react';
import { firebaseOrdersService } from '@/services/firebaseOrders';

export interface Cake {
  id: string;
  type: 'cake';
  size: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'Bolo de Corte 70 fatias' | 'Bolo de Corte 100 fatias' | 'Bolo de Andar' | 'Bolo de Cenoura' | 'Torta Salgada';
  flavor: string;
  filling: string;
  finishing: string;
  needsTopper: boolean;
  pickupTime: string;
  value: number;
  date: string;
  customerName: string;
  observations?: string;
  createdAt: string;
}

export interface Sweet {
  id: string;
  type: 'sweet';
  sweetType: string;
  quantity: number;
  flavor: string;
  value: number;
  date: string;
  customerName: string;
  observations?: string;
  createdAt: string;
}

export interface WeddingCandy {
  id: string;
  type: 'wedding';
  quantity: number;
  flavor: string;
  value: number;
  date: string;
  customerName: string;
  observations?: string;
  createdAt: string;
}

export type Order = Cake | Sweet | WeddingCandy;

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<number>(Date.now());

  // Carregar pedidos do Firebase na inicialização
  useEffect(() => {
    let isMounted = true;
    
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔥 [Firebase Hook] Carregando pedidos do Firebase...');
        const fetchedOrders = await firebaseOrdersService.getAllOrders();
        
        if (isMounted) {
          setOrders(fetchedOrders);
          setLastUpdateTimestamp(Date.now());
          console.log(`✅ [Firebase Hook] ${fetchedOrders.length} pedidos carregados`);
        }
      } catch (err) {
        console.error('❌ [Firebase Hook] Erro ao carregar pedidos:', err);
        if (isMounted) {
          setError('Erro ao carregar pedidos. Tente novamente.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Adicionar pedido
  const addOrder = useCallback(async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      
      // Deixar o Firebase gerar o ID automaticamente
      const firebaseId = await firebaseOrdersService.addOrder(orderData);
      
      // Criar objeto com ID do Firebase
      const newOrder = {
        ...orderData,
        id: firebaseId,
        createdAt: new Date().toISOString()
      } as Order;
      
      // Atualizar estado local
      setOrders(prev => {
        const newState = [...prev, newOrder];
        console.log('🔄 [Firebase Hook] Estado local atualizado. Total de pedidos:', newState.length);
        return newState;
      });
      const newTimestamp = Date.now();
      setLastUpdateTimestamp(newTimestamp);
      
      console.log('✅ [Firebase Hook] Pedido adicionado:', newOrder.id, 'Timestamp:', newTimestamp);
    } catch (err) {
      console.error('❌ [Firebase Hook] Erro ao adicionar pedido:', err);
      setError('Erro ao adicionar pedido. Tente novamente.');
      throw err;
    }
  }, []);

  // Atualizar pedido
  const updateOrder = useCallback(async (id: string, updatedOrder: Partial<Order>) => {
    try {
      setError(null);
      await firebaseOrdersService.updateOrder(id, updatedOrder);
      
      // Atualizar estado local
      setOrders(prev => 
        prev.map(order => 
          order.id === id ? { ...order, ...updatedOrder } as Order : order
        )
      );
      setLastUpdateTimestamp(Date.now());
      
      console.log('✅ [Firebase Hook] Pedido atualizado:', id);
    } catch (err) {
      console.error('❌ [Firebase Hook] Erro ao atualizar pedido:', err);
      setError('Erro ao atualizar pedido. Tente novamente.');
      throw err;
    }
  }, []);

  // Excluir pedido
  const deleteOrder = useCallback(async (id: string) => {
    try {
      setError(null);
      await firebaseOrdersService.deleteOrder(id);
      
      // Atualizar estado local
      setOrders(prev => prev.filter(order => order.id !== id));
      setLastUpdateTimestamp(Date.now());
      
      console.log('✅ [Firebase Hook] Pedido excluído:', id);
    } catch (err) {
      console.error('❌ [Firebase Hook] Erro ao excluir pedido:', err);
      setError('Erro ao excluir pedido. Tente novamente.');
      throw err;
    }
  }, []);

  // Buscar pedidos por data
  const getOrdersByDate = useCallback((date: string) => {
    return orders.filter(order => order.date === date);
  }, [orders]);

  // Buscar pedidos por período
  const getOrdersByDateRange = useCallback((startDate: string, endDate: string) => {
    // Normalizar datas para formato YYYY-MM-DD
    const normalizeDate = (dateStr: string) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      try {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch {
        return dateStr;
      }
    };
    
    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);
    
    const filteredOrders = orders.filter(order => {
      const normalizedOrderDate = normalizeDate(order.date);
      return normalizedOrderDate >= normalizedStartDate && normalizedOrderDate <= normalizedEndDate;
    });
    
    return filteredOrders;
  }, [orders]);

  // Buscar pedidos por mês
  const getOrdersByMonth = useCallback((year: number, month: number) => {
    return orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.getFullYear() === year && orderDate.getMonth() === month;
    });
  }, [orders]);

  // Resumo diário
  const getDailySummary = useCallback((date: string) => {
    const dayOrders = getOrdersByDate(date);
    
    const cakes = dayOrders.filter(order => order.type === 'cake') as Cake[];
    const sweets = dayOrders.filter(order => order.type === 'sweet') as Sweet[];
    const weddings = dayOrders.filter(order => order.type === 'wedding') as WeddingCandy[];

    const cakesBySize = cakes.reduce((acc, cake) => {
      acc[cake.size] = (acc[cake.size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalSweets = sweets.reduce((sum, sweet) => sum + sweet.quantity, 0);
    const totalWeddings = weddings.reduce((sum, wedding) => sum + wedding.quantity, 0);

    const pickupTimes = cakes
      .filter(cake => cake.pickupTime)
      .map(cake => ({
        time: cake.pickupTime,
        customer: cake.customerName,
        details: `Bolo ${cake.size} - ${cake.flavor}`
      }))
      .sort((a, b) => a.time.localeCompare(b.time));

    return {
      cakesBySize,
      totalSweets,
      totalWeddings,
      pickupTimes,
      totalOrders: dayOrders.length
    };
  }, [getOrdersByDate]);

  // Resumo de período
  const getPeriodSummary = useCallback((startDate: string, endDate: string) => {
    const periodOrders = getOrdersByDateRange(startDate, endDate);
    
    const cakes = periodOrders.filter(order => order.type === 'cake') as Cake[];
    const sweets = periodOrders.filter(order => order.type === 'sweet') as Sweet[];
    const weddings = periodOrders.filter(order => order.type === 'wedding') as WeddingCandy[];

    const cakesBySize = cakes.reduce((acc, cake) => {
      acc[cake.size] = (acc[cake.size] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalSweets = sweets.reduce((sum, sweet) => sum + sweet.quantity, 0);
    const totalWeddings = weddings.reduce((sum, wedding) => sum + wedding.quantity, 0);
    const totalValue = periodOrders.reduce((sum, order) => sum + order.value, 0);

    // Agrupar pedidos por data
    const ordersByDate = periodOrders.reduce((acc, order) => {
      if (!acc[order.date]) {
        acc[order.date] = [];
      }
      acc[order.date].push(order);
      return acc;
    }, {} as Record<string, Order[]>);

    const dailyBreakdown = Object.entries(ordersByDate).map(([date, dayOrders]) => ({
      date,
      totalOrders: dayOrders.length,
      totalValue: dayOrders.reduce((sum, order) => sum + order.value, 0),
      cakes: dayOrders.filter(order => order.type === 'cake').length,
      sweets: dayOrders.filter(order => order.type === 'sweet').reduce((sum, order) => sum + (order as Sweet).quantity, 0),
      weddings: dayOrders.filter(order => order.type === 'wedding').reduce((sum, order) => sum + (order as WeddingCandy).quantity, 0)
    })).sort((a, b) => a.date.localeCompare(b.date));

    return {
      cakesBySize,
      totalSweets,
      totalWeddings,
      totalValue,
      totalOrders: periodOrders.length,
      dailyBreakdown
    };
  }, [getOrdersByDateRange]);

  // Resumo mensal
  const getMonthlySummary = useCallback((year: number, month: number) => {
    const monthOrders = getOrdersByMonth(year, month);
    
    const totalValue = monthOrders.reduce((sum, order) => sum + order.value, 0);
    const totalCakes = monthOrders.filter(order => order.type === 'cake').length;
    const totalSweets = monthOrders.filter(order => order.type === 'sweet').reduce((sum, order) => sum + (order as Sweet).quantity, 0);
    const totalWeddings = monthOrders.filter(order => order.type === 'wedding').reduce((sum, order) => sum + (order as WeddingCandy).quantity, 0);

    return {
      totalValue,
      totalCakes,
      totalSweets,
      totalWeddings,
      totalOrders: monthOrders.length
    };
  }, [getOrdersByMonth]);

  // Função para recarregar dados do servidor
  const refreshOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedOrders = await firebaseOrdersService.getAllOrders();
      setOrders(fetchedOrders);
      setLastUpdateTimestamp(Date.now());
      console.log('🔄 [Firebase Hook] Dados atualizados do servidor');
    } catch (err) {
      console.error('❌ [Firebase Hook] Erro ao atualizar dados:', err);
      setError('Erro ao atualizar dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    loading,
    error,
    lastUpdateTimestamp,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrdersByDate,
    getOrdersByDateRange,
    getOrdersByMonth,
    getDailySummary,
    getPeriodSummary,
    getMonthlySummary,
    refreshOrders
  };
}; 