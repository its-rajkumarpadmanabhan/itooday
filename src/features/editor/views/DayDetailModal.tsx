import React, { useState, useRef, useMemo } from 'react';
import { X, Image as ImageIcon, Camera, Trash2, Check, Sparkles, Upload, Heart } from 'lucide-react';
import { CalendarDay } from '../../calendar/models/calendar_day_model';
import { JournalEntry, TaskItem } from '../../calendar/models/entry_model';
import { InteractiveCanvas } from './widgets/InteractiveCanvas';
import { TaskInputList } from './widgets/TaskInputList';
import { PRESET_STICKERS, PresetSticker } from '../../../services/stickerCatalog';
import { compressImageFile } from '../../../core/utils/image_processor';
import { parseDateKey } from '../../../core/utils/date_utils';

interface DayDetailModalProps {
  day: CalendarDay;
  onClose: () => void;
  onSave: (entry: JournalEntry) => Promise<void>;
  onDelete: (entryId: string) => Promise<void>;
}

const MOOD_EMOJIS = ['☕', '📸', '🐕', '🎵', '⚡', '🍵', '🌸', '✨', '🏖️', '🥑', '💻', '🎨', '🚀', '🍕'];

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  onClose,
  onSave,
  onDelete,
}) => {
  const existingEntry = day.entry;

  const [imagePath, setImagePath] = useState<string>(existingEntry?.image_path || '');
  const [isStickerCutout, setIsStickerCutout] = useState<boolean>(existingEntry?.is_sticker_cutout ?? true);
  const [isFavorite, setIsFavorite] = useState<boolean>(!!existingEntry?.is_favorite);
  const [scale, setScale] = useState<number>(existingEntry?.image_scale ?? 1.0);
  const [rotation, setRotation] = useState<number>(existingEntry?.image_rotation ?? 0);
  const [offsetX, setOffsetX] = useState<number>(existingEntry?.image_offset_x ?? 0);
  const [offsetY, setOffsetY] = useState<number>(existingEntry?.image_offset_y ?? 0);
  const [journalNote, setJournalNote] = useState<string>(existingEntry?.journal_note || '');
  const [moodEmoji, setMoodEmoji] = useState<string>(existingEntry?.mood_emoji || '☕');
  const [tasks, setTasks] = useState<TaskItem[]>(existingEntry?.tasks || []);
  
  const [stickerCategory, setStickerCategory] = useState<string>('all');
  const [stickerSearch, setStickerSearch] = useState<string>('');

  const formattedFullDate = day.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const filteredStickers = useMemo(() => {
    return PRESET_STICKERS.filter((s: PresetSticker) => {
      const matchCat = stickerCategory === 'all' || s.category === stickerCategory;
      const matchSearch = !stickerSearch || s.name.toLowerCase().includes(stickerSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [stickerCategory, stickerSearch]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const STICKER_CATEGORIES = [
    { key: 'all', label: '🌟 All' },
    { key: 'emoji', label: '😀 Emojis' },
    { key: 'food', label: '🍔 Food' },
    { key: 'mood', label: '🎉 Mood' },
    { key: 'activity', label: '⚡ Activity' },
    { key: 'nature', label: '🌿 Nature' },
    { key: 'objects', label: '🚀 Tech' },
  ];

  const handleTransformChange = (s: number, r: number, ox: number, oy: number) => {
    setScale(s);
    setRotation(r);
    setOffsetX(ox);
    setOffsetY(oy);
  };

  const handleSelectPresetSticker = (svgUrl: string) => {
    setImagePath(svgUrl);
    setIsStickerCutout(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file);
      setImagePath(compressed);
      setIsStickerCutout(false); // Default to full photo
    } catch (err) {
      console.error('File upload failed:', err);
    }
  };

  const handleSave = async () => {
    const { year: kYear, month: kMonth, day: kDay } = parseDateKey(day.date_key);
    const entryId = existingEntry?.id || `entry_${day.date_key}`;
    const newEntry: JournalEntry = {
      id: entryId,
      date_key: day.date_key,
      year: kYear,
      month: kMonth,
      day: kDay,
      image_path: imagePath,
      image_scale: scale,
      image_rotation: rotation,
      image_offset_x: offsetX,
      image_offset_y: offsetY,
      is_sticker_cutout: isStickerCutout,
      is_favorite: isFavorite,
      journal_note: journalNote,
      mood_emoji: moodEmoji,
      created_at: existingEntry?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tasks,
    };

    try {
      await onSave(newEntry);
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async () => {
    if (existingEntry?.id) {
      await onDelete(existingEntry.id);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="detail-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="detail-header">
          <div className="detail-title-group">
            <h2 className="detail-date-title">{formattedFullDate}</h2>
            <span className="detail-date-subtitle">Visual Journal & Sticker Canvas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="icon-button"
              onClick={() => {
                const nextFav = !isFavorite;
                setIsFavorite(nextFav);
              }}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle Favorite"
            >
              <Heart
                size={18}
                fill={isFavorite ? '#FF3B30' : 'none'}
                color={isFavorite ? '#FF3B30' : 'var(--text-secondary)'}
              />
            </button>
            <button className="icon-button" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="detail-body">
          {/* Interactive Gesture Canvas */}
          <div>
            <div className="modal-section-title">
              <span>Interactive Sticker Canvas</span>
            </div>

            <InteractiveCanvas
              imageSrc={imagePath}
              isSticker={isStickerCutout}
              scale={scale}
              rotation={rotation}
              offsetX={offsetX}
              offsetY={offsetY}
              onTransformChange={handleTransformChange}
            />
          </div>

          {/* Sticker & Photo Library Selector */}
          <div>
            <div className="modal-section-title">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="var(--accent-coral)" />
                Choose Sticker, Emoji or Photo ({filteredStickers.length})
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="pill-button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '5px 12px',
                    fontSize: '11.5px',
                    background: 'var(--accent-pill)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--text-primary)',
                  }}
                  title="Upload image in 100% full original high quality"
                >
                  <Upload size={13} color="var(--accent-coral)" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {/* Category Filter Pills & Search */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '8px' }}>
              {STICKER_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className="pill-button"
                  onClick={() => setStickerCategory(cat.key)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    backgroundColor: stickerCategory === cat.key ? 'var(--accent-coral)' : 'var(--accent-pill)',
                    color: stickerCategory === cat.key ? '#FFF' : 'var(--text-secondary)',
                    borderColor: stickerCategory === cat.key ? 'var(--accent-coral)' : 'rgba(255,255,255,0.08)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Curated Sticker Grid */}
            <div className="sticker-catalog-grid">
              {filteredStickers.map((sticker) => (
                <button
                  key={sticker.id}
                  type="button"
                  className="catalog-item-btn"
                  onClick={() => handleSelectPresetSticker(sticker.svgUrl)}
                  title={sticker.name}
                >
                  <img
                    src={sticker.svgUrl}
                    alt={sticker.name}
                    style={{ width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.2))' }}
                  />
                  <span className="catalog-item-name">{sticker.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selector */}
          <div>
            <div className="modal-section-title">
              <span>Today's Mood / Vibe</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {MOOD_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setMoodEmoji(emoji)}
                  className="pill-button"
                  style={{
                    fontSize: '16px',
                    padding: '6px 10px',
                    backgroundColor: moodEmoji === emoji ? 'var(--tile-active)' : 'transparent',
                    borderColor: moodEmoji === emoji ? 'var(--accent-coral)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Journal Note */}
          <div>
            <div className="modal-section-title">
              <span>Journal Caption</span>
            </div>
            <textarea
              className="dark-textarea"
              placeholder="What made today memorable? Add a thought, reflection, or memory..."
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
            />
          </div>

          {/* Micro-Tasks List */}
          <TaskInputList tasks={tasks} onChange={setTasks} />
        </div>

        {/* Footer Actions */}
        <div className="detail-footer">
          {existingEntry ? (
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
            >
              <Trash2 size={14} style={{ display: 'inline', marginRight: 4 }} />
              Remove Entry
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={handleSave}>
              <Check size={16} />
              Save to Day
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
