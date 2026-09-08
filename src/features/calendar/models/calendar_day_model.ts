import { JournalEntry } from './entry_model';

export interface CalendarDay {
  date: Date;
  date_key: string;       // 'YYYY-MM-DD'
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  entry?: JournalEntry;
}

export interface MonthMatrixData {
  year: number;
  month: number;          // 0-11 for JS Date, 1-12 for display
  monthName: string;
  days: CalendarDay[];
  totalEntries: number;
  totalTasks: number;
  completedTasks: number;
}
