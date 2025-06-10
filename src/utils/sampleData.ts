import { Order } from '@/hooks/useOrders';
import { format, addDays, subDays } from 'date-fns';

// Gerar dados de exemplo para diferentes datas
export const sampleOrders: Order[] = [
  // Pedidos de hoje
  {
    id: 'sample-1',
    type: 'cake',
    size: 'P',
    flavor: 'Chocolate',
    filling: 'Brigadeiro',
    finishing: 'Chocolate com granulado',
    needsTopper: true,
    pickupTime: '21:00',
    value: 45.00,
    date: format(new Date(), 'yyyy-MM-dd'),
    customerName: 'Débora',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-2',
    type: 'sweet',
    sweetType: 'Brigadeiro',
    quantity: 50,
    flavor: 'Tradicional',
    value: 25.00,
    date: format(new Date(), 'yyyy-MM-dd'),
    customerName: 'Maria Silva',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-3',
    type: 'wedding',
    quantity: 100,
    flavor: 'Doce de Leite',
    value: 80.00,
    date: format(new Date(), 'yyyy-MM-dd'),
    customerName: 'João e Ana',
    createdAt: new Date().toISOString()
  },
  
  // PEDIDOS ESPECÍFICOS PARA JUNHO 2025 - PARA TESTAR PERÍODOS
  {
    id: 'sample-june-1',
    type: 'cake',
    size: 'M',
    flavor: 'Morango',
    filling: 'Creme de morango',
    finishing: 'Chantilly com morangos',
    needsTopper: false,
    pickupTime: '18:00',
    value: 65.00,
    date: '2025-06-05', // 5 de junho de 2025
    customerName: 'Festa da Maria',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-june-2',
    type: 'sweet',
    sweetType: 'Beijinho',
    quantity: 30,
    flavor: 'Coco',
    value: 18.00,
    date: '2025-06-10', // 10 de junho de 2025
    customerName: 'Aniversário João',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-june-3',
    type: 'cake',
    size: 'G',
    flavor: 'Chocolate',
    filling: 'Brigadeiro',
    finishing: 'Ganache',
    needsTopper: true,
    pickupTime: '15:30',
    value: 85.00,
    date: '2025-06-15', // 15 de junho de 2025
    customerName: 'Festa Corporativa',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-june-4',
    type: 'wedding',
    quantity: 150,
    flavor: 'Brigadeiro',
    value: 120.00,
    date: '2025-06-20', // 20 de junho de 2025
    customerName: 'Casamento Ana & Pedro',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-june-5',
    type: 'cake',
    size: 'GG',
    flavor: 'Red Velvet',
    filling: 'Cream cheese',
    finishing: 'Pasta americana',
    needsTopper: false,
    pickupTime: '19:00',
    value: 95.00,
    date: '2025-06-25', // 25 de junho de 2025
    customerName: 'Festa de Formatura',
    createdAt: new Date().toISOString()
  },
  
  // Pedidos de ontem (relativos)
  {
    id: 'sample-4',
    type: 'cake',
    size: 'M',
    flavor: 'Morango',
    filling: 'Creme de morango',
    finishing: 'Chantilly com morangos',
    needsTopper: false,
    pickupTime: '18:00',
    value: 65.00,
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    customerName: 'Carlos',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-5',
    type: 'cake',
    size: 'G',
    flavor: 'Baunilha',
    filling: 'Brigadeiro branco',
    finishing: 'Pasta americana rosa',
    needsTopper: true,
    pickupTime: '15:30',
    value: 85.00,
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    customerName: 'Festa da Lúcia',
    createdAt: new Date().toISOString()
  },
  
  // Pedidos de 2 dias atrás
  {
    id: 'sample-6',
    type: 'sweet',
    sweetType: 'Beijinho',
    quantity: 30,
    flavor: 'Coco',
    value: 18.00,
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    customerName: 'Festa Infantil',
    createdAt: new Date().toISOString()
  },
  
  // Pedidos de amanhã
  {
    id: 'sample-7',
    type: 'cake',
    size: 'Bolo de Corte 70 fatias',
    flavor: 'Chocolate',
    filling: 'Mousse de chocolate',
    finishing: 'Ganache',
    needsTopper: false,
    pickupTime: '19:00',
    value: 120.00,
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    customerName: 'Casamento Silva',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-8',
    type: 'wedding',
    quantity: 200,
    flavor: 'Brigadeiro',
    value: 150.00,
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    customerName: 'Casamento Silva',
    createdAt: new Date().toISOString()
  },
  
  // Pedidos de 3 dias no futuro
  {
    id: 'sample-9',
    type: 'cake',
    size: 'PP',
    flavor: 'Red Velvet',
    filling: 'Cream cheese',
    finishing: 'Glacê real',
    needsTopper: true,
    pickupTime: '16:00',
    value: 40.00,
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    customerName: 'Aniversário Pedro',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-10',
    type: 'sweet',
    sweetType: 'Trufa',
    quantity: 25,
    flavor: 'Chocolate Branco',
    value: 30.00,
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    customerName: 'Aniversário Pedro',
    createdAt: new Date().toISOString()
  },
  
  // Mais pedidos de diferentes datas para testar período
  {
    id: 'sample-11',
    type: 'cake',
    size: 'GG',
    flavor: 'Limão',
    filling: 'Mousse de limão',
    finishing: 'Merengue',
    needsTopper: false,
    pickupTime: '20:00',
    value: 95.00,
    date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    customerName: 'Festa da Empresa',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-12',
    type: 'cake',
    size: 'P',
    flavor: 'Cenoura',
    filling: 'Brigadeiro',
    finishing: 'Cobertura de chocolate',
    needsTopper: false,
    pickupTime: '14:00',
    value: 42.00,
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    customerName: 'Dona Rosa',
    createdAt: new Date().toISOString()
  }
];

// Função para restaurar dados no localStorage
export const restoreSampleData = () => {
  try {
    localStorage.setItem('confeitaria-orders', JSON.stringify(sampleOrders));
    console.log('✅ Dados de exemplo restaurados com sucesso!');
    console.log(`📊 ${sampleOrders.length} pedidos adicionados`);
    console.log('📅 Dados específicos para junho 2025:');
    sampleOrders.forEach(order => {
      if (order.date.startsWith('2025-06')) {
        console.log(`   - ${order.date}: ${order.customerName} (${order.type})`);
      }
    });
    return true;
  } catch (error) {
    console.error('❌ Erro ao restaurar dados:', error);
    return false;
  }
}; 