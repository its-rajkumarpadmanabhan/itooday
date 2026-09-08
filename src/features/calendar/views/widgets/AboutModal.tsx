import React from 'react';
import { X, Sparkles, Heart, Camera, Calendar, Palette, FileText, Instagram, ShieldCheck, User, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CalendoLogo } from '../../../common/components/CalendoLogo';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const handleInstagramClick = () => {
    confetti({
      particleCount: 35,
      spread: 50,
      colors: ['#E1306C', '#F77737', '#833AB4', '#FFDC80'],
      origin: { y: 0.6 },
    });
    window.open('https://www.instagram.com/i.rajkumar__/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-card"
        style={{ maxWidth: '520px', borderRadius: '26px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="detail-header" style={{ padding: '18px 22px' }}>
          <div className="detail-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CalendoLogo size={28} />
              <h2 className="detail-date-title" style={{ fontSize: '20px' }}>About Calendo</h2>
            </div>
            <span className="detail-date-subtitle">Your Visual Life Journal & Memory Mosaic</span>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close about modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="detail-body" style={{ padding: '22px', gap: '20px' }}>
          {/* Hero Banner Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 94, 98, 0.15), rgba(168, 85, 247, 0.15))',
              border: '1px solid var(--modal-border)',
              borderRadius: '20px',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <CalendoLogo size={60} style={{ flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Calendo • Living Memories 📸
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                A tactile visual diary where every date becomes a canvas for your photos, stickers, emojis, mood vibes, and micro-tasks.
              </p>
            </div>
          </div>

          {/* Core Concepts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ✨ Why & How to Use
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              {/* Feature 1 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: 'var(--tile-surface)',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  border: '1px solid var(--modal-border)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255, 94, 98, 0.12)',
                    padding: '8px',
                    borderRadius: '12px',
                    color: 'var(--accent-coral)',
                    flexShrink: 0,
                  }}
                >
                  <Camera size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Add Photos, Stickers & Emojis
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                    Click any day on the calendar to upload high-quality photos or pick from 60+ vector stickers and colorful emojis.
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: 'var(--tile-surface)',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  border: '1px solid var(--modal-border)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255, 45, 85, 0.12)',
                    padding: '8px',
                    borderRadius: '12px',
                    color: '#FF2D55',
                    flexShrink: 0,
                  }}
                >
                  <Heart size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Double-Click to Favorite
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                    Double-tap any calendar square to mark it as a favorite with an animated heart burst pop effect.
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: 'var(--tile-surface)',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  border: '1px solid var(--modal-border)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    padding: '8px',
                    borderRadius: '12px',
                    color: '#38BDF8',
                    flexShrink: 0,
                  }}
                >
                  <Palette size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Light & Dark Themes + Color Accents
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                    Switch effortlessly between crisp daylight and sleek dark modes, with 12 curated palettes or your own custom shade.
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: 'var(--tile-surface)',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  border: '1px solid var(--modal-border)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(48, 209, 88, 0.12)',
                    padding: '8px',
                    borderRadius: '12px',
                    color: '#30D158',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Printable PDF Document Export
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                    Export a high-resolution printable PDF of any individual month or the entire 12-month year directly to your device.
                  </div>
                </div>
              </div>

              {/* Feature 5: Mobile App & APK Install */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: 'var(--tile-surface)',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  border: '1px solid var(--modal-border)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    padding: '8px',
                    borderRadius: '12px',
                    color: '#38BDF8',
                    flexShrink: 0,
                  }}
                >
                  <Smartphone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Install on Phone / Android APK
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                    Install directly on your phone using the compiled <strong>calendo.apk</strong> or tap <em>"Add to Home Screen"</em> in your mobile browser.
                  </div>
                </div>
              </div>

              {/* Feature 6: 100% Private & Sandboxed Multi-User Security */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  backgroundColor: 'var(--tile-surface)',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  border: '1px solid var(--modal-border)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255, 214, 10, 0.12)',
                    padding: '8px',
                    borderRadius: '12px',
                    color: '#FFD60A',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    100% Private & Device-Isolated Storage 🔒
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                    All photos, diary notes, and memories are stored exclusively inside your device's private sandboxed database. No external servers, no tracking, and complete privacy between different users.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Author, Instagram & Copyright Section */}
          <div
            style={{
              backgroundColor: 'var(--tile-surface)',
              border: '1px solid var(--modal-border)',
              borderRadius: '20px',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={17} color="var(--accent-coral)" />
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Created & Designed By
                </span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-coral)' }}>
                R Rajkumar Padmanabhan
              </span>
            </div>

            {/* Instagram Link Card Button */}
            <button
              type="button"
              onClick={handleInstagramClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(225, 48, 108, 0.35)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              title="Connect on Instagram @i.rajkumar__"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Instagram size={20} color="#FFF" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', opacity: 0.9, fontWeight: 600 }}>Follow on Instagram</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.02em' }}>@i.rajkumar__</div>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '9999px' }}>
                Visit Profile ↗
              </span>
            </button>

            {/* Copyright Note */}
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-tertiary)',
                textAlign: 'center',
                paddingTop: '6px',
                borderTop: '1px solid var(--modal-border)',
                lineHeight: 1.4,
              }}
            >
              Copyright © {new Date().getFullYear()} <strong>R Rajkumar Padmanabhan</strong>. All rights reserved.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="detail-footer" style={{ padding: '14px 22px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
            style={{ padding: '8px 22px', fontSize: '13px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
