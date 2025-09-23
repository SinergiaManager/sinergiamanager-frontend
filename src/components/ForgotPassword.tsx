import React, { useState } from 'react';
import logo from '../assets/react.svg';
import sideImage from '../assets/forgotPassword.svg';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import { apiClient } from '../../ts/apiClient';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState<'success'|'error'|'warning'>('success');

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
              <button className="bg-transparent hover:bg-blue-500 text-blue-500 dark:text-blue-300 font-semibold hover:text-white py-2 px-4 border border-blue-400 dark:border-blue-300 hover:border-transparent rounded" onClick={() => navigate("/register")}>
                Sign Up
              </button>
            </div>

            <div className="space-y-2 mb-10">
              <h2 className="text-gray-600 dark:text-gray-400">Password Recovery</h2>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">Forgot your Password?</p>
              <p className="text-gray-600 dark:text-gray-400">Kindly enter the email address linked to this account and we will send you a code to enable you change your password.</p>
            </div>

            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRe.test(email)) {
                setAlertType('warning');
                setAlertMsg('Inserisci un\'email valida');
                return;
              }
              try {
                setIsSubmitting(true);
                await apiClient.post('/auth/forgot-password', { email });
                setAlertType('success');
                setAlertMsg('Email inviata con le istruzioni');
              } catch {
                setAlertType('error');
                setAlertMsg('Impossibile inviare l\'email');
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 text-white rounded ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-400 to-blue-700 dark:from-blue-600 dark:to-blue-900 hover:from-blue-700 hover:to-blue-900'}`}
              >
                {isSubmitting ? 'Sending...' : 'Reset Password'}
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

export default ForgotPassword;
