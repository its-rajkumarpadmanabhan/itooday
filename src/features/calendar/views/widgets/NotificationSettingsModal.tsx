import React, { useState } from 'react';
import { X, Bell, BellOff, Heart, Check, Sparkles, CalendarClock, ShieldCheck } from 'lucide-react';
import {
  isNotificationEnabled,
  setNotificationEnabled,
  requestBrowserNotificationPermission,
  sendBrowserPushNotification,
} from '../../../../core/utils/notification_manager';

interface NotificationSettingsModalProps {
  onClose: () => void;
  onNotificationToggled: (enabled: boolean) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  onClose,
  onNotificationToggled,
}) => {
  const [enabled, setEnabled] = useState<boolean>(isNotificationEnabled());
  const [permissionState, setPermissionState] = useState<string>(
    'Notification' in window ? Notification.permission : 'default'
  );

  const handleToggle = async () => {
    const nextState = !enabled;
    if (nextState) {
      const granted = await requestBrowserNotificationPermission();
      setPermissionState('Notification' in window ? Notification.permission : 'default');
      setNotificationEnabled(true);
      setEnabled(true);
      onNotificationToggled(true);

      sendBrowserPushNotification(
        '🔔 Calendo Notifications Active',
        'You will receive anniversary & upcoming event reminders for your favorited memories!'
      );
    } else {
      setNotificationEnabled(false);
      setEnabled(false);
      onNotificationToggled(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-card"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="detail-header">
          <div className="detail-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--accent-coral)" />
              <h2 className="detail-date-title" style={{ fontSize: '18px' }}>
                Anniversary & Event Alerts
              </h2>
            </div>
            <span className="detail-date-subtitle">
              Notifications for favorited dates & 1-year anniversaries
            </span>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="detail-body" style={{ gap: '16px' }}>
          {/* Main Toggle Card */}
          <div
            style={{
              backgroundColor: '#181A20',
              border: enabled ? '1.5px solid var(--accent-coral)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: enabled ? 'rgba(255, 94, 98, 0.15)' : '#24272E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {enabled ? <Bell size={20} color="var(--accent-coral)" /> : <BellOff size={20} color="#8E8E93" />}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>
                  {enabled ? 'Notifications Enabled' : 'Notifications Disabled'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {enabled ? 'Active for favorited dates' : 'Turn on to get future reminders'}
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={handleToggle}
              style={{
                width: '52px',
                height: '30px',
                borderRadius: '9999px',
                backgroundColor: enabled ? 'var(--accent-coral)' : '#2C2C2E',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                padding: '3px',
              }}
              aria-label="Toggle notifications"
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  transform: enabled ? 'translateX(22px)' : 'translateX(0px)',
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                }}
              />
            </button>
          </div>

          {/* Rule Details */}
          <div
            style={{
              backgroundColor: '#111215',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Heart size={15} color="#FF2D55" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong style={{ color: '#FFF' }}>Favorites-Only Rule:</strong> You only receive upcoming event and anniversary alerts for entries you mark as a <strong style={{ color: '#FF2D55' }}>Favorite</strong>.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CalendarClock size={15} color="#FFD60A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong style={{ color: '#FFF' }}>1-Year Anniversary Reminders:</strong> For example, if you add a photo today for marriage/birthday and favorite it, exactly 1 year later you will receive your locked caption celebration!
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="detail-footer" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
