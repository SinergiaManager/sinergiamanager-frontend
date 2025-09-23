import React, { useState } from 'react';
import logo from '../assets/react.svg';
import sideImage from '../assets/forgotPassword.svg';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../ts/apiClient';
import Alert from './Alert';

const PasswordReset: React.FC = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState<'success'|'error'|'warning'>('success');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (newPassword.length < 6) {
                setAlertType('warning');
                setAlertMsg('La nuova password deve avere almeno 6 caratteri');
                return;
            }
            setIsSubmitting(true);
            await apiClient.post('/auth/reset-password', { oldPassword, newPassword });
            setMessage('Your password has been successfully reset.');
            setAlertType('success');
            setAlertMsg('Password aggiornata');
        } catch (error) {
            console.error(error);
            setMessage('An error occurred. Please try again.');
            setAlertType('error');
            setAlertMsg('Errore nel reset della password');
        } finally {
            setIsSubmitting(false);
        }
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
                            <button className="bg-transparent hover:bg-blue-500 text-blue-500 dark:text-blue-300 font-semibold hover:text-white py-2 px-4 border border-blue-400 dark:border-blue-300 hover:border-transparent rounded" onClick={() => navigate("/register")}>
                                Sign Up
                            </button>
                        </div>

                        <div className="space-y-2 mb-10">
                            <h2 className="text-gray-600 dark:text-gray-400">Password Recovery</h2>
                            <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">Reset your Password</p>
                            <p className="text-gray-600 dark:text-gray-400">Please enter your old password, and new password to reset your password.</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>

                            <div className="space-y-2">
                                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Old Password
                                </label>
                                <input
                                    id="oldPassword"
                                    name="oldPassword"
                                    type="password"
                                    placeholder="Enter your old password"
                                    required
                                    autoComplete="current-password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    placeholder="Enter your new password"
                                    required
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-4 py-3 text-white rounded ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-400 to-blue-700 dark:from-blue-600 dark:to-blue-900 hover:from-blue-700 hover:to-blue-900'}`}
                            >
                                {isSubmitting ? 'Updating...' : 'Reset Password'}
                            </button>
                        </form>
                        {message && <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">{message}</p>}
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

export default PasswordReset;
