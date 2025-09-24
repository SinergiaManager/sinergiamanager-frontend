import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../ts/services/authService';
import { ConfigurationService } from '../../ts/services/configurationService';
import Spinner from '../components/Spinner';

const Root: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const isLoggedIn = AuthService.isAuthenticated();
        
        if (!isLoggedIn) {
          navigate('/login');
          return;
        }

        // L'utente è loggato, verifica la configurazione
        const configStatus = await ConfigurationService.checkConfiguration();
        const hasConfiguration = configStatus !== null;

        if (hasConfiguration) {
          navigate('/dashboard');
        } else {
          navigate('/configuration');
        }
      } catch (error) {
        console.error('Error during app initialization:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sinergia Manager</h1>
              <p className="text-gray-600">Sistema di gestione avanzato</p>
            </div>
            <Spinner 
              size="lg" 
              message="Inizializzazione sistema..." 
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Root;