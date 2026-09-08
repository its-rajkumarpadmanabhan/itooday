export interface ThemeColor {
  id: string;
  name: string;
  accent: string;       // Primary accent hex
  secondary?: string;
  description?: string;
}

export type ThemeMode = 'dark' | 'light';

export const THEME_PALETTES: ThemeColor[] = [
  { id: 'coral', name: 'Calendo Coral', accent: '#FF5E62', description: 'Signature warm coral' },
  { id: 'neon_purple', name: 'Cyber Violet', accent: '#A855F7', description: 'Electric neon purple' },
  { id: 'cyan_glow', name: 'Electric Cyan', accent: '#00F0FF', description: 'Vibrant futuristic aqua' },
  { id: 'emerald', name: 'Emerald Velvet', accent: '#30D158', description: 'Lush organic green' },
  { id: 'sunset_amber', name: 'Sunset Amber', accent: '#FFD60A', description: 'Warm golden radiant' },
  { id: 'hot_rose', name: 'Rose Quartz', accent: '#FF2D55', description: 'Passionate hot pink' },
  { id: 'indigo', name: 'Midnight Indigo', accent: '#6366F1', description: 'Deep royal violet blue' },
  { id: 'blood_orange', name: 'Flame Orange', accent: '#FF6B00', description: 'Energetic vibrant citrus' },
  { id: 'matcha_lime', name: 'Matcha Lime', accent: '#84CC16', description: 'Crisp serene lime' },
  { id: 'sky_blue', name: 'Azure Sky', accent: '#38BDF8', description: 'Breezy cloudless blue' },
  { id: 'ruby_red', name: 'Crimson Ruby', accent: '#EF4444', description: 'Bold intense ruby' },
  { id: 'pure_silver', name: 'Titanium Slate', accent: '#94A3B8', description: 'Clean monochrome steel' },
];

const COLOR_STORAGE_KEY = 'calendo_user_theme_color';
const MODE_STORAGE_KEY = 'calendo_user_theme_mode';
const DEFAULT_THEME_COLOR = '#FF5E62';
const DEFAULT_THEME_MODE: ThemeMode = 'dark';

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) {
    return { r: 255, g: 94, b: 98 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function getSavedTheme(): string {
  try {
    return localStorage.getItem(COLOR_STORAGE_KEY) || DEFAULT_THEME_COLOR;
  } catch (e) {
    return DEFAULT_THEME_COLOR;
  }
}

export function getSavedThemeMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(MODE_STORAGE_KEY);
    return saved === 'light' ? 'light' : 'dark';
  } catch (e) {
    return DEFAULT_THEME_MODE;
  }
}

