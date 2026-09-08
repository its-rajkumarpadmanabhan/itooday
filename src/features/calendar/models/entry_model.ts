export interface TaskItem {
  id: string;
  entry_id: string;
  content: string;
  is_completed: boolean | number;
  sort_order: number;
}

export interface JournalEntry {
  id: string;
  date_key: string;       // Format: 'YYYY-MM-DD'
  year: number;
  month: number;          // 1-12
  day: number;            // 1-31
  image_path?: string;    // Base64 Data URI or cached sticker asset
  image_scale: number;    // Zoom factor (e.g., 0.5 to 3.0)
  image_rotation: number; // Rotation in degrees (-180 to 180)
  image_offset_x: number; // Translation X in pixels/percent
  image_offset_y: number; // Translation Y in pixels/percent
  is_sticker_cutout?: boolean;
  is_favorite?: boolean | number;
  journal_note?: string;
  mood_emoji?: string;
  created_at: string;
  updated_at: string;
  tasks?: TaskItem[];
}
