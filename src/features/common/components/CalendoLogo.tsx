import React from 'react';

interface CalendoLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CalendoLogo: React.FC<CalendoLogoProps> = ({
  size = 32,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`calendo-app-logo ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderRadius: `${Math.round(size * 0.22)}px`,
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        ...style,
      }}
    >
      <img
        src="/calendo-icon.svg"
        alt="Calendo App Logo"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};
