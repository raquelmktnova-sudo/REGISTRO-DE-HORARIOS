
import React, { useState, useMemo } from 'react';
import { TimeLog } from '../types';
import { formatDateTime, formatDate, formatDuration, getDuration } from '../utils/date';
import { ChevronDownIcon } from './icons';

interface HistoryProps {
  timeLogs: TimeLog[];
}

interface GroupedLog {
  date: string;
  formattedDate: string;
  totalDuration: number;
  logs: TimeLog[];
}

const History: React.FC<HistoryProps> = ({ timeLogs }) => {
  const [openDay, setOpenDay] = useState<string | null>(null);

  const groupedLogs = useMemo<GroupedLog[]>(() => {
    const groups: { [key: string]: GroupedLog } = {};

    timeLogs.forEach(log => {
      const date = new Date(log.clockIn).toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = {
          date: date,
          formattedDate: formatDate(log.clockIn),
          totalDuration: 0,
          logs: [],
        };
      }
      groups[date].logs.push(log);
      if (log.clockOut) {
        groups[date].totalDuration += getDuration(log.clockIn, log.clockOut);
      }
    });

    return Object.values(groups).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [timeLogs]);
  
  const toggleDay = (date: string) => {
      setOpenDay(openDay === date ? null : date);
  };
  
  if (timeLogs.length === 0) {
      return (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 h-full flex items-center justify-center">
              <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Historial de Fichajes</h2>
                  <p className="text-gray-400">Aún no hay registros. ¡Ficha tu primera entrada para empezar!</p>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Historial de Fichajes</h2>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {groupedLogs.map(group => (
          <div key={group.date} className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleDay(group.date)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-700/50 transition-colors"
            >
              <div>
                <p className="font-semibold text-white">{group.formattedDate}</p>
                <p className="text-sm text-gray-400">Total trabajado: <span className="font-mono text-cyan-400">{formatDuration(group.totalDuration)}</span></p>
              </div>
              <ChevronDownIcon className={`h-6 w-6 text-gray-400 transition-transform ${openDay === group.date ? 'rotate-180' : ''}`} />
            </button>
            {openDay === group.date && (
              <div className="p-4 border-t border-gray-700">
                <ul className="space-y-4">
                  {group.logs.sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime()).map(log => (
                    <li key={log.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-gray-800 rounded-md">
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2">
                                <span className="text-green-400 font-bold">IN:</span>
                                <span className="font-mono">{formatDateTime(log.clockIn)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {log.clockOut ? (
                                    <>
                                        <span className="text-red-400 font-bold">OUT:</span>
                                        <span className="font-mono">{formatDateTime(log.clockOut)}</span>
                                    </>
                                ) : (
                                    <span className="text-yellow-400 text-sm">Sesión activa</span>
                                )}
                            </div>
                            {log.clockOut && <div className="font-mono text-amber-400 mt-1">{formatDuration(getDuration(log.clockIn, log.clockOut))}</div>}
                        </div>
                        <div className="md:col-span-2 text-sm text-gray-300 space-y-1">
                            {log.notesIn && <p><strong className="text-green-400">Nota entrada:</strong> {log.notesIn}</p>}
                            {log.notesOut && <p><strong className="text-red-400">Nota salida:</strong> {log.notesOut}</p>}
                        </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
