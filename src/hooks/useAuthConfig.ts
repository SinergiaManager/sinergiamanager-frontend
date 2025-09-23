import { useState, useEffect } from 'react';
import { AuthService } from '../../ts/services/authService';
import { ConfigurationService } from '../../ts/services/configurationService';

interface UseAuthConfigResult {
  isLoggedIn: boolean;
  hasConfiguration: boolean;
  isLoading: boolean;
  error: string | null;
  checkConfiguration: () => Promise<void>;
}

export const useAuthConfig = (): UseAuthConfigResult => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasConfiguration, setHasConfiguration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkConfiguration = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authStatus = AuthService.isAuthenticated();
      setIsLoggedIn(authStatus);
      
      const configStatus = await ConfigurationService.checkConfiguration();
      setHasConfiguration(configStatus.hasConfiguration);
      
    } catch (err) {
      setError('Errore durante il controllo dello stato');
      console.error('Error in checkConfiguration:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  return {
    isLoggedIn,
    hasConfiguration,
    isLoading,
    error,
    checkConfiguration
  };
};