import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutingUtils, RoutingDecision } from '../../ts/routingUtils';
import Spinner from './Spinner';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleRouting = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const decision: RoutingDecision = await RoutingUtils.determineRoute();
        console.log('Routing decision:', decision.reason);
        
        navigate(decision.destination);
      } catch (err) {
        console.error('Error in routing guard:', err);
        setError('Errore durante il caricamento');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    handleRouting();
  }, [navigate]);

  if (isLoading) {
    return (
      <Spinner 
        size="lg" 
        message="Verifica configurazione in corso..." 
        fullScreen={true}
      />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Errore di caricamento</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;