import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, HardDrive, Settings, AlertTriangle } from 'lucide-react';

interface FirebaseToggleProps {
  isFirebaseActive: boolean;
  onToggle: (useFirebase: boolean) => void;
  ordersCount: number;
}

export const FirebaseToggle = ({ isFirebaseActive, onToggle, ordersCount }: FirebaseToggleProps) => {
  const [isConfigured, setIsConfigured] = useState(false);

  // Verificar se Firebase está configurado (básico)
  const checkFirebaseConfig = () => {
    try {
      // Tentar importar a configuração
      return true; // Simplificado para demo
    } catch {
      return false;
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur border-sweet-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sweet-800">
          <Settings className="w-5 h-5" />
          Sistema de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Atual */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            {isFirebaseActive ? (
              <>
                <Cloud className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Firebase (Nuvem)</span>
              </>
            ) : (
              <>
                <HardDrive className="w-5 h-5 text-gray-600" />
                <span className="font-medium">localStorage (Local)</span>
              </>
            )}
          </div>
          <Badge variant={isFirebaseActive ? "default" : "secondary"}>
            {isFirebaseActive ? "Seguro" : "Frágil"}
          </Badge>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-blue-50 rounded text-center">
            <div className="font-bold text-blue-800">{ordersCount}</div>
            <div className="text-blue-600">Pedidos</div>
          </div>
          <div className="p-2 bg-green-50 rounded text-center">
            <div className="font-bold text-green-800">
              {isFirebaseActive ? "100%" : "0%"}
            </div>
            <div className="text-green-600">Segurança</div>
          </div>
        </div>

        {/* Aviso se usando localStorage */}
        {!isFirebaseActive && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-yellow-800">⚠️ Dados em risco!</div>
              <div className="text-yellow-700">
                localStorage pode ser perdido facilmente. Configure Firebase para segurança total.
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="space-y-2">
          {!isFirebaseActive ? (
            <>
              <Button 
                onClick={() => onToggle(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!isConfigured}
              >
                <Cloud className="w-4 h-4 mr-2" />
                Ativar Firebase
              </Button>
              <p className="text-xs text-center text-gray-600">
                Primeiro configure o Firebase seguindo o guia FIREBASE_SETUP.md
              </p>
            </>
          ) : (
            <Button 
              onClick={() => onToggle(false)}
              variant="outline"
              className="w-full"
            >
              <HardDrive className="w-4 h-4 mr-2" />
              Usar localStorage (não recomendado)
            </Button>
          )}
        </div>

        {/* Link para Documentação */}
        <div className="pt-2 border-t text-center">
          <Button variant="link" size="sm" className="text-xs text-blue-600">
            📖 Ver Guia de Configuração
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 