
import React, { useState } from 'react';
import { User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LoginIcon, UserPlusIcon } from './icons';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

interface StoredUser {
  username: string;
  password?: string; // Stored for demo purposes
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useLocalStorage<StoredUser[]>('users', []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Nombre de usuario y contraseña son requeridos.');
      return;
    }

    if (isLogin) {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        onLoginSuccess({ username: user.username });
      } else {
        setError('Nombre de usuario o contraseña incorrectos.');
      }
    } else {
      if (users.some(u => u.username === username)) {
        setError('El nombre de usuario ya existe.');
      } else {
        const newUser = { username, password };
        setUsers([...users, newUser]);
        onLoginSuccess({ username: newUser.username });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="mt-2 text-gray-400">
            {isLogin ? 'Bienvenido de nuevo' : 'Únete para registrar tus horas'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLogin ? <LoginIcon className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" /> : <UserPlusIcon className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />}
              </span>
              {isLogin ? 'Entrar' : 'Registrarse'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <button
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
            }}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