export function applyTheme(colorHex: string, mode?: ThemeMode): void {
  const currentMode = mode || getSavedThemeMode();
  try {
    localStorage.setItem(COLOR_STORAGE_KEY, colorHex);
    localStorage.setItem(MODE_STORAGE_KEY, currentMode);
  } catch (e) {
    // Ignored in private browsing
  }

  const { r, g, b } = hexToRgb(colorHex);
  const root = document.documentElement;
  root.setAttribute('data-theme', currentMode);

  if (currentMode === 'light') {
    // Clean, modern, vibrant light mode styling
    const bgGrad = `radial-gradient(ellipse 90% 65% at 50% -10%, rgba(${r}, ${g}, ${b}, 0.14) 0%, rgba(${Math.min(255, Math.round(r * 0.05 + 242))}, ${Math.min(255, Math.round(g * 0.05 + 245))}, ${Math.min(255, Math.round(b * 0.05 + 249))}, 0.95) 45%, #EDF2F7 100%)`;
    const bgSolid = '#F8FAFC';

    const tileSurface = `rgba(255, 255, 255, 0.94)`;
    const tileHover = `rgba(${Math.min(255, Math.round(r * 0.06 + 245))}, ${Math.min(255, Math.round(g * 0.06 + 248))}, ${Math.min(255, Math.round(b * 0.06 + 252))}, 0.98)`;
    const tileActive = `rgba(${Math.min(255, Math.round(r * 0.1 + 238))}, ${Math.min(255, Math.round(g * 0.1 + 242))}, ${Math.min(255, Math.round(b * 0.1 + 248))}, 1)`;
    const tileOutline = `rgba(${r}, ${g}, ${b}, 0.22)`;
    const tileOutlineHover = `rgba(${r}, ${g}, ${b}, 0.55)`;
    const tileOutlineToday = colorHex;
    const accentPill = `rgba(${Math.min(255, Math.round(r * 0.08 + 235))}, ${Math.min(255, Math.round(g * 0.08 + 238))}, ${Math.min(255, Math.round(b * 0.08 + 244))}, 0.9)`;
    const accentPillHover = `rgba(${Math.min(255, Math.round(r * 0.12 + 225))}, ${Math.min(255, Math.round(g * 0.12 + 230))}, ${Math.min(255, Math.round(b * 0.12 + 238))}, 0.95)`;

    const textPrimary = '#0F172A';
    const textSecondary = '#475569';
    const textTertiary = '#94A3B8';

    root.style.setProperty('--bg-color', bgSolid);
    root.style.setProperty('--bg-gradient', bgGrad);
    root.style.setProperty('--tile-surface', tileSurface);
    root.style.setProperty('--tile-hover', tileHover);
    root.style.setProperty('--tile-active', tileActive);
    root.style.setProperty('--tile-outline', tileOutline);
    root.style.setProperty('--tile-outline-hover', tileOutlineHover);
    root.style.setProperty('--tile-outline-today', tileOutlineToday);
    root.style.setProperty('--text-primary', textPrimary);
    root.style.setProperty('--text-secondary', textSecondary);
    root.style.setProperty('--text-tertiary', textTertiary);
    root.style.setProperty('--accent-pill', accentPill);
    root.style.setProperty('--accent-pill-hover', accentPillHover);
    root.style.setProperty('--accent-coral', colorHex);
    root.style.setProperty('--theme-glow', `rgba(${r}, ${g}, ${b}, 0.22)`);
    root.style.setProperty('--shadow-elevation', '0 16px 40px rgba(15, 23, 42, 0.12)');
    root.style.setProperty('--modal-bg', '#FFFFFF');
    root.style.setProperty('--modal-surface', '#F8FAFC');
    root.style.setProperty('--modal-border', 'rgba(15, 23, 42, 0.1)');
    root.style.setProperty('--cell-date-color', '#0F172A');
  } else {
    // Dark mode styling
    const bgGrad = `radial-gradient(ellipse 90% 65% at 50% -10%, rgba(${r}, ${g}, ${b}, 0.22) 0%, rgba(${Math.round(r * 0.15)}, ${Math.round(g * 0.15)}, ${Math.round(b * 0.15)}, 0.4) 45%, #07080B 100%)`;
    const bgSolid = `rgb(${Math.round(r * 0.04 + 6)}, ${Math.round(g * 0.04 + 7)}, ${Math.round(b * 0.04 + 9)})`;

    const tileSurface = `rgba(${Math.round(r * 0.08 + 18)}, ${Math.round(g * 0.08 + 20)}, ${Math.round(b * 0.08 + 26)}, 0.95)`;
    const tileHover = `rgba(${Math.round(r * 0.14 + 22)}, ${Math.round(g * 0.14 + 25)}, ${Math.round(b * 0.14 + 32)}, 0.98)`;
    const tileActive = `rgba(${Math.round(r * 0.2 + 26)}, ${Math.round(g * 0.2 + 30)}, ${Math.round(b * 0.2 + 38)}, 1)`;
    const tileOutline = `rgba(${r}, ${g}, ${b}, 0.18)`;
    const tileOutlineHover = `rgba(${r}, ${g}, ${b}, 0.45)`;
    const tileOutlineToday = colorHex;
    const accentPill = `rgba(${Math.round(r * 0.12 + 28)}, ${Math.round(g * 0.12 + 30)}, ${Math.round(b * 0.12 + 36)}, 0.9)`;
    const accentPillHover = `rgba(${Math.round(r * 0.2 + 36)}, ${Math.round(g * 0.2 + 38)}, ${Math.round(b * 0.2 + 46)}, 0.95)`;

    const textPrimary = '#FFFFFF';
    const textSecondary = '#CBD5E1';
    const textTertiary = '#64748B';

    root.style.setProperty('--bg-color', bgSolid);
    root.style.setProperty('--bg-gradient', bgGrad);
    root.style.setProperty('--tile-surface', tileSurface);
    root.style.setProperty('--tile-hover', tileHover);
    root.style.setProperty('--tile-active', tileActive);
    root.style.setProperty('--tile-outline', tileOutline);
    root.style.setProperty('--tile-outline-hover', tileOutlineHover);
    root.style.setProperty('--tile-outline-today', tileOutlineToday);
    root.style.setProperty('--text-primary', textPrimary);
    root.style.setProperty('--text-secondary', textSecondary);
    root.style.setProperty('--text-tertiary', textTertiary);
    root.style.setProperty('--accent-pill', accentPill);
    root.style.setProperty('--accent-pill-hover', accentPillHover);
    root.style.setProperty('--accent-coral', colorHex);
    root.style.setProperty('--theme-glow', `rgba(${r}, ${g}, ${b}, 0.35)`);
    root.style.setProperty('--shadow-elevation', '0 8px 30px rgba(0, 0, 0, 0.7)');
    root.style.setProperty('--modal-bg', '#141518');
    root.style.setProperty('--modal-surface', '#1E2228');
    root.style.setProperty('--modal-border', 'rgba(255, 255, 255, 0.12)');
    root.style.setProperty('--cell-date-color', '#FFFFFF');
  }
}
