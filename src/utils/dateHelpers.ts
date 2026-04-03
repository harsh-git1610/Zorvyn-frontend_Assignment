import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO, getDay } from 'date-fns';

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy');
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM');
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMM yyyy');
}

export function formatMonthShort(date: Date): string {
  return format(date, 'MMM');
}

export function getLast6Months(): Date[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => subMonths(now, 5 - i));
}

export function getMonthRange(date: Date): { start: Date; end: Date } {
  return { start: startOfMonth(date), end: endOfMonth(date) };
}

export function isInMonth(dateStr: string, month: Date): boolean {
  const { start, end } = getMonthRange(month);
  return isWithinInterval(parseISO(dateStr), { start, end });
}

export function getDayOfWeek(dateStr: string): number {
  return getDay(parseISO(dateStr));
}

export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getCurrentMonth(): Date {
  return startOfMonth(new Date());
}

export function getLastMonth(): Date {
  return startOfMonth(subMonths(new Date(), 1));
}
