export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

export function formatSchedule(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const date = startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const startTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return `${date}, ${startTime} - ${endTime}`;
}

export type ClassData = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  startTimestamp: string;
  endTimestamp: string;
  currentSignups: number;
  totalSeats: number;
};