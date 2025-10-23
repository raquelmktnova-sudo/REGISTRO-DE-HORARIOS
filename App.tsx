
import React, { useState, useCallback } from 'react';
import { User } from './types';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {currentUser ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={setCurrentUser} />
      )}
    </div>
  );
};

export default App;
