import { JournalEntry } from '../../features/calendar/models/entry_model';
import { parseDateKey, formatDateKey } from './date_utils';

const NOTIF_STORAGE_KEY = 'calendo_notifications_enabled';

export function isNotificationEnabled(): boolean {
  try {
    return localStorage.getItem(NOTIF_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function setNotificationEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch (e) {
    // Ignored
  }
}

export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }
  return false;
}

export function sendBrowserPushNotification(title: string, body: string): void {
  if (!isNotificationEnabled()) return;

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } catch (err) {
      console.warn('Browser notification error:', err);
    }
  }
}

/**
 * Checks for 1-year anniversaries and special reminders among favorited entries.
 * Only triggers if notifications are enabled AND entry.is_favorite is true.
 */
export function checkAnniversariesForToday(entries: JournalEntry[]): {
  isAnniversary: boolean;
  entry: JournalEntry | null;
  yearsAgo: number;
  message: string;
} | null {
  if (!isNotificationEnabled()) return null;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  for (const entry of entries) {
    // ONLY check favorited entries
    if (!entry.is_favorite) continue;

    const { year: eYear, month: eMonth, day: eDay } = parseDateKey(entry.date_key);

    // Check same month & day from a previous year (1-year anniversary, 2-year anniversary, etc.)
    if (eMonth === currentMonth && eDay === currentDay && eYear < currentYear) {
      const yearsAgo = currentYear - eYear;
      const yrText = yearsAgo === 1 ? '1 Year' : `${yearsAgo} Years`;
      return {
        isAnniversary: true,
        entry,
        yearsAgo,
        message: `🎉 Happy ${yrText} Anniversary! Locked Memory: “${entry.journal_note || 'Special Favorited Moment'}”`,
      };
    }
  }

  return null;
}
