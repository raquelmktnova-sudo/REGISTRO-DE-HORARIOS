export interface User {
  username: string;
  role: 'boss' | 'worker';
}

export interface TimeLog {
  id: string;
  clockIn: string; // ISO string
  clockOut?: string; // ISO string
  notesIn?: string;
  notesOut?: string;
}
