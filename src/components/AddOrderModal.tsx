
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CakeForm } from './CakeForm';
import { SweetForm } from './SweetForm';
import { WeddingForm } from './WeddingForm';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate: string;
}

export const AddOrderModal = ({ isOpen, onClose, defaultDate }: AddOrderModalProps) => {
  const [activeTab, setActiveTab] = useState('cake');

  const handleClose = () => {
    setActiveTab('cake');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gradient">
            ✨ Novo Pedido
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cake" className="flex items-center gap-2">
              🎂 Bolos
            </TabsTrigger>
            <TabsTrigger value="sweet" className="flex items-center gap-2">
              🍭 Doces
            </TabsTrigger>
            <TabsTrigger value="wedding" className="flex items-center gap-2">
              💒 Bem-casados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cake" className="mt-4">
            <CakeForm defaultDate={defaultDate} onSuccess={handleClose} />
          </TabsContent>

          <TabsContent value="sweet" className="mt-4">
            <SweetForm defaultDate={defaultDate} onSuccess={handleClose} />
          </TabsContent>

          <TabsContent value="wedding" className="mt-4">
            <WeddingForm defaultDate={defaultDate} onSuccess={handleClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
