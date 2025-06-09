import { useState, useEffect, useRef, useCallback } from 'react';

export interface Cake {
  id: string;
  type: 'cake';
  size: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'Bolo de Corte 70 fatias' | 'Bolo de Corte 100 fatias';
  flavor: string;
  filling: string;
  finishing: string;
  needsTopper: boolean;
  pickupTime: string;
  value: number;
  date: string;
  customerName: string;
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
  createdAt: string;
}

export type Order = Cake | Sweet | WeddingCandy;

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const isInitialized = useRef(false);
  const hasLoadedData = useRef(false);

  // Carregar dados APENAS na inicialização
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      
      try {
        const savedOrders = localStorage.getItem('confeitaria-orders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
            setOrders(parsedOrders);
            hasLoadedData.current = true;
          }
        }
      } catch (error) {
        console.error('❌ [useOrders] Erro ao carregar:', error);
      }
    }
  }, []);

  // Salvar dados APENAS quando há mudanças válidas
  useEffect(() => {
    // Só salva se:
    // 1. Já foi inicializado
    // 2. E (tem dados carregados OU há pedidos para salvar)
    if (isInitialized.current && (hasLoadedData.current || orders.length > 0)) {
      try {
        localStorage.setItem('confeitaria-orders', JSON.stringify(orders));
      } catch (error) {
        console.error('❌ [useOrders] Erro ao salvar:', error);
      }
    }
  }, [orders]);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder = {
      ...orderData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    } as Order;
    
    setOrders(prev => {
      const updated = [...prev, newOrder];
      hasLoadedData.current = true; // Marca que agora tem dados
      return updated;
    });
  }, []);

  const updateOrder = useCallback((id: string, updatedOrder: Partial<Order>) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, ...updatedOrder } as Order : order
      )
    );
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  }, []);

  const getOrdersByDate = useCallback((date: string) => {
    return orders.filter(order => order.date === date);
  }, [orders]);

  const getOrdersByMonth = useCallback((year: number, month: number) => {
    return orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.getFullYear() === year && orderDate.getMonth() === month;
    });
  }, [orders]);

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

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrdersByDate,
    getOrdersByMonth,
    getDailySummary,
    getMonthlySummary
  };
};
