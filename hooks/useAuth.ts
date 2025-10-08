import { useState, useEffect } from 'react';
import { TokenManager } from '@/lib/auth/tokens';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(TokenManager.isAuthenticated());
    setIsLoading(false);
  }, []);

  const logout = () => {
    TokenManager.clearTokens();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
  };
}