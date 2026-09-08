import React, { useEffect } from 'react';
import { Bell, Sparkles, Trophy, X, CalendarClock, PartyPopper } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'congrats' | 'upcoming_reminder' | 'today_event';
  title: string;
  message: string;
  caption?: string;
  dateStr?: string;
}

interface NotificationToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6500); // 6.5s auto dismiss
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="notification-toast-container" role="alert">
      <div className={`notification-toast-card ${toast.type}`}>
        <div className="toast-icon-wrapper">
          {toast.type === 'congrats' && <Trophy size={20} color="#FFD60A" />}
          {toast.type === 'upcoming_reminder' && <CalendarClock size={20} color="#FF5E62" />}
          {toast.type === 'today_event' && <PartyPopper size={20} color="#30D158" />}
        </div>

        <div className="toast-content-wrapper">
          <div className="toast-header-row">
            <span className="toast-title">{toast.title}</span>
            {toast.dateStr && <span className="toast-date">{toast.dateStr}</span>}
          </div>
          <p className="toast-message">{toast.message}</p>
          {toast.caption && (
            <div className="toast-caption-box">
              <span className="toast-quote">“{toast.caption}”</span>
            </div>
          )}
        </div>

        <button
          className="toast-close-btn"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
