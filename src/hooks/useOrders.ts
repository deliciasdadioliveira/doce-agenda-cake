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
  const hasLoadedFromStorage = useRef(false);

  // Carregar dados do localStorage apenas uma vez na inicialização
  useEffect(() => {
    if (!hasLoadedFromStorage.current) {
      try {
        const savedOrders = localStorage.getItem('confeitaria-orders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          setOrders(parsedOrders);
          console.log('Pedidos carregados do localStorage:', parsedOrders);
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      }
      hasLoadedFromStorage.current = true;
    }
  }, []);

  // Salvar dados no localStorage apenas após carregar os dados iniciais
  useEffect(() => {
    if (hasLoadedFromStorage.current) {
      try {
        localStorage.setItem('confeitaria-orders', JSON.stringify(orders));
        console.log('Pedidos salvos no localStorage:', orders);
      } catch (error) {
        console.error('Erro ao salvar pedidos:', error);
      }
    }
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    setOrders(prev => {
      const updated = [...prev, newOrder];
      console.log('Adicionando pedido:', newOrder);
      console.log('Lista atualizada:', updated);
      return updated;
    });
  };

  const updateOrder = (id: string, updatedOrder: Partial<Order>) => {
    setOrders(prev => {
      const updated = prev.map(order => 
        order.id === id ? { ...order, ...updatedOrder } : order
      );
      console.log('Atualizando pedido:', id, updatedOrder);
      console.log('Lista atualizada:', updated);
      return updated;
    });
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => {
      const updated = prev.filter(order => order.id !== id);
      console.log('Removendo pedido:', id);
      console.log('Lista atualizada:', updated);
      return updated;
    });
  };

  const getOrdersByDate = (date: string) => {
    console.log('getOrdersByDate called with:', date);
    console.log('All orders:', orders);
    const filtered = orders.filter(order => {
      console.log(`Comparing order date "${order.date}" with "${date}"`);
      return order.date === date;
    });
    console.log('Filtered orders:', filtered);
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
