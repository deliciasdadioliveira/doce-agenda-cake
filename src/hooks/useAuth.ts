
import { useState, useEffect } from 'react';

interface User {
  email: string;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('confeitaria-auth');
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        if (authData.isAuthenticated) {
          setUser(authData);
          console.log('Usuário logado encontrado:', authData);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    console.log('Tentativa de login:', email);
    // Credenciais fixas para a dona do estabelecimento
    if (email === 'deliciasdadioliveira' && password === 'delicias123') {
      const userData = { email, isAuthenticated: true };
      setUser(userData);
      localStorage.setItem('confeitaria-auth', JSON.stringify(userData));
      console.log('Login realizado com sucesso');
      return true;
    }
    console.log('Credenciais inválidas');
    return false;
  };

  const logout = () => {
    console.log('Fazendo logout');
    setUser(null);
    localStorage.removeItem('confeitaria-auth');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: user?.isAuthenticated || false
  };
};
