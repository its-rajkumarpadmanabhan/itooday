import React, { useState } from 'react';
import { X, Check, Palette, Sun, Moon } from 'lucide-react';
import { THEME_PALETTES, ThemeMode, applyTheme, getSavedThemeMode } from '../../../../core/utils/theme_manager';
import confetti from 'canvas-confetti';

interface ThemePickerModalProps {
  currentTheme: string;
  onThemeChange: (color: string) => void;
  onClose: () => void;
}

export const ThemePickerModal: React.FC<ThemePickerModalProps> = ({
  currentTheme,
  onThemeChange,
  onClose,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(currentTheme);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getSavedThemeMode());

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    applyTheme(color, themeMode);
    onThemeChange(color);

    confetti({
      particleCount: 25,
      spread: 45,
      colors: [color, themeMode === 'light' ? '#0F172A' : '#FFFFFF'],
      origin: { y: 0.6 },
    });
  };

  const handleToggleMode = (newMode: ThemeMode) => {
    setThemeMode(newMode);
    applyTheme(selectedColor, newMode);
    onThemeChange(selectedColor);

    confetti({
      particleCount: 20,
      spread: 40,
      colors: [selectedColor, newMode === 'light' ? '#FFD60A' : '#6366F1'],
      origin: { y: 0.6 },
    });
  };

  const handleCustomColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    applyTheme(color, themeMode);
    onThemeChange(color);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-card"
        style={{
          maxWidth: '400px',
          borderRadius: '24px',
          boxShadow: `0 24px 60px rgba(0, 0, 0, 0.5), 0 0 35px ${selectedColor}33`,
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="detail-header" style={{ padding: '16px 20px' }}>
          <div className="detail-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={18} color={selectedColor} />
              <h2 className="detail-date-title" style={{ fontSize: '18px' }}>Theme & Appearance</h2>
            </div>
            <span className="detail-date-subtitle">Customize light/dark mode & palette</span>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close theme picker">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="detail-body" style={{ padding: '20px', gap: '16px' }}>
          {/* Light / Dark Mode Segmented Switch */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Appearance Mode
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginTop: '8px',
                backgroundColor: themeMode === 'light' ? '#E2E8F0' : '#101115',
                padding: '4px',
                borderRadius: '16px',
                border: '1px solid var(--modal-border)',
              }}
            >
              <button
                type="button"
                onClick={() => handleToggleMode('dark')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: themeMode === 'dark' ? '#1E2228' : 'transparent',
                  color: themeMode === 'dark' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: themeMode === 'dark' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: themeMode === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                <Moon size={15} color={themeMode === 'dark' ? selectedColor : 'currentColor'} />
                <span>Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleMode('light')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: themeMode === 'light' ? '#FFFFFF' : 'transparent',
                  color: themeMode === 'light' ? '#0F172A' : 'var(--text-secondary)',
                  fontWeight: themeMode === 'light' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: themeMode === 'light' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                <Sun size={15} color={themeMode === 'light' ? '#F59E0B' : 'currentColor'} />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          {/* Color Accent Title */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Color Accent Palette
            </span>
          </div>

          {/* Square Box Color Palette Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}
          >
            {THEME_PALETTES.map((theme) => {
              const isSelected = selectedColor.toLowerCase() === theme.accent.toLowerCase();
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectColor(theme.accent)}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: '16px',
                    backgroundColor: theme.accent,
                    border: isSelected ? '3px solid #FFFFFF' : '2px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSelected ? `0 0 18px ${theme.accent}` : 'none',
                    transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  title={`${theme.name} (${theme.accent})`}
                >
                  {isSelected && (
                    <Check
                      size={20}
                      strokeWidth={3.5}
                      color={theme.accent === '#E2E8F0' || theme.accent === '#FFD60A' || theme.accent === '#00F0FF' ? '#000000' : '#FFFFFF'}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Hex Color Picker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: themeMode === 'light' ? '#F1F5F9' : '#181A20',
              padding: '10px 14px',
              borderRadius: '14px',
              border: '1px solid var(--modal-border)',
              marginTop: '4px',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Custom Shade:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="color"
                value={selectedColor}
                onChange={handleCustomColorInput}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                {selectedColor.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="detail-footer" style={{ padding: '12px 20px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
