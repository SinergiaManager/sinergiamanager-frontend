import React, { useState } from 'react';
import logo from '../assets/react.svg';
import sideImage from '../assets/login.svg';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../ts/services/authService';
import Alert from './Alert';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState<'success'|'error'|'warning'>('success');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center grow bg-gray-100 dark:bg-gray-900 h-screen">
      <div className="flex flex-col md:flex-row w-full h-full bg-white dark:bg-gray-800 shadow-md">
        <div className="w-full md:w-1/2 p-10 space-y-8 flex flex-col justify-center items-center">
          <div className="w-full max-w-xl">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="Logo" className="h-12" />
                <span className="text-xl font-bold text-gray-700 dark:text-gray-200">Sinergia Manager</span>
              </div>
              <button className="bg-transparent hover:bg-blue-500 text-blue-500 dark:text-blue-400 font-semibold hover:text-white py-2 px-4 border border-blue-400 hover:border-transparent rounded" onClick={() => navigate("/register")}>
                Sign Up
              </button>
            </div>

            <div className="space-y-2 mb-10">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Welcome Back</h2>
              <p className="text-gray-600 dark:text-gray-400">Please sign in</p>
            </div>

            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              // Validazioni semplici
              const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRe.test(email)) {
                setAlertType('warning');
                setAlertMsg('Inserisci un\'email valida');
                return;
              }
              if (password.length < 6) {
                setAlertType('warning');
                setAlertMsg('La password deve avere almeno 6 caratteri');
                return;
              }
              try {
                setIsSubmitting(true);
                await AuthService.login(email, password);
                navigate('/dashboard');
              } catch {
                setAlertType('error');
                setAlertMsg('Credenziali non valide');
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="●●●●●●●"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 focus:outline-none"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a href="/forgot-password" className="text-sm text-blue-500 dark:text-blue-400 hover:underline">
                  I forgot my password
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 text-white rounded ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-400 to-blue-700 dark:from-blue-600 dark:to-blue-900 hover:from-blue-700 hover:to-blue-900'}`}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            {alertMsg && <Alert message={alertMsg} type={alertType} onClose={() => setAlertMsg('')} />}
          </div>
        </div>

        <div className="hidden md:block w-1/2">
          <img src={sideImage} alt="Side" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;
