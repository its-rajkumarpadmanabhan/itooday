import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MonthHeader } from './widgets/MonthHeader';
import { CalendarCell } from './widgets/CalendarCell';
import { QuickSwitchBottomBar } from './widgets/QuickSwitchBottomBar';
import { MonthPickerModal } from './widgets/MonthPickerModal';
import { YearMatrixModal } from './widgets/YearMatrixModal';
import { ExportModal } from './widgets/ExportModal';
import { FavoritesModal } from './widgets/FavoritesModal';
import { NotificationSettingsModal } from './widgets/NotificationSettingsModal';
import { DayDetailModal } from '../../editor/views/DayDetailModal';
import { ThemePickerModal } from './widgets/ThemePickerModal';
import { AboutModal } from './widgets/AboutModal';
import { NotificationToast, ToastMessage } from './widgets/NotificationToast';
import { CalendarDay } from '../models/calendar_day_model';
import { JournalEntry } from '../models/entry_model';
import {
  generateMonthMatrix,
  getDaysInMonth,
  formatDateKey,
  parseDateKey,
  WEEKDAYS_SUNDAY_START,
  MONTH_NAMES,
} from '../../../core/utils/date_utils';
import { appDatabase } from '../../../core/database/app_database';
import { getSavedTheme, getSavedThemeMode, applyTheme } from '../../../core/utils/theme_manager';
import {
  isNotificationEnabled,
  checkAnniversariesForToday,
  sendBrowserPushNotification,
} from '../../../core/utils/notification_manager';
import confetti from 'canvas-confetti';

