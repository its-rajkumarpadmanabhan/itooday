import React, { useState, useRef, useMemo } from 'react';
import { X, Download, Upload, FileText, Database, RefreshCw, Check, Calendar, Loader2, Sparkles } from 'lucide-react';
import { appDatabase } from '../../../../core/database/app_database';
import { JournalEntry } from '../../models/entry_model';
import { MONTH_NAMES, formatDateKey } from '../../../../core/utils/date_utils';
import { exportMonthToPDF, exportYearToPDF, downloadBlobToDevice } from '../../../../services/pdfExporter';

interface ExportModalProps {
  currentYear: number;
  currentMonth: number;
  entriesMap: Map<string, JournalEntry>;
  onClose: () => void;
  onDataChanged: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  currentYear,
  currentMonth,
  entriesMap,
  onClose,
  onDataChanged,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF Export Scope: 'month' | 'year'
  const [exportScope, setExportScope] = useState<'month' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [pdfProgressText, setPdfProgressText] = useState<string>('');

  const availableYears = useMemo(() => {
    const list: number[] = [];
    const base = currentYear;
    for (let y = base - 3; y <= base + 5; y++) {
      list.push(y);
    }
    return list;
  }, [currentYear]);

  // Memory stats for selection
  const selectedStats = useMemo(() => {
    let count = 0;
    if (exportScope === 'month') {
      for (let d = 1; d <= 31; d++) {
        const k = formatDateKey(selectedYear, selectedMonth, d);
        if (entriesMap.get(k)?.image_path) count++;
      }
    } else {
      for (let m = 1; m <= 12; m++) {
        for (let d = 1; d <= 31; d++) {
          const k = formatDateKey(selectedYear, m, d);
          if (entriesMap.get(k)?.image_path) count++;
        }
      }
    }
    return count;
  }, [exportScope, selectedMonth, selectedYear, entriesMap]);

  // Handler to export PDF
  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    setPdfProgressText('Starting PDF generation...');

    try {
      if (exportScope === 'month') {
        await exportMonthToPDF(selectedYear, selectedMonth, entriesMap, (status) => {
          setPdfProgressText(status);
        });
      } else {
        await exportYearToPDF(selectedYear, entriesMap, (status) => {
          setPdfProgressText(status);
        });
      }
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
      setPdfProgressText('');
    }
  };

  const handleExportJSON = async () => {
    const data = await appDatabase.exportDatabase();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    downloadBlobToDevice(blob, `calendo-backup-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed.entries && Array.isArray(parsed.entries)) {
        await appDatabase.importDatabase(parsed.entries);
        onDataChanged();
        onClose();
      } else {
        alert('Invalid Calendo backup file format.');
      }
    } catch (err) {
      console.error('Failed to import backup:', err);
      alert('Failed to parse backup file.');
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all diary entries and tasks? This cannot be undone.')) {
      await appDatabase.clearAll();
      localStorage.removeItem('calendo_has_seeded');
      onDataChanged();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-card"
        style={{ maxWidth: '520px', borderRadius: '24px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="detail-header" style={{ padding: '18px 22px' }}>
          <div className="detail-title-group">
            <h2 className="detail-date-title" style={{ fontSize: '20px' }}>Export & Backup</h2>
            <span className="detail-date-subtitle">Printable PDF Journal & Database Backup</span>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close export modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="detail-body" style={{ padding: '22px', gap: '22px' }}>
          {/* Section 1: PDF Export */}
          <div
            style={{
              backgroundColor: 'var(--tile-surface)',
              border: '1px solid var(--modal-border)',
              borderRadius: '18px',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--accent-coral)" />
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Export as Printable PDF
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'var(--accent-pill)',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  color: 'var(--accent-coral)',
                }}
              >
                {selectedStats} Memories
              </span>
            </div>

            {/* Scope Selection: Month vs Entire Year */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '4px',
                borderRadius: '14px',
              }}
            >
              <button
                type="button"
                onClick={() => setExportScope('month')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: exportScope === 'month' ? 'var(--accent-coral)' : 'transparent',
                  color: exportScope === 'month' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: exportScope === 'month' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                📅 Selected Month
              </button>

              <button
                type="button"
                onClick={() => setExportScope('year')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: exportScope === 'year' ? 'var(--accent-coral)' : 'transparent',
                  color: exportScope === 'year' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: exportScope === 'year' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                🗓️ Entire Year (12 Months)
              </button>
            </div>

            {/* Date Pickers */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {exportScope === 'month' && (
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Choose Month:
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="dark-text-input"
                    style={{ width: '100%', padding: '8px 12px', cursor: 'pointer' }}
                  >
                    {MONTH_NAMES.map((m, idx) => (
                      <option key={m} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Choose Year:
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="dark-text-input"
                  style={{ width: '100%', padding: '8px 12px', cursor: 'pointer' }}
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PDF Generate Button */}
            <button
              type="button"
              className="btn-primary"
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '14px',
                marginTop: '4px',
                opacity: isExportingPDF ? 0.7 : 1,
              }}
            >
              {isExportingPDF ? (
                <>
                  <Loader2 size={16} className="spin-anim" />
                  <span>{pdfProgressText || 'Generating High-Res PDF...'}</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>
                    Download {exportScope === 'month' ? `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear} PDF` : `${selectedYear} Full Year PDF`}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Section 2: Database Backup & Restore */}
          <div
            style={{
              backgroundColor: 'var(--tile-surface)',
              border: '1px solid var(--modal-border)',
              borderRadius: '18px',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="#38BDF8" />
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Offline Database Backup
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Export or restore your full local SQLite database including entries, affine collage positions, transparent cutouts, and micro-tasks.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className="pill-button"
                style={{ justifyContent: 'center', padding: '10px 12px', fontSize: '12.5px' }}
                onClick={handleExportJSON}
              >
                <Download size={14} color="var(--accent-coral)" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                className="pill-button"
                style={{ justifyContent: 'center', padding: '10px 12px', fontSize: '12.5px' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} color="#38BDF8" />
                <span>Restore JSON</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              style={{ display: 'none' }}
            />
          </div>

          {/* Section 3: Reset & Clear Storage */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-danger"
              style={{ padding: '8px 16px', fontSize: '12px' }}
              onClick={handleClearAllData}
            >
              <RefreshCw size={12} style={{ display: 'inline', marginRight: 6 }} />
              Clear All Entries & Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
