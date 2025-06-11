
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { refreshOrders } = useOrders();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    try {
      // Pequeno delay apenas para mostrar feedback visual
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const success = login(email, password);
      if (!success) {
        setError('Credenciais inválidas');
      } else {
        // Após login bem-sucedido, carrega os dados
        await refreshOrders();
        // Auto-refresh para garantir interface atualizada
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
      // Se success for true, o estado será atualizado automaticamente
    } catch (error) {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sweet-50 to-lavender-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur border-sweet-200 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-pink-100 to-lavender-100 flex items-center justify-center overflow-hidden border-4 border-sweet-200 shadow-lg">
            <img 
              src="/lovable-uploads/62298848-6d22-47d7-abd3-f08b363a1bcf.png" 
              alt="Delícias da Di" 
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gradient">
            Delícias da Di
          </CardTitle>
          <p className="text-muted-foreground">
            Acesso restrito à proprietária
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email/Usuário</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu usuário"
                className="border-sweet-200 focus:border-sweet-400"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-sweet-200 focus:border-sweet-400"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-400 to-lavender-400 hover:from-pink-500 hover:to-lavender-500 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