export const CalendarScreen: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1); // 1-12
  const [entriesMap, setEntriesMap] = useState<Map<string, JournalEntry>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTheme, setCurrentTheme] = useState<string>(getSavedTheme());
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(isNotificationEnabled());

  // Modals state
  const [activeDayModal, setActiveDayModal] = useState<CalendarDay | null>(null);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState<boolean>(false);
  const [isYearMatrixOpen, setIsYearMatrixOpen] = useState<boolean>(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<ToastMessage | null>(null);

  // Initialize and apply saved theme and mode
  useEffect(() => {
    const savedColor = getSavedTheme();
    const savedMode = getSavedThemeMode();
    setCurrentTheme(savedColor);
    applyTheme(savedColor, savedMode);
  }, []);

  // Load entries from Database
  const loadEntries = useCallback(async () => {
    try {
      const entries = await appDatabase.getAllEntries();
      const map = new Map<string, JournalEntry>();
      for (const entry of entries) {
        map.set(entry.date_key, entry);
      }
      setEntriesMap(map);

      // Check for 1-Year / Multi-Year Anniversaries on favorited entries
      const anniversary = checkAnniversariesForToday(entries);
      if (anniversary && anniversary.isAnniversary && anniversary.entry) {
        setActiveToast({
          id: `anniversary_${anniversary.entry.id}_${Date.now()}`,
          type: 'today_event',
          title: `🎉 ${anniversary.yearsAgo}-Year Anniversary Reminder!`,
          message: anniversary.message,
          caption: anniversary.entry.journal_note || 'Favorited Anniversary Memory',
          dateStr: 'Today',
        });
        sendBrowserPushNotification(
          `🎉 ${anniversary.yearsAgo}-Year Anniversary Alert`,
          anniversary.message
        );
        confetti({ particleCount: 70, spread: 80 });
      } else {
        // Check if today has a special journal caption to remind the user
        const todayKey = formatDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate());
        const todayEntry = map.get(todayKey);
        if (todayEntry?.journal_note && isNotificationEnabled() && todayEntry.is_favorite) {
          setActiveToast({
            id: `today_${todayKey}`,
            type: 'today_event',
            title: "✨ Today's Favorite Reminder",
            message: "Here is your favorited reminder for today:",
            caption: todayEntry.journal_note,
            dateStr: "Today",
          });
        }
      }
    } catch (err) {
      console.error('Error loading entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [today]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Dynamic month matrix calculations
  const monthMatrix = useMemo(() => {
    return generateMonthMatrix(currentYear, currentMonth, entriesMap, false);
  }, [currentYear, currentMonth, entriesMap]);

  // Total days and filled photo/sticker days in the current viewing month
  const totalDaysInMonth = useMemo(() => {
    return getDaysInMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const filledDaysInMonth = useMemo(() => {
    let count = 0;
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const k = formatDateKey(currentYear, currentMonth, d);
      const entry = entriesMap.get(k);
      if (entry?.image_path) {
        count++;
      }
    }
    return count;
  }, [currentYear, currentMonth, totalDaysInMonth, entriesMap]);

  // Total favorites count with photos
  const totalFavoritesCount = useMemo(() => {
    let count = 0;
    entriesMap.forEach((entry) => {
      if (entry.is_favorite && entry.image_path) count++;
    });
    return count;
  }, [entriesMap]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
    const todayKey = formatDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const day = monthMatrix.days.find((d) => d.date_key === todayKey);
    if (day) {
      setActiveDayModal(day);
    }
  };

  const handleAddToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
    const todayKey = formatDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const day = monthMatrix.days.find((d) => d.date_key === todayKey) || {
      date: now,
      date_key: todayKey,
      dayNumber: now.getDate(),
      isCurrentMonth: true,
      isToday: true,
      isFuture: false,
      entry: entriesMap.get(todayKey),
    };
    setActiveDayModal(day);
  };

  const handleSelectDayFromFavorites = (dateKey: string) => {
    const { year, month, day } = parseDateKey(dateKey);
    setCurrentYear(year);
    setCurrentMonth(month);
    const d = new Date(year, month - 1, day);
    setActiveDayModal({
      date: d,
      date_key: dateKey,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateKey === formatDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate()),
      isFuture: d > today,
      entry: entriesMap.get(dateKey),
    });
  };

  // Entry CRUD handlers
  const handleSaveEntry = async (entry: JournalEntry) => {
    const prevEntry = entriesMap.get(entry.date_key);
    await appDatabase.saveEntry(entry);
    await loadEntries();

    const { year: eYear, month: eMonth, day: eDay } = parseDateKey(entry.date_key);
    const entryDate = new Date(eYear, eMonth - 1, eDay);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // 1. Check if user added a photo/entry for an UPCOMING / FUTURE date
    // NOTE: Notifications only trigger if notifications are ENABLED and entry is marked as FAVORITE
    if (entryDate > todayMidnight && isNotificationEnabled() && entry.is_favorite) {
      const formattedDate = entryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      setActiveToast({
        id: `upcoming_${entry.id}_${Date.now()}`,
        type: 'upcoming_reminder',
        title: '🗓️ Upcoming Favorite Scheduled',
        message: `Your favorite photo & caption have been locked for ${formattedDate}:`,
        caption: entry.journal_note || 'Favorited upcoming memory',
        dateStr: formattedDate,
      });

      sendBrowserPushNotification(
        '🗓️ Calendo Future Memory Locked',
        `Scheduled for ${formattedDate}: “${entry.journal_note || 'Favorite Memory'}”`
      );

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.2 },
        colors: ['#FF5E62', '#FF9966', '#FFD60A'],
      });
    }

    // 2. Check if the month is 100% completed with full images (day/day)
    let newFilledCount = 0;
    const daysInTargetMonth = getDaysInMonth(eYear, eMonth);
    for (let d = 1; d <= daysInTargetMonth; d++) {
      const k = formatDateKey(eYear, eMonth, d);
      if (k === entry.date_key) {
        if (entry.image_path) newFilledCount++;
      } else {
        const existing = entriesMap.get(k);
        if (existing?.image_path) newFilledCount++;
      }
    }

    if (newFilledCount >= daysInTargetMonth && (!prevEntry?.image_path || filledDaysInMonth < totalDaysInMonth)) {
      // Trigger Congrats celebration notification
      const monthName = MONTH_NAMES[eMonth - 1];
      setActiveToast({
        id: `congrats_${eYear}_${eMonth}_${Date.now()}`,
        type: 'congrats',
        title: `🏆 Congratulations! Full Month Completed!`,
        message: `Incredible! You have documented all ${daysInTargetMonth}/${daysInTargetMonth} days in ${monthName} ${eYear} with photos & stickers!`,
        dateStr: `${monthName} ${eYear}`,
      });

      // Massive confetti shower
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.3 },
      });
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    await appDatabase.deleteEntry(entryId);
    await loadEntries();
  };

  const handleToggleFavorite = async (day: CalendarDay) => {
    const existing = entriesMap.get(day.date_key);
    if (existing) {
      const updated: JournalEntry = {
        ...existing,
        is_favorite: !existing.is_favorite,
        updated_at: new Date().toISOString(),
      };
      await appDatabase.saveEntry(updated);
    } else {
      // Create lightweight entry with is_favorite = true
      const newEntry: JournalEntry = {
        id: `entry_${day.date_key}`,
        date_key: day.date_key,
        year: day.date.getFullYear(),
        month: day.date.getMonth() + 1,
        day: day.date.getDate(),
        image_scale: 1.0,
        image_rotation: 0,
        image_offset_x: 0,
        image_offset_y: 0,
        is_favorite: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await appDatabase.saveEntry(newEntry);
    }
    await loadEntries();
  };

  const isCurrentMonthView =
    currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1;

  return (
    <div className="calendo-container">
      {/* Floating Notification Toast */}
      <NotificationToast
        toast={activeToast}
        onClose={() => setActiveToast(null)}
      />

      {/* Month & Year Navigation Header with day/day Tracker */}
      <MonthHeader
        year={currentYear}
        month={currentMonth}
        filledDays={filledDaysInMonth}
        totalDays={totalDaysInMonth}
        notificationsEnabled={notificationsEnabled}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onOpenMonthPicker={() => setIsMonthPickerOpen(true)}
        onOpenYearMatrix={() => setIsYearMatrixOpen(true)}
        onOpenThemePicker={() => setIsThemePickerOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
      />

      {/* Weekdays Row */}
      <div className="weekday-grid">
        {WEEKDAYS_SUNDAY_START.map((day) => (
          <div key={day} className="weekday-cell">
            {day}
          </div>
        ))}
      </div>

      {/* 7-Column Dynamic Month Matrix */}
      <main className="calendar-grid">
        {monthMatrix.days.map((day) => (
          <CalendarCell
            key={day.date_key}
            day={day}
            onClick={(d) => setActiveDayModal(d)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </main>

      {/* Floating Bottom Action Bar with Favorites Button */}
      <QuickSwitchBottomBar
        isCurrentMonthView={isCurrentMonthView}
        favoritesCount={totalFavoritesCount}
        onJumpToToday={handleJumpToToday}
        onAddToday={handleAddToday}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Day Detail & Sticker Editor Modal */}
      {activeDayModal && (
        <DayDetailModal
          day={{
            ...activeDayModal,
            entry: entriesMap.get(activeDayModal.date_key),
          }}
          onClose={() => setActiveDayModal(null)}
          onSave={handleSaveEntry}
          onDelete={handleDeleteEntry}
        />
      )}

      {/* Favorites Gallery Modal (Grouped in order of Month) */}
      {isFavoritesOpen && (
        <FavoritesModal
          entriesMap={entriesMap}
          onSelectDay={handleSelectDayFromFavorites}
          onToggleFavorite={(entry) =>
            handleToggleFavorite({
              date: new Date(entry.year, entry.month - 1, entry.day),
              date_key: entry.date_key,
              dayNumber: entry.day,
              isCurrentMonth: true,
              isToday: false,
              isFuture: false,
              entry,
            })
          }
          onClose={() => setIsFavoritesOpen(false)}
        />
      )}

      {/* Notification Settings Modal */}
      {isNotificationsModalOpen && (
        <NotificationSettingsModal
          onClose={() => setIsNotificationsModalOpen(false)}
          onNotificationToggled={(enabled) => setNotificationsEnabled(enabled)}
        />
      )}

      {/* Theme Palette Color Picker Modal */}
      {isThemePickerOpen && (
        <ThemePickerModal
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          onClose={() => setIsThemePickerOpen(false)}
        />
      )}

      {/* Month/Year Wheel Picker Modal */}
      {isMonthPickerOpen && (
        <MonthPickerModal
          currentYear={currentYear}
          currentMonth={currentMonth}
          onSelect={(y, m) => {
            setCurrentYear(y);
            setCurrentMonth(m);
          }}
          onClose={() => setIsMonthPickerOpen(false)}
        />
      )}

      {/* 12-Month Year Mosaic Modal */}
      {isYearMatrixOpen && (
        <YearMatrixModal
          year={currentYear}
          entriesMap={entriesMap}
          onSelectMonth={(m) => {
            setCurrentMonth(m);
            setIsYearMatrixOpen(false);
          }}
          onClose={() => setIsYearMatrixOpen(false)}
        />
      )}

      {/* Export & SQLite Persistence Modal */}
      {isExportOpen && (
        <ExportModal
          currentYear={currentYear}
          currentMonth={currentMonth}
          entriesMap={entriesMap}
          onClose={() => setIsExportOpen(false)}
          onDataChanged={loadEntries}
        />
      )}

      {/* About Calendo Modal */}
      {isAboutOpen && (
        <AboutModal
          onClose={() => setIsAboutOpen(false)}
        />
      )}
    </div>
  );
};
