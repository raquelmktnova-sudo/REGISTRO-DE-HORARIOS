
import React, { useState, useEffect } from 'react';
import { ClockIcon } from './icons';
import { formatDuration, getDuration } from '../utils/date';

interface TimeTrackerProps {
  isClockedIn: boolean;
  onClockIn: (note: string) => void;
  onClockOut: (note: string) => void;
  lastClockInTime?: string;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ isClockedIn, onClockIn, onClockOut, lastClockInTime }) => {
  const [note, setNote] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [runningDuration, setRunningDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: number;
    if (isClockedIn && lastClockInTime) {
      setRunningDuration(getDuration(lastClockInTime));
      interval = setInterval(() => {
        setRunningDuration(getDuration(lastClockInTime));
      }, 1000);
    } else {
      setRunningDuration(0);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, lastClockInTime]);

  const handleSubmit = () => {
    if (isClockedIn) {
      onClockOut(note);
    } else {
      onClockIn(note);
    }
    setNote('');
  };

  const buttonClass = isClockedIn
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-green-600 hover:bg-green-700';
  
  const buttonText = isClockedIn ? 'Fichar Salida' : 'Fichar Entrada';

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-4">Control de Horario</h2>
      <div className="text-center bg-gray-900/50 p-4 rounded-lg mb-4 border border-gray-700">
        <p className="text-4xl font-mono tracking-wider text-cyan-400">
          {currentTime.toLocaleTimeString('es-ES')}
        </p>
        <p className="text-gray-400 text-sm">
          {currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {isClockedIn && (
        <div className="text-center bg-gray-900/50 p-4 rounded-lg mb-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Tiempo de sesión actual</p>
            <p className="text-3xl font-mono tracking-wider text-amber-400">
                {formatDuration(runningDuration)}
            </p>
        </div>
      )}

      <div className="flex-grow flex flex-col justify-end">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Añadir una nota (opcional)..."
          className="w-full p-3 mb-4 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          rows={3}
        />
        <button
          onClick={handleSubmit}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-bold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 ${buttonClass}`}
        >
          <ClockIcon className="h-6 w-6" />
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default TimeTracker;
