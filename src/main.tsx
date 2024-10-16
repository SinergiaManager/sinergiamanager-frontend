import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';

import Login from './components/Login';
import React, { StrictMode } from 'react';
import ForgotPassword from './components/ForgotPassword';
import Drawer from './components/Drawer';
import Navbar from './components/Navbar';
import PasswordReset from './components/PasswordReset';

const App: React.FC = () => {
  return (
    <StrictMode>
      <div className="flex flex-col w-full min-h-screen">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <div className="flex h-screen">
                    <Drawer />

                    <div className="flex-grow bg-gray-100 dark:bg-gray-900 p-6">
                      <Navbar />
                      <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200 text-center mt-3">
                        Dashboard
                      </h1>
                    </div>
                  </div>
                </>
              }
            />

          </Routes>
        </Router>
      </div>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
