import React, { useState, useEffect, useMemo } from 'react';
import { User, TimeLog } from '../types';
import History from './History';

interface AdminDashboardProps {
    currentUser: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
    const [workers, setWorkers] = useState<User[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<string>('');
    const [workerLogs, setWorkerLogs] = useState<TimeLog[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth()); // 0-indexed

    useEffect(() => {
        try {
            const storedUsers = window.localStorage.getItem('users');
            if (storedUsers) {
                const allUsers: User[] = JSON.parse(storedUsers);
                const workerUsers = allUsers.filter(u => u.username !== currentUser.username && u.role === 'worker');
                setWorkers(workerUsers);
                if (workerUsers.length > 0 && !selectedWorker) {
                    setSelectedWorker(workerUsers[0].username);
                }
            }
        } catch (error) {
            console.error("Failed to load users:", error);
        }
    }, [currentUser.username, selectedWorker]);

    useEffect(() => {
        if (selectedWorker) {
            try {
                const storedLogs = window.localStorage.getItem(`time_logs_${selectedWorker}`);
                if (storedLogs) {
                    setWorkerLogs(JSON.parse(storedLogs));
                } else {
                    setWorkerLogs([]);
                }
            } catch (error) {
                console.error(`Failed to load logs for ${selectedWorker}:`, error);
                setWorkerLogs([]);
            }
        } else {
            setWorkerLogs([]);
        }
    }, [selectedWorker]);

    const filteredLogs = useMemo(() => {
        return workerLogs.filter(log => {
            const logDate = new Date(log.clockIn);
            return logDate.getFullYear() === selectedYear && logDate.getMonth() === selectedMonth;
        });
    }, [workerLogs, selectedYear, selectedMonth]);

    const years = useMemo(() => {
        const allYears = new Set(workerLogs.map(log => new Date(log.clockIn).getFullYear()));
        if (!allYears.has(currentDate.getFullYear())) {
            allYears.add(currentDate.getFullYear());
        }
        return Array.from(allYears).sort((a, b) => b - a);
    }, [workerLogs, currentDate]);

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">Panel de Supervisión</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="worker-select" className="block text-sm font-medium text-gray-300 mb-1">Trabajador</label>
                        <select
                            id="worker-select"
                            value={selectedWorker}
                            onChange={(e) => setSelectedWorker(e.target.value)}
                            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={workers.length === 0}
                        >
                             {workers.length === 0 ? (
                                <option>No hay trabajadores</option>
                            ) : (
                                <>
                                <option value="" disabled>Selecciona un trabajador</option>
                                {workers.map(worker => (
                                    <option key={worker.username} value={worker.username}>{worker.username}</option>
                                ))}
                                </>
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="year-select" className="block text-sm font-medium text-gray-300 mb-1">Año</label>
                        <select
                            id="year-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                             className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="month-select" className="block text-sm font-medium text-gray-300 mb-1">Mes</label>
                        <select
                            id="month-select"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {monthNames.map((name, index) => (
                                <option key={index} value={index}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {selectedWorker ? (
                <History timeLogs={filteredLogs} />
            ) : (
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 text-center">
                    <p className="text-gray-400">
                        {workers.length > 0 ? 'Por favor, selecciona un trabajador para ver su historial.' : 'No hay trabajadores para supervisar.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
