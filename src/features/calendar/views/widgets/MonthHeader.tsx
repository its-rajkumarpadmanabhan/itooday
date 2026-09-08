import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Grid3X3, Image as ImageIcon, Trophy, Palette, Bell } from 'lucide-react';
import { MONTH_NAMES } from '../../../../core/utils/date_utils';
import { CalendoLogo } from '../../../common/components/CalendoLogo';

interface MonthHeaderProps {
  year: number;
  month: number;
  filledDays: number;
  totalDays: number;
  notificationsEnabled: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onOpenMonthPicker: () => void;
  onOpenYearMatrix: () => void;
  onOpenThemePicker: () => void;
  onOpenNotifications: () => void;
}

export const MonthHeader: React.FC<MonthHeaderProps> = ({
  year,
  month,
  filledDays,
  totalDays,
  notificationsEnabled,
  onPrevMonth,
  onNextMonth,
  onOpenMonthPicker,
  onOpenYearMatrix,
  onOpenThemePicker,
  onOpenNotifications,
}) => {
  const monthName = MONTH_NAMES[month - 1];
  const isMonthComplete = totalDays > 0 && filledDays >= totalDays;

  return (
    <header className="month-header">
      {/* Month & Year Title with Quick Picker Dropdown & Calendo App Logo */}
      <div className="month-title-wrap" onClick={onOpenMonthPicker} role="button" tabIndex={0} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <CalendoLogo size={36} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <h1 className="month-title">{monthName}</h1>
          <span className="year-badge">{year}</span>
          <ChevronDown size={18} className="month-dropdown-caret" />
        </div>
      </div>

      {/* Action Controls: Day/Day Tracker, Notifications, Theme Picker, Year Matrix, Month Prev/Next */}
      <div className="header-actions">
        {/* day/day Month Completion Tracker */}
        <div
          className={`month-progress-pill ${isMonthComplete ? 'completed' : ''}`}
          title={isMonthComplete ? 'All days in this month documented!' : `${filledDays} of ${totalDays} days documented`}
        >
          {isMonthComplete ? (
            <>
              <Trophy size={14} color="#000000" />
              <span>{filledDays}/{totalDays} Complete 🎉</span>
            </>
          ) : (
            <>
              <ImageIcon size={14} color="var(--accent-coral)" />
              <span>{filledDays}/{totalDays} days</span>
            </>
          )}
        </div>

        {/* Notification Settings Toggle Button */}
        <button
          className="icon-button"
          onClick={onOpenNotifications}
          title={notificationsEnabled ? 'Anniversary Notifications Active' : 'Enable Anniversary Notifications'}
          aria-label="Notification Settings"
        >
          <Bell size={17} color={notificationsEnabled ? '#FFD60A' : 'var(--text-secondary)'} />
        </button>

        {/* Theme Palette Button */}
        <button
          className="icon-button"
          onClick={onOpenThemePicker}
          title="Change Theme Color"
          aria-label="Change Theme Color"
        >
          <Palette size={17} color="var(--accent-coral)" />
        </button>

        {/* Year Matrix */}
        <button
          className="icon-button"
          onClick={onOpenYearMatrix}
          title="Year Mosaic Matrix"
          aria-label="Year Mosaic Matrix"
        >
          <Grid3X3 size={17} />
        </button>

        {/* Month Navigation */}
        <button
          className="icon-button"
          onClick={onPrevMonth}
          title="Previous Month"
          aria-label="Previous Month"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          className="icon-button"
          onClick={onNextMonth}
          title="Next Month"
          aria-label="Next Month"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </header>
  );
};
