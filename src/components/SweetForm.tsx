
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useOrders, Sweet } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';

interface SweetFormProps {
  defaultDate: string;
  onSuccess: () => void;
  editingOrder?: Sweet;
}

export const SweetForm = ({ defaultDate, onSuccess, editingOrder }: SweetFormProps) => {
  const { addOrder, updateOrder } = useOrders();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: editingOrder?.customerName || '',
    sweetType: editingOrder?.sweetType || '',
    quantity: editingOrder?.quantity || 0,
    value: editingOrder?.value || 0,
    date: editingOrder?.date || defaultDate,
    observations: editingOrder?.observations || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.sweetType || formData.quantity <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      ...formData,
      flavor: '', // Campo removido da interface, mas mantido para compatibilidade
      type: 'sweet' as const,
    };

    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, orderData);
        toast({
          title: "Sucesso! 🎉",
          description: "Pedido de doces atualizado com sucesso",
        });
        // Auto-refresh para edição
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        await addOrder(orderData);
        toast({
          title: "Sucesso! 🎉",
          description: "Pedido de doces adicionado com sucesso",
        });
      }
      
      // Só fecha o modal após a operação ser concluída
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar pedido. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-sweet-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Nome do Cliente *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              placeholder="Digite o nome do cliente"
              className="border-sweet-200 focus:border-pink-300"
            />
          </div>

          <div>
            <Label htmlFor="date">Data de Entrega *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="border-sweet-200 focus:border-pink-300"
            />
          </div>

          <div>
            <Label htmlFor="sweetType">Tipo de Doce *</Label>
            <Input
              id="sweetType"
              value={formData.sweetType}
              onChange={(e) => setFormData({...formData, sweetType: e.target.value})}
              placeholder="Ex: Brigadeiro, Beijinho, Cajuzinho..."
              className="border-sweet-200 focus:border-pink-300"
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
              placeholder="Digite a quantidade"
              className="border-sweet-200 focus:border-pink-300"
            />
          </div>



          <div>
            <Label htmlFor="value">Valor Total (R$) *</Label>
            <Input
              id="value"
              type="number"
              min="0"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
              placeholder="0,00"
              className="border-sweet-200 focus:border-pink-300"
            />
          </div>

          <div>
            <Label htmlFor="observations">Observações</Label>
            <textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData({...formData, observations: e.target.value})}
              placeholder="Adicione observações extras sobre o pedido..."
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-sweet-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none resize-vertical"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-400 to-lavender-400 hover:from-pink-500 hover:to-lavender-500 text-white"
          >
            {editingOrder ? 'Atualizar Pedido' : 'Adicionar Doces'} 🍭
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
