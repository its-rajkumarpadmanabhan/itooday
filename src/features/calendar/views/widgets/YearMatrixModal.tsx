import React from 'react';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES, getDaysInMonth, formatDateKey } from '../../../../core/utils/date_utils';
import { JournalEntry } from '../../models/entry_model';

interface YearMatrixModalProps {
  year: number;
  entriesMap: Map<string, JournalEntry>;
  onSelectMonth: (month: number) => void;
  onClose: () => void;
}

export const YearMatrixModal: React.FC<YearMatrixModalProps> = ({
  year,
  entriesMap,
  onSelectMonth,
  onClose,
}) => {
  const [selectedYear, setSelectedYear] = React.useState(year);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-card"
        style={{ maxWidth: '780px', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="detail-header">
          <div className="detail-title-group">
            <h2 className="detail-date-title">{selectedYear} Year Mosaic</h2>
            <span className="detail-date-subtitle">Bird's-eye view of your daily stickers & visual journey</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="icon-button"
              style={{ width: '32px', height: '32px' }}
              onClick={() => setSelectedYear((y) => y - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '15px', fontWeight: 700 }}>{selectedYear}</span>
            <button
              className="icon-button"
              style={{ width: '32px', height: '32px' }}
              onClick={() => setSelectedYear((y) => y + 1)}
            >
              <ChevronRight size={16} />
            </button>
            <button className="icon-button" onClick={onClose} style={{ marginLeft: 8 }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="detail-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {MONTH_NAMES.map((name, mIdx) => {
            const monthNum = mIdx + 1;
            const daysCount = getDaysInMonth(selectedYear, monthNum);
            const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

            let filledCount = 0;
            daysArray.forEach((d) => {
              const k = formatDateKey(selectedYear, monthNum, d);
              if (entriesMap.has(k)) filledCount++;
            });

            return (
              <div
                key={name}
                onClick={() => {
                  onSelectMonth(monthNum);
                  onClose();
                }}
                style={{
                  backgroundColor: '#181A20',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                }}
                className="year-matrix-tile"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>{name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {filledCount}/{daysCount}
                  </span>
                </div>

                {/* Mini 7-col grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '2px',
                  }}
                >
                  {daysArray.map((d) => {
                    const k = formatDateKey(selectedYear, monthNum, d);
                    const hasEntry = entriesMap.has(k);
                    const entry = entriesMap.get(k);

                    return (
                      <div
                        key={d}
                        style={{
                          aspectRatio: '1 / 1.1',
                          borderRadius: '4px',
                          backgroundColor: hasEntry ? 'var(--tile-active)' : '#101114',
                          border: hasEntry ? '1px solid rgba(255, 94, 98, 0.5)' : '1px solid rgba(255,255,255,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}
                        title={`${name} ${d}: ${hasEntry ? 'Has Entry' : 'Empty'}`}
                      >
                        {hasEntry && entry?.image_path ? (
                          <img
                            src={entry.image_path}
                            alt=""
                            style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                          />
                        ) : (
                          <span style={{ fontSize: '6px', color: '#444' }}>{d}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
