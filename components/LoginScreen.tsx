import React, { useState } from 'react';
import { User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LoginIcon, UserPlusIcon } from './icons';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<'worker' | 'boss'>('worker');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (!username.trim()) {
        setError('El nombre de usuario no puede estar vacío.');
        return;
    }
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      onLoginSuccess(existingUser);
    } else {
      setError('Usuario no encontrado. Por favor, regístrate.');
    }
  };

  const handleRegister = () => {
    if (!username.trim()) {
        setError('El nombre de usuario no puede estar vacío.');
        return;
    }
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      setError('Este nombre de usuario ya existe. Por favor, inicia sesión.');
    } else {
      const newUser: User = {
        username: username,
        role: role,
      };
      setUsers([...users, newUser]);
      onLoginSuccess(newUser);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isRegistering) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <div>
          <h2 className="text-3xl font-bold text-center text-white">
            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {isRegistering ? 'Crea una cuenta para empezar a fichar.' : `Bienvenido de vuelta. Inicia sesión.`}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {isRegistering && (
            <fieldset>
              <legend className="text-sm font-medium text-gray-300">Selecciona tu rol</legend>
              <div className="mt-2 flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    id="role-worker"
                    name="role"
                    type="radio"
                    value="worker"
                    checked={role === 'worker'}
                    onChange={() => setRole('worker')}
                    className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="role-worker" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                    Empleado
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="role-boss"
                    name="role"
                    type="radio"
                    value="boss"
                    checked={role === 'boss'}
                    onChange={() => setRole('boss')}
                    className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="role-boss" className="ml-2 block text-sm text-gray-300 cursor-pointer">
                    Gerente
                  </label>
                </div>
              </div>
            </fieldset>
          )}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isRegistering ? <UserPlusIcon className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" /> : <LoginIcon className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />}
              </span>
              {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
            <button
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError(null);
                }}
                className="font-medium text-indigo-400 hover:text-indigo-300"
            >
                {isRegistering ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
