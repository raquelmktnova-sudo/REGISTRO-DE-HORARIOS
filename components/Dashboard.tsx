
import React, { useState, useMemo } from 'react';
import { User, TimeLog } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TimeTracker from './TimeTracker';
import History from './History';
import { LogoutIcon } from './icons';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [timeLogs, setTimeLogs] = useLocalStorage<TimeLog[]>(`time_logs_${user.username}`, []);

  const activeLog = useMemo(() => timeLogs.find(log => !log.clockOut), [timeLogs]);
  const isClockedIn = !!activeLog;

  const handleClockIn = (note: string) => {
    if (isClockedIn) return;
    const newLog: TimeLog = {
      id: new Date().toISOString(),
      clockIn: new Date().toISOString(),
      notesIn: note,
    };
    setTimeLogs(prevLogs => [...prevLogs, newLog]);
  };

  const handleClockOut = (note: string) => {
    if (!activeLog) return;
    const updatedLogs = timeLogs.map(log =>
      log.id === activeLog.id
        ? { ...log, clockOut: new Date().toISOString(), notesOut: note }
        : log
    );
    setTimeLogs(updatedLogs);
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Hola, {user.username}</h1>
                <p className="text-gray-400">Bienvenido a tu registro de horarios.</p>
            </div>
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transition-colors"
            >
                <LogoutIcon className="h-5 w-5" />
                <span>Salir</span>
            </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <TimeTracker
                    isClockedIn={isClockedIn}
                    onClockIn={handleClockIn}
                    onClockOut={handleClockOut}
                    lastClockInTime={activeLog?.clockIn}
                />
            </div>
            <div className="lg:col-span-2">
                <History timeLogs={timeLogs} />
            </div>
        </main>
    </div>
  );
};

export default Dashboard;
