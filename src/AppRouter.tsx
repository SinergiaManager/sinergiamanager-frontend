import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRouting';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ConfigurationWizard from './pages/ConfigurationWizard';
import PasswordReset from './components/PasswordReset';
import Dashboard from './pages/Dashboard';
import Notification from './pages/Notification';
import Root from './pages/Root';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route 
          path="/configuration" 
          element={
            <PrivateRoute requiresConfiguration={false}>
              <ConfigurationWizard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute requiresConfiguration={true}>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <PrivateRoute requiresConfiguration={true}>
              <Notification />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
