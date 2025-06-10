
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { useOrders, Cake } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';

interface CakeFormProps {
  defaultDate: string;
  onSuccess: () => void;
  editingOrder?: Cake;
}

export const CakeForm = ({ defaultDate, onSuccess, editingOrder }: CakeFormProps) => {
  const { addOrder, updateOrder } = useOrders();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: editingOrder?.customerName || '',
    size: editingOrder?.size || '' as Cake['size'],
    flavor: editingOrder?.flavor || '',
    filling: editingOrder?.filling || '',
    finishing: editingOrder?.finishing || '',
    needsTopper: editingOrder?.needsTopper || false,
    pickupTime: editingOrder?.pickupTime || '',
    value: editingOrder?.value || 0,
    date: editingOrder?.date || defaultDate,
  });

  const sizeOptions = [
    'PP', 'P', 'M', 'G', 'GG', 
    'Bolo de Corte 70 fatias', 
    'Bolo de Corte 100 fatias'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.size || !formData.flavor || !formData.filling || !formData.finishing) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      ...formData,
      type: 'cake' as const,
    };

    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, orderData);
        toast({
          title: "Sucesso! 🎉",
          description: "Pedido de bolo atualizado com sucesso",
        });
      } else {
        await addOrder(orderData);
        toast({
          title: "Sucesso! 🎉",
          description: "Pedido de bolo adicionado com sucesso",
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
            <Label htmlFor="size">Tamanho do Bolo *</Label>
            <Select value={formData.size} onValueChange={(value) => setFormData({...formData, size: value as Cake['size']})}>
              <SelectTrigger className="border-sweet-200 focus:border-pink-300">
                <SelectValue placeholder="Selecione o tamanho" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {sizeOptions.map((size) => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="flavor">Sabor da Massa *</Label>
            <Input
              id="flavor"
              value={formData.flavor}
              onChange={(e) => setFormData({...formData, flavor: e.target.value})}
              placeholder="Ex: Chocolate, Baunilha, Morango..."
              className="border-sweet-200 focus:border-pink-300"
            />
          </div>

          <div>
            <Label htmlFor="filling">Recheio *</Label>
            <Input
              id="filling"
              value={formData.filling}
              onChange={(e) => setFormData({...formData, filling: e.target.value})}
              placeholder="Ex: Brigadeiro, Doce de leite, Frutas..."
              className="border-sweet-200 focus:border-pink-300"
            />
          </div>

          <div>
            <Label htmlFor="finishing">Tipo de Acabamento *</Label>
            <Input
              id="finishing"
              value={formData.finishing}
              onChange={(e) => setFormData({...formData, finishing: e.target.value})}
              placeholder="Ex: Chantilly, Pasta americana, Glacê..."
              className="border-sweet-200 focus:border-pink-300"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="needsTopper"
              checked={formData.needsTopper}
              onCheckedChange={(checked) => setFormData({...formData, needsTopper: checked})}
            />
            <Label htmlFor="needsTopper">Necessário topo de bolo?</Label>
          </div>

          <div>
            <Label htmlFor="pickupTime">Horário para Retirada</Label>
            <Input
              id="pickupTime"
              type="time"
              value={formData.pickupTime}
              onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}
              className="border-sweet-200 focus:border-pink-300"
            />
          </div>

          <div>
            <Label htmlFor="value">Valor da Encomenda (R$) *</Label>
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

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-400 to-lavender-400 hover:from-pink-500 hover:to-lavender-500 text-white"
          >
            {editingOrder ? 'Atualizar Pedido' : 'Adicionar Bolo'} 🎂
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
