import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES } from '../../../../core/utils/date_utils';

interface MonthPickerModalProps {
  currentYear: number;
  currentMonth: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}

export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  currentYear,
  currentMonth,
  onSelect,
  onClose,
}) => {
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-card"
        style={{ maxWidth: '400px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="detail-header">
          <div className="detail-title-group">
            <h2 className="detail-date-title">Select Date</h2>
            <span className="detail-date-subtitle">Jump to any month & year</span>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="detail-body">
          {/* Year selector with arrows */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#1E2228',
              borderRadius: '14px',
            }}
          >
            <button
              className="icon-button"
              style={{ width: '32px', height: '32px' }}
              onClick={() => setSelectedYear((y) => y - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '18px', fontWeight: 800 }}>{selectedYear}</span>
            <button
              className="icon-button"
              style={{ width: '32px', height: '32px' }}
              onClick={() => setSelectedYear((y) => y + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 12 Months Grid */}
          <div className="wheel-picker-grid">
            {MONTH_NAMES.map((name, idx) => {
              const monthNum = idx + 1;
              const isSelected = selectedYear === currentYear && monthNum === currentMonth;
              return (
                <button
                  key={name}
                  type="button"
                  className={`wheel-month-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(selectedYear, monthNum);
                    onClose();
                  }}
                >
                  {name.substring(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
