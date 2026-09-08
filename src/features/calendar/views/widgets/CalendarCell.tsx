import React, { useState, useRef } from 'react';
import { Plus, Heart } from 'lucide-react';
import { CalendarDay } from '../../models/calendar_day_model';
import confetti from 'canvas-confetti';

interface CalendarCellProps {
  day: CalendarDay;
  isSelected?: boolean;
  onClick: (day: CalendarDay) => void;
  onToggleFavorite: (day: CalendarDay) => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  day,
  isSelected,
  onClick,
  onToggleFavorite,
}) => {
  const { entry, isCurrentMonth, isToday, dayNumber } = day;
  const isFavorite = !!entry?.is_favorite;

  const [heartAnim, setHeartAnim] = useState<'burst' | 'unburst' | null>(null);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasPhotoOrSticker = !!entry?.image_path;
  const isSticker = entry?.is_sticker_cutout ?? true;
  const scale = entry?.image_scale ?? 1.0;
  const rotation = entry?.image_rotation ?? 0;
  const offsetX = entry?.image_offset_x ?? 0;
  const offsetY = entry?.image_offset_y ?? 0;

  const tasks = entry?.tasks || [];
  const displayTasks = tasks.slice(0, 2); // Show up to 2 micro-tasks

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger heart burst animation
    const willBeFavorite = !isFavorite;
    setHeartAnim(willBeFavorite ? 'burst' : 'unburst');
    setTimeout(() => setHeartAnim(null), 800);

    if (willBeFavorite) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        colors: ['#FF2D55', '#FF3B30', '#FF9500'],
      });
    }

    onToggleFavorite(day);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(day);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleHeartClick(e);
  };

  return (
    <div
      className={`calendar-cell ${!isCurrentMonth ? 'outside-month' : ''} ${
        isToday ? 'is-today' : ''
      } ${isSelected ? 'active-selected' : ''} ${hasPhotoOrSticker ? 'has-image' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      role="button"
      tabIndex={0}
      aria-label={`Date ${day.date_key}${isFavorite ? ' (Favorited)' : ''}`}
    >
      {/* Pinned Top-Left Date Badge */}
      <span className={`cell-date-badge ${isToday ? 'is-today-badge' : ''}`}>
        {dayNumber}
      </span>

      {/* Top-Right Mood & Favorite Badges */}
      <div className="cell-indicators">
        {isFavorite && (
          <span
            className="cell-favorite-badge"
            title="Favorited Entry"
            onClick={handleHeartClick}
            role="button"
            tabIndex={0}
          >
            <Heart size={13} fill="#FF3B30" color="#FF3B30" />
          </span>
        )}
        {entry?.mood_emoji && (
          <span className="cell-mood-badge">{entry.mood_emoji}</span>
        )}
      </div>

      {/* Heart Burst Animated Overlay */}
      {heartAnim === 'burst' && (
        <div className="cell-heart-burst">
          <Heart size={54} fill="#FF2D55" color="#FF2D55" />
        </div>
      )}
      {heartAnim === 'unburst' && (
        <div className="cell-heart-unburst">
          <Heart size={44} color="#8E8E93" />
        </div>
      )}

      {/* Center Visual: Sticker or Full Photo */}
      {hasPhotoOrSticker ? (
        <div className="cell-visual-container">
          {isSticker ? (
            <img
              src={entry!.image_path}
              alt={`Sticker for day ${dayNumber}`}
              className="cell-sticker-img"
              style={{
                transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale}) rotate(${rotation}deg)`,
              }}
            />
          ) : (
            <div
              className="cell-photo-wrapper"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              {/* Soft ambient background fill */}
              <img
                src={entry!.image_path}
                alt=""
                className="cell-photo-ambient-blur"
                aria-hidden="true"
              />
              {/* Full uncropped photo */}
              <img
                src={entry!.image_path}
                alt={`Photo for day ${dayNumber}`}
                className="cell-full-photo"
              />
              <div className="cell-photo-overlay" />
            </div>
          )}
        </div>
      ) : (
        /* Empty Day Add Prompt */
        isCurrentMonth && (
          <div className="cell-empty-add">
            <div className="empty-add-icon">
              <Plus size={14} />
            </div>
          </div>
        )
      )}

      {/* Micro-Tasks Bullet Markers at Cell Bottom */}
      {tasks.length > 0 && (
        <div className="cell-micro-tasks">
          {displayTasks.map((task) => {
            const isDone = !!task.is_completed;
            return (
              <div
                key={task.id}
                className={`micro-task-bullet ${isDone ? 'is-done' : ''}`}
                title={task.content}
              >
                <div className={`task-dot ${isDone ? 'is-done' : ''}`} />
                <span>{task.content}</span>
              </div>
            );
          })}
          {tasks.length > 2 && (
            <div className="micro-task-bullet" style={{ fontSize: '7.5px', opacity: 0.7 }}>
              +{tasks.length - 2} more
            </div>
          )}
        </div>
      )}
    </div>
  );
};
