
export const formatDateTime = (isoString: string): string => {
  return new Date(isoString).toLocaleString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatDate = (isoString: string): string => {
    return new Date(isoString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
}

export const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 0) milliseconds = 0;

  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};

export const getDuration = (start: string, end?: string): number => {
  const startTime = new Date(start).getTime();
  const endTime = end ? new Date(end).getTime() : Date.now();
  return endTime - startTime;
};
