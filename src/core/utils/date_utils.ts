import { CalendarDay, MonthMatrixData } from '../../features/calendar/models/calendar_day_model';
import { JournalEntry } from '../../features/calendar/models/entry_model';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAYS_SUNDAY_START = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_MONDAY_START = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function parseDateKey(dateKey: string): { year: number; month: number; day: number } {
  const [y, m, d] = dateKey.split('-').map(Number);
  return { year: y, month: m, day: d };
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  // month: 1-12
  return new Date(year, month, 0).getDate();
}

export function generateMonthMatrix(
  year: number,
  month: number, // 1-12
  entriesMap: Map<string, JournalEntry>,
  startOnMonday: boolean = false
): MonthMatrixData {
  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayDate = new Date(year, month - 1, 1);
  let firstDayIndex = firstDayDate.getDay(); // 0 = Sunday, 1 = Monday...

  if (startOnMonday) {
    firstDayIndex = (firstDayIndex + 6) % 7;
  }

  // Previous month padding
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const days: CalendarDay[] = [];

  // Add previous month days (leading padding)
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const dateKey = formatDateKey(prevYear, prevMonth, dayNum);
    const date = new Date(prevYear, prevMonth - 1, dayNum);
    days.push({
      date,
      date_key: dateKey,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      isFuture: date > today,
      entry: entriesMap.get(dateKey)
    });
  }

  // Add current month days
  let totalEntries = 0;
  let totalTasks = 0;
  let completedTasks = 0;

  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateKey = formatDateKey(year, month, d);
    const date = new Date(year, month - 1, d);
    const entry = entriesMap.get(dateKey);
    
    if (entry) {
      totalEntries++;
      if (entry.tasks && entry.tasks.length > 0) {
        totalTasks += entry.tasks.length;
        completedTasks += entry.tasks.filter(t => !!t.is_completed).length;
      }
    }

    days.push({
      date,
      date_key: dateKey,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
      isFuture: date > today,
      entry
    });
  }

  // Add next month days (trailing padding to complete full 7-column grid rows)
  const remainingCells = (7 - (days.length % 7)) % 7;
  // If we want consistent 5 or 6 rows (e.g., minimum 35 or 42 cells)
  const targetTotal = days.length + remainingCells < 35 ? 35 : (days.length + remainingCells < 42 ? 42 : days.length + remainingCells);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  let nextDayNum = 1;
  while (days.length < targetTotal) {
    const dateKey = formatDateKey(nextYear, nextMonth, nextDayNum);
    const date = new Date(nextYear, nextMonth - 1, nextDayNum);
    days.push({
      date,
      date_key: dateKey,
      dayNumber: nextDayNum,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      isFuture: date > today,
      entry: entriesMap.get(dateKey)
    });
    nextDayNum++;
  }

  return {
    year,
    month,
    monthName: MONTH_NAMES[month - 1],
    days,
    totalEntries,
    totalTasks,
    completedTasks
  };
}

export function calculateCurrentStreak(entriesMap: Map<string, JournalEntry>): number {
  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Check if today has entry; if not, check from yesterday
  const todayKey = formatDateKey(checkDate.getFullYear(), checkDate.getMonth() + 1, checkDate.getDate());
  if (!entriesMap.has(todayKey) || !entriesMap.get(todayKey)?.image_path) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const key = formatDateKey(checkDate.getFullYear(), checkDate.getMonth() + 1, checkDate.getDate());
    const entry = entriesMap.get(key);
    if (entry && (entry.image_path || (entry.tasks && entry.tasks.length > 0) || entry.journal_note)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
