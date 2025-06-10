import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/hooks/useOrders';

const COLLECTION_NAME = 'orders';

// Converter dados do Firestore para Order
const firestoreToOrder = (doc: any): Order => ({
  id: doc.id,
  ...doc.data(),
  // Garantir que datas sejam strings
  createdAt: doc.data().createdAt || new Date().toISOString(),
  updatedAt: doc.data().updatedAt || new Date().toISOString()
});

export const firebaseOrdersService = {
  // Adicionar novo pedido
  async addOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
    try {
      const dataToSave = {
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToSave);
      console.log('✅ [Firebase] Pedido adicionado:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ [Firebase] Erro ao adicionar pedido:', error);
      throw error;
    }
  },

  // Atualizar pedido existente
  async updateOrder(id: string, updates: Partial<Order>): Promise<void> {
    try {
      const orderRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ [Firebase] Pedido atualizado:', id);
    } catch (error) {
      console.error('❌ [Firebase] Erro ao atualizar pedido:', error);
      throw error;
    }
  },

  // Excluir pedido
  async deleteOrder(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      console.log('✅ [Firebase] Pedido excluído:', id);
    } catch (error) {
      console.error('❌ [Firebase] Erro ao excluir pedido:', error);
      throw error;
    }
  },

  // Buscar todos os pedidos
  async getAllOrders(): Promise<Order[]> {
    try {
      const ordersCollection = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(ordersCollection);
      
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      console.log(`📦 [Firebase Service] ${orders.length} pedidos recuperados`);
      return orders;
    } catch (error) {
      console.error('❌ [Firebase Service] Erro ao buscar pedidos:', error);
      throw error;
    }
  },

  // Buscar pedidos por data
  async getOrdersByDate(date: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('date', '==', date),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(firestoreToOrder);
      console.log(`✅ [Firebase] ${orders.length} pedidos encontrados para ${date}`);
      return orders;
    } catch (error) {
      console.error('❌ [Firebase] Erro ao buscar pedidos por data:', error);
      throw error;
    }
  },

  // Buscar pedidos por período
  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(firestoreToOrder);
      console.log(`✅ [Firebase] ${orders.length} pedidos encontrados entre ${startDate} e ${endDate}`);
      return orders;
    } catch (error) {
      console.error('❌ [Firebase] Erro ao buscar pedidos por período:', error);
      throw error;
    }
  },

  // Escutar mudanças em tempo real (opcional)
  subscribeToOrders(callback: (orders: Order[]) => void): () => void {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const orders = querySnapshot.docs.map(firestoreToOrder);
        console.log(`🔄 [Firebase] Atualização em tempo real: ${orders.length} pedidos`);
        callback(orders);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('❌ [Firebase] Erro ao escutar mudanças:', error);
      throw error;
    }
  },

  // Limpar todos os dados (para reset/desenvolvimento)
  async clearAllOrders(): Promise<void> {
    try {
      console.log('🗑️ [Firebase Service] Iniciando limpeza de todos os dados...');
      
      const ordersCollection = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(ordersCollection);
      
      if (snapshot.empty) {
        console.log('✅ [Firebase Service] Nenhum dado para limpar');
        return;
      }

      // Usar batch para deletar todos os documentos
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      
      console.log(`✅ [Firebase Service] ${snapshot.size} pedidos foram removidos`);
    } catch (error) {
      console.error('❌ [Firebase Service] Erro ao limpar dados:', error);
      throw error;
    }
  }
}; 