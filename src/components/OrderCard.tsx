
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Clock, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Order, useOrders } from '@/hooks/useOrders';
import { CakeForm } from './CakeForm';
import { SweetForm } from './SweetForm';
import { WeddingForm } from './WeddingForm';
import { useToast } from '@/hooks/use-toast';

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { deleteOrder } = useOrders();
  const { toast } = useToast();

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      deleteOrder(order.id);
      toast({
        title: "Pedido excluído",
        description: "O pedido foi removido com sucesso",
      });
    }
  };

  const getOrderIcon = () => {
    switch (order.type) {
      case 'cake': return '🎂';
      case 'sweet': return '🍭';
      case 'wedding': return '💒';
      default: return '📦';
    }
  };

  const getOrderTitle = () => {
    switch (order.type) {
      case 'cake': 
        return `Bolo ${order.size} - ${order.flavor}`;
      case 'sweet': 
        return `${order.quantity}x ${order.sweetType}`;
      case 'wedding': 
        return `${order.quantity}x Bem-casados`;
      default: return 'Pedido';
    }
  };

  const getOrderDetails = () => {
    switch (order.type) {
      case 'cake':
        return (
          <div className="space-y-2 text-sm">
            <p><strong>Recheio:</strong> {order.filling}</p>
            <p><strong>Acabamento:</strong> {order.finishing}</p>
            {order.needsTopper && <Badge variant="secondary" className="bg-pink-100 text-pink-800">Com topo</Badge>}
            {order.pickupTime && (
              <p className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <strong>Retirada:</strong> {order.pickupTime}
              </p>
            )}
          </div>
        );
      case 'sweet':
        return (
          <div className="space-y-2 text-sm">
            <p><strong>Sabor:</strong> {order.flavor}</p>
          </div>
        );
      case 'wedding':
        return (
          <div className="space-y-2 text-sm">
            <p><strong>Sabor:</strong> {order.flavor}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderEditForm = () => {
    switch (order.type) {
      case 'cake':
        return <CakeForm defaultDate={order.date} onSuccess={() => setIsEditModalOpen(false)} editingOrder={order} />;
      case 'sweet':
        return <SweetForm defaultDate={order.date} onSuccess={() => setIsEditModalOpen(false)} editingOrder={order} />;
      case 'wedding':
        return <WeddingForm defaultDate={order.date} onSuccess={() => setIsEditModalOpen(false)} editingOrder={order} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="bg-white/90 backdrop-blur border-sweet-200 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getOrderIcon()}</span>
              <div>
                <h3 className="font-semibold text-sweet-800">{getOrderTitle()}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {order.customerName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sweet-700 border-sweet-300">
                R$ {order.value.toFixed(2)}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="border-sweet-300 hover:bg-sweet-50"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {getOrderDetails()}
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient">
              ✏️ Editar Pedido
            </DialogTitle>
          </DialogHeader>
          {renderEditForm()}
        </DialogContent>
      </Dialog>
    </>
  );
};
