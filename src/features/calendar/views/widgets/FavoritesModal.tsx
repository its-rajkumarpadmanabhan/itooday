import React, { useMemo } from 'react';
import { X, Heart, Calendar, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { JournalEntry } from '../../models/entry_model';
import { MONTH_NAMES, parseDateKey } from '../../../../core/utils/date_utils';

interface FavoritesModalProps {
  entriesMap: Map<string, JournalEntry>;
  onSelectDay: (dateKey: string) => void;
  onToggleFavorite: (entry: JournalEntry) => void;
  onClose: () => void;
}

interface MonthGroup {
  year: number;
  month: number;
  monthTitle: string;
  entries: JournalEntry[];
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  entriesMap,
  onSelectDay,
  onToggleFavorite,
  onClose,
}) => {
  // Filter all favorited entries and group by Year-Month
  const monthGroups: MonthGroup[] = useMemo(() => {
    const favorites: JournalEntry[] = [];
    entriesMap.forEach((entry) => {
      if (entry.is_favorite && entry.image_path) {
        favorites.push(entry);
      }
    });

    // Sort descending by date (newest first)
    favorites.sort((a, b) => b.date_key.localeCompare(a.date_key));

    const groupMap = new Map<string, MonthGroup>();
    favorites.forEach((entry) => {
      const { year, month } = parseDateKey(entry.date_key);
      const groupKey = `${year}-${String(month).padStart(2, '0')}`;
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          year,
          month,
          monthTitle: `${MONTH_NAMES[month - 1]} ${year}`,
          entries: [],
        });
      }
      groupMap.get(groupKey)!.entries.push(entry);
    });

    return Array.from(groupMap.values());
  }, [entriesMap]);

  const totalFavoritesCount = monthGroups.reduce((acc, g) => acc + g.entries.length, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-card"
        style={{ maxWidth: '680px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="detail-header">
          <div className="detail-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={20} fill="#FF2D55" color="#FF2D55" />
              <h2 className="detail-date-title">Favorited Memories ({totalFavoritesCount})</h2>
            </div>
            <span className="detail-date-subtitle">
              Your favorite daily stickers & photos grouped in order of month
            </span>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close favorites modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="detail-body" style={{ gap: '24px' }}>
          {monthGroups.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#1E2228',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 45, 85, 0.3)',
                }}
              >
                <Heart size={28} color="#FF2D55" />
              </div>
              <h3 style={{ color: '#FFF', fontSize: '17px', fontWeight: 700 }}>No Favorites Yet</h3>
              <p style={{ fontSize: '13px', maxWidth: '340px', lineHeight: 1.5 }}>
                Double-click any calendar tile or tap the heart icon in the photo editor to add special days (like marriages, birthdays & anniversaries) to your favorites!
              </p>
            </div>
          ) : (
            monthGroups.map((group) => (
              <div key={`${group.year}-${group.month}`} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Month Group Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '6px',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {group.monthTitle}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {group.entries.length} {group.entries.length === 1 ? 'memory' : 'memories'}
                  </span>
                </div>

                {/* Favorites Grid for This Month */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {group.entries.map((entry) => {
                    const { day } = parseDateKey(entry.date_key);
                    const isSticker = entry.is_sticker_cutout ?? true;

                    return (
                      <div
                        key={entry.id}
                        className="favorites-card"
                        onClick={() => {
                          onSelectDay(entry.date_key);
                          onClose();
                        }}
                        style={{
                          backgroundColor: '#181A20',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
                          position: 'relative',
                        }}
                      >
                        {/* Top Bar with Date & Heart */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            background: 'rgba(0,0,0,0.3)',
                          }}
                        >
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFF' }}>
                            Day {day} {entry.mood_emoji && `· ${entry.mood_emoji}`}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(entry);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              display: 'flex',
                            }}
                            title="Remove from favorites"
                          >
                            <Heart size={15} fill="#FF2D55" color="#FF2D55" />
                          </button>
                        </div>

                        {/* Image / Sticker Preview */}
                        <div
                          style={{
                            height: '110px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#101114',
                            overflow: 'hidden',
                            position: 'relative',
                          }}
                        >
                          {isSticker ? (
                            <img
                              src={entry.image_path}
                              alt=""
                              style={{
                                maxWidth: '70%',
                                maxHeight: '70%',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))',
                              }}
                            />
                          ) : (
                            <img
                              src={entry.image_path}
                              alt=""
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          )}
                        </div>

                        {/* Journal Note Caption */}
                        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {entry.journal_note ? (
                            <p
                              style={{
                                fontSize: '11.5px',
                                color: '#E2E8F0',
                                lineHeight: 1.35,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              “{entry.journal_note}”
                            </p>
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                              Favorited photo
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
