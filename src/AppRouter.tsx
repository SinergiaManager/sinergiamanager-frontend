import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RouteGuard from './components/RouteGuard';
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
      <RouteGuard>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/configuration" element={<ConfigurationWizard />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notifications" element={<Notification />} />
        </Routes>
      </RouteGuard>
    </Router>
  );
};

export default AppRouter;
