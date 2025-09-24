import React, { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from "../../ts/services/authService";
import { ConfigurationService } from "../../ts/services/configurationService";
import Spinner from "./Spinner";

interface PrivateRouteProps {
  roles?: string[];
  requiresConfiguration?: boolean;
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  roles, 
  requiresConfiguration = true, 
  children 
}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasConfiguration, setHasConfiguration] = useState(false);
  
  const isAuthenticated = AuthService.isAuthenticated();
  const hasRequiredRole = AuthService.hasRole(roles);

  useEffect(() => {
    const checkConfiguration = async () => {
      if (!isAuthenticated || !requiresConfiguration) {
        setIsLoading(false);
        return;
      }

      try {
        const configStatus = await ConfigurationService.checkConfiguration();
        setHasConfiguration(configStatus !== null);
      } catch (error) {
        console.error('Error checking configuration:', error);
        setHasConfiguration(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConfiguration();
  }, [isAuthenticated, requiresConfiguration]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <Spinner 
        size="lg" 
        message="Verifica configurazione..." 
        fullScreen={true}
      />
    );
  }

  // Se la route richiede configurazione ma non esiste, reindirizza al wizard
  if (requiresConfiguration && !hasConfiguration && location.pathname !== '/configuration') {
    return <Navigate to="/configuration" replace />;
  }

  if (!hasRequiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Accesso Negato
          </h3>
          <p className="text-gray-600 mb-4">
            Non hai i permessi necessari per accedere a questa pagina.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Torna Indietro
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;