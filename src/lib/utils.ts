export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h} giờ`;
  return `${h}h ${m}p`;
}

export function formatMinutes(minutes: number): string {
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatTimerDisplay(totalSeconds: number): { minutes: string; seconds: string } {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return {
    minutes: String(mins).padStart(2, '0'),
    seconds: String(secs).padStart(2, '0'),
  };
}

export function getProgressPercentage(logged: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, (logged / target) * 100);
}

export function getSkillStatus(logged: number, target: number): 'not-started' | 'in-progress' | 'completed' {
  if (logged <= 0) return 'not-started';
  if (logged >= target) return 'completed';
  return 'in-progress';
}

export const SKILL_COLORS = [
  '#f43f5e', // Swiss vermilion
  '#2563eb', // International blue
  '#059669', // Precision emerald
  '#d97706', // Swiss amber
  '#7c3aed', // Deep violet
  '#0891b2', // Cyan slate
  '#e11d48', // Crimson
  '#475569', // Graphite
];
