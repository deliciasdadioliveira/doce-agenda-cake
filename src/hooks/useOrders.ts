import { useState, useEffect, useRef } from 'react';

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
  const isLoading = useRef(false);

  // Carregar dados APENAS na inicialização
  useEffect(() => {
    if (!isInitialized.current && !isLoading.current) {
      isLoading.current = true;
      console.log('🔄 [useOrders] Inicializando - carregando localStorage...');
      
      try {
        const savedOrders = localStorage.getItem('confeitaria-orders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          console.log('✅ [useOrders] Dados carregados:', parsedOrders.length, 'pedidos');
          console.log('📊 [useOrders] Detalhes:', parsedOrders);
          setOrders(parsedOrders);
        } else {
          console.log('ℹ️ [useOrders] Nenhum dado no localStorage');
          setOrders([]);
        }
      } catch (error) {
        console.error('❌ [useOrders] Erro ao carregar:', error);
        setOrders([]);
      }
      
      isInitialized.current = true;
      isLoading.current = false;
      console.log('✅ [useOrders] Inicialização concluída');
    }
  }, []);

  // Salvar dados APENAS após inicialização e quando há mudanças reais
  useEffect(() => {
    if (isInitialized.current && !isLoading.current) {
      console.log('💾 [useOrders] Salvando no localStorage:', orders.length, 'pedidos');
      console.log('📊 [useOrders] Dados a salvar:', orders);
      
      try {
        localStorage.setItem('confeitaria-orders', JSON.stringify(orders));
        console.log('✅ [useOrders] Dados salvos com sucesso');
        
        // Verificar se foi salvo corretamente
        const verification = localStorage.getItem('confeitaria-orders');
        const verificationData = verification ? JSON.parse(verification) : [];
        console.log('🔍 [useOrders] Verificação - dados salvos:', verificationData.length, 'pedidos');
      } catch (error) {
        console.error('❌ [useOrders] Erro ao salvar:', error);
      }
    }
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    console.log('➕ [useOrders] Adicionando novo pedido:', orderData);
    console.log('📊 [useOrders] Estado atual antes:', orders.length, 'pedidos');
    
    const newOrder = {
      ...orderData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    } as Order;
    
    console.log('🆕 [useOrders] Pedido criado:', newOrder);
    
    setOrders(prev => {
      console.log('📋 [useOrders] Estado anterior:', prev.length, 'pedidos');
      const updated = [...prev, newOrder];
      console.log('📋 [useOrders] Estado atualizado:', updated.length, 'pedidos');
      console.log('📊 [useOrders] Lista completa:', updated);
      return updated;
    });
  };

  const updateOrder = (id: string, updatedOrder: Partial<Order>) => {
    console.log('✏️ [useOrders] Atualizando pedido:', id, updatedOrder);
    
    setOrders(prev => {
      const updated = prev.map(order => 
        order.id === id ? { ...order, ...updatedOrder } as Order : order
      );
      console.log('📋 [useOrders] Lista após atualização:', updated.length, 'pedidos');
      return updated;
    });
  };

  const deleteOrder = (id: string) => {
    console.log('🗑️ [useOrders] Removendo pedido:', id);
    
    setOrders(prev => {
      const updated = prev.filter(order => order.id !== id);
      console.log('📋 [useOrders] Lista após remoção:', updated.length, 'pedidos');
      return updated;
    });
  };

  const getOrdersByDate = (date: string) => {
    const filtered = orders.filter(order => order.date === date);
    console.log(`📅 [useOrders] getOrdersByDate(${date}):`, filtered.length, 'pedidos');
    console.log('🔍 [useOrders] Total de pedidos no sistema:', orders.length);
    return filtered;
  };

  const getOrdersByMonth = (year: number, month: number) => {
    return orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.getFullYear() === year && orderDate.getMonth() === month;
    });
  };

  const getDailySummary = (date: string) => {
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
  };

  const getMonthlySummary = (year: number, month: number) => {
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
  };

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
