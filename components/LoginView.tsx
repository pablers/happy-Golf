import React, { useState } from 'react';
import { api } from '../services/api';
import type { UserProfile } from '../types';
import { GolfBallIcon, SpinnerIcon } from './icons';

interface LoginViewProps {
  onLoginSuccess: (token: string, profile: UserProfile) => void;
  onSkip: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onSkip }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const { access_token, profile } = await api.login(email, password);
        onLoginSuccess(access_token, profile);
      } else {
        const { access_token, profile } = await api.register(email, password, name);
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        // Switch to login view after successful registration
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-white dark:from-gray-800 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm mx-auto bg-white/80 dark:bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-300 dark:border-gray-700/50 overflow-hidden">
        <div className="p-8">
          <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-2">
              <GolfBallIcon className="w-8 h-8 text-green-500 dark:text-green-400" />
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Golf Master</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{isLogin ? 'Inicia sesión para continuar' : 'Crea una cuenta para empezar'}</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2.5 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                  placeholder="Tu nombre completo"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2.5 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2.5 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                placeholder="********"
              />
            </div>
            
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center p-3 bg-green-600 text-white font-bold rounded-lg transition-colors duration-200 hover:bg-green-700 disabled:bg-gray-500"
              >
                {isLoading ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-sm text-green-500 dark:text-green-400 hover:underline">
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
          <div className="mt-4 text-center">
             <button onClick={onSkip} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline">
              Saltar por ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;