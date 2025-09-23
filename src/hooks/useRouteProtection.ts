import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../ts/services/authService';
import { RoutingUtils } from '../../ts/routingUtils';

interface UseRouteProtectionResult {
  isLoading: boolean;
  isAuthorized: boolean;
  error: string | null;
}

export const useRouteProtection = (requiredRoles?: string[]): UseRouteProtectionResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);

        // Controlla se la rotta richiede autenticazione
        if (RoutingUtils.requiresAuth(location.pathname)) {
          const isAuthenticated = AuthService.isAuthenticated();
          
          if (!isAuthenticated) {
            navigate('/login', { 
              state: { from: location.pathname } 
            });
            return;
          }

          // Controlla ruoli se specificati
          if (requiredRoles && !AuthService.hasRole(requiredRoles)) {
            setError('Non hai i permessi necessari per accedere a questa pagina');
            setIsAuthorized(false);
            return;
          }

          // Controlla se la rotta richiede configurazione
          if (RoutingUtils.requiresConfiguration(location.pathname)) {
            // Qui potresti aggiungere una chiamata per verificare la configurazione
            // se necessario per questa specifica rotta
          }
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error('Error in route protection:', err);
        setError('Errore durante la verifica dei permessi');
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [location.pathname, navigate, requiredRoles]);

  return {
    isLoading,
    isAuthorized,
    error
  };
};