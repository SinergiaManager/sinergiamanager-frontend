import React from 'react';
import RouteGuard from '../components/RouteGuard';
import Spinner from '../components/Spinner';

const Root: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <RouteGuard>
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
      </RouteGuard>
    </div>
  );
};

export default Root;