import React from 'react';
import { Calendar, PlusCircle, Download, Heart, Info } from 'lucide-react';

interface QuickSwitchBottomBarProps {
  isCurrentMonthView: boolean;
  favoritesCount: number;
  onJumpToToday: () => void;
  onAddToday: () => void;
  onOpenFavorites: () => void;
  onOpenExport: () => void;
  onOpenAbout: () => void;
}

export const QuickSwitchBottomBar: React.FC<QuickSwitchBottomBarProps> = ({
  isCurrentMonthView,
  favoritesCount,
  onJumpToToday,
  onAddToday,
  onOpenFavorites,
  onOpenExport,
  onOpenAbout,
}) => {
  return (
    <nav className="bottom-floating-bar" aria-label="Quick Actions Navigation">
      <button
        className={`bottom-tab-btn ${isCurrentMonthView ? 'active' : ''}`}
        onClick={onJumpToToday}
        title="Jump to Current Month"
      >
        <Calendar size={15} />
        <span>This Month</span>
      </button>

      <button
        className="bottom-tab-btn primary-highlight"
        onClick={onAddToday}
        title="Capture or Add Entry to Today"
      >
        <PlusCircle size={15} />
        <span>Today's Entry</span>
      </button>

      {/* Favorites Tab Button */}
      <button
        className="bottom-tab-btn"
        onClick={onOpenFavorites}
        title="View All Favorited Memories"
      >
        <Heart size={15} fill={favoritesCount > 0 ? '#FF2D55' : 'none'} color="#FF2D55" />
        <span>Favorites {favoritesCount > 0 ? `(${favoritesCount})` : ''}</span>
      </button>

      <button
        className="bottom-tab-btn"
        onClick={onOpenExport}
        title="Backup & Database Export"
      >
        <Download size={15} />
        <span>Export & Backup</span>
      </button>

      {/* About App Tab */}
      <button
        className="bottom-tab-btn"
        onClick={onOpenAbout}
        title="About Calendo"
      >
        <Info size={15} color="var(--accent-coral)" />
        <span>About</span>
      </button>
    </nav>
  );
};

