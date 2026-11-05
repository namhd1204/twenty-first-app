export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
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
  '#10b981', // emerald
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#14b8a6', // teal
];
