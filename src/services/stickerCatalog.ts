export interface PresetSticker {
  id: string;
  name: string;
  category: 'all' | 'emoji' | 'mood' | 'activity' | 'food' | 'nature' | 'objects';
  svgUrl: string;
  emojiChar?: string;
}

export function encodeSvgUri(svg: string): string {
  if (!svg) return '';
  if (svg.startsWith('data:image/svg+xml;utf8,')) {
    const raw = svg.slice('data:image/svg+xml;utf8,'.length);
    const cleaned = raw.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim();
    return `data:image/svg+xml;utf8,${encodeURIComponent(cleaned)}`;
  }
  return svg;
}

/**
 * Converts Unicode emoji character to Twemoji CDN SVG URL.
 * Guarantees 100% full-color, anti-aliased vector rendering across all OSes (no black text).
 */
export function getEmojiCodePoint(emoji: string): string {
  const clean = emoji.trim();
  const codePoints: string[] = [];
  for (let i = 0; i < clean.length; i++) {
    const codePoint = clean.codePointAt(i);
    if (codePoint !== undefined) {
      // Skip zero-width joiners or variation selectors if needed or include standard sequence
      const hex = codePoint.toString(16);
      codePoints.push(hex);
      if (codePoint > 0xffff) {
        i++; // Surrogate pair
      }
    }
  }
  // Strip trailing fe0f (variation selector-16) for Twemoji compatibility
  return codePoints.filter((c) => c !== 'fe0f').join('-');
}

export function createEmojiStickerUrl(emoji: string): string {
  const hexCode = getEmojiCodePoint(emoji);
  if (hexCode) {
    return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${hexCode}.svg`;
  }
  return '';
}


// Built-in high-quality vector stickers with vinyl die-cut white borders
const RAW_STICKERS: PresetSticker[] = [
  // --- EMOJIS & EXPRESSIONS (100% Offline Vector SVGs) ---
  {
    id: 'emoji_heart_eyes',
    name: 'Heart Eyes',
    category: 'emoji',
    emojiChar: '😍',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="%23ffffff"/>
      <circle cx="50" cy="50" r="41" fill="%23FFCC4D"/>
      <!-- Heart Eyes -->
      <path d="M 33 30 C 26 22 17 32 26 42 L 33 48 L 40 42 C 49 32 40 22 33 30 Z" fill="%23DD2E44"/>
      <path d="M 67 30 C 60 22 51 32 60 42 L 67 48 L 74 42 C 83 32 74 22 67 30 Z" fill="%23DD2E44"/>
      <!-- Smile -->
      <path d="M 30 58 Q 50 80 70 58" fill="%23664500" stroke="%23664500" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'emoji_partying',
    name: 'Partying',
    category: 'emoji',
    emojiChar: '🥳',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="55" r="42" fill="%23ffffff"/>
      <circle cx="50" cy="55" r="38" fill="%23FFCC4D"/>
      <!-- Party Hat -->
      <polygon points="26,38 48,6 64,32" fill="%239266CC" stroke="%23ffffff" stroke-width="3"/>
      <circle cx="48" cy="6" r="4" fill="%23FFCC4D"/>
      <circle cx="36" cy="24" r="2.5" fill="%23FFAC33"/>
      <circle cx="52" cy="20" r="2.5" fill="%2355ACEE"/>
      <!-- Eyes & Wink -->
      <circle cx="38" cy="50" r="4" fill="%23664500"/>
      <path d="M 60 52 Q 68 46 72 52" stroke="%23664500" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <!-- Horn & Whistle -->
      <path d="M 46 64 Q 60 64 74 60" stroke="%23FF7700" stroke-width="5" stroke-linecap="round" fill="none"/>
      <circle cx="76" cy="59" r="4" fill="%23DD2E44"/>
      <!-- Party streamer dots -->
      <circle cx="20" cy="68" r="3" fill="%2355ACEE"/>
      <circle cx="82" cy="42" r="3" fill="%2377B255"/>
      <circle cx="28" cy="80" r="2.5" fill="%23DD2E44"/>
    </svg>`,
  },
  {
    id: 'emoji_cool_shades',
    name: 'Cool Shades',
    category: 'emoji',
    emojiChar: '😎',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="%23ffffff"/>
      <circle cx="50" cy="50" r="41" fill="%23FFCC4D"/>
      <!-- Sunglasses -->
      <path d="M 18 38 L 82 38" stroke="%23292F33" stroke-width="4" stroke-linecap="round"/>
      <path d="M 22 40 L 46 40 C 46 54 42 60 34 60 C 26 60 22 54 22 40 Z" fill="%23292F33"/>
      <path d="M 54 40 L 78 40 C 78 54 74 60 66 60 C 58 60 54 54 54 40 Z" fill="%23292F33"/>
      <!-- Lens Reflections -->
      <line x1="26" y1="44" x2="34" y2="56" stroke="%2366757F" stroke-width="2" stroke-linecap="round"/>
      <line x1="58" y1="44" x2="66" y2="56" stroke="%2366757F" stroke-width="2" stroke-linecap="round"/>
      <!-- Smirk -->
      <path d="M 36 68 Q 50 78 64 68" stroke="%23664500" stroke-width="4" stroke-linecap="round" fill="none"/>
    </svg>`,
  },
  {
    id: 'emoji_star_eyes',
    name: 'Star Eyes',
    category: 'emoji',
    emojiChar: '🤩',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="%23ffffff"/>
      <circle cx="50" cy="50" r="41" fill="%23FFCC4D"/>
      <!-- Star Eyes -->
      <polygon points="34,26 37,36 47,36 39,42 42,52 34,46 26,52 29,42 21,36 31,36" fill="%23FFAC33" stroke="%23F4900C" stroke-width="1.5"/>
      <polygon points="66,26 69,36 79,36 71,42 74,52 66,46 58,52 61,42 53,36 63,36" fill="%23FFAC33" stroke="%23F4900C" stroke-width="1.5"/>
      <!-- Grin -->
      <path d="M 28 60 C 28 80 72 80 72 60 Z" fill="%23664500"/>
      <path d="M 34 60 C 34 68 66 68 66 60 Z" fill="%23FFFFFF"/>
    </svg>`,
  },
  {
    id: 'emoji_joy_laugh',
    name: 'Joy Laugh',
    category: 'emoji',
    emojiChar: '😂',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="%23ffffff"/>
      <circle cx="50" cy="50" r="41" fill="%23FFCC4D"/>
      <!-- Cheerful Closed Eyes -->
      <path d="M 26 42 Q 34 32 42 42" stroke="%23664500" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M 58 42 Q 66 32 74 42" stroke="%23664500" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Big Laugh Open Mouth -->
      <path d="M 28 54 C 28 78 72 78 72 54 Z" fill="%23664500"/>
      <path d="M 32 54 C 32 62 68 62 68 54 Z" fill="%23FFFFFF"/>
      <path d="M 40 70 C 44 76 56 76 60 70 Z" fill="%23DD2E44"/>
      <!-- Blue Tears -->
      <path d="M 16 48 C 14 38 24 38 22 48 C 21 54 17 54 16 48 Z" fill="%235DADE2"/>
      <path d="M 84 48 C 86 38 76 38 78 48 C 79 54 83 54 84 48 Z" fill="%235DADE2"/>
    </svg>`,
  },
  {
    id: 'emoji_happy_tears',
    name: 'Happy Cry',
    category: 'emoji',
    emojiChar: '🥹',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="%23ffffff"/>
      <circle cx="50" cy="50" r="41" fill="%23FFCC4D"/>
      <!-- Big Glossy Eyes -->
      <circle cx="34" cy="44" r="11" fill="%23664500"/>
      <circle cx="66" cy="44" r="11" fill="%23664500"/>
      <!-- Eye Sparkle Glints -->
      <circle cx="32" cy="40" r="4" fill="%23FFFFFF"/>
      <circle cx="38" cy="46" r="2" fill="%23FFFFFF"/>
      <circle cx="64" cy="40" r="4" fill="%23FFFFFF"/>
      <circle cx="70" cy="46" r="2" fill="%23FFFFFF"/>
      <!-- Tear Water Drops -->
      <path d="M 28 52 C 26 58 34 58 32 52 Z" fill="%235DADE2"/>
      <path d="M 68 52 C 66 58 74 58 72 52 Z" fill="%235DADE2"/>
      <!-- Gentle Smile -->
      <path d="M 38 68 Q 50 76 62 68" stroke="%23664500" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    </svg>`,
  },
  {
    id: 'emoji_loving_smile',
    name: 'Love Smile',
    category: 'emoji',
    emojiChar: '🥰',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="%23ffffff"/>
      <circle cx="50" cy="50" r="41" fill="%23FFCC4D"/>
      <!-- Closed Happy Eyes -->
      <path d="M 30 44 Q 38 36 46 44" stroke="%23664500" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M 54 44 Q 62 36 70 44" stroke="%23664500" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <!-- Rosy Cheeks -->
      <circle cx="28" cy="54" r="6" fill="%23FF8894" opacity="0.7"/>
      <circle cx="72" cy="54" r="6" fill="%23FF8894" opacity="0.7"/>
      <!-- Smile -->
      <path d="M 38 62 Q 50 72 62 62" stroke="%23664500" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <!-- Floating Hearts -->
      <path d="M 20 28 C 16 22 10 28 16 34 L 20 38 L 24 34 C 30 28 24 22 20 28 Z" fill="%23DD2E44"/>
      <path d="M 80 28 C 76 22 70 28 76 34 L 80 38 L 84 34 C 90 28 84 22 80 28 Z" fill="%23DD2E44"/>
      <path d="M 50 16 C 46 10 40 16 46 22 L 50 26 L 54 22 C 60 16 54 10 50 16 Z" fill="%23DD2E44"/>
    </svg>`,
  },
  {
    id: 'emoji_fire',
    name: 'Fire Lit',
    category: 'emoji',
    emojiChar: '🔥',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M 50 8 C 55 25, 78 35, 78 60 C 78 78, 65 92, 50 92 C 35 92, 22 78, 22 60 C 22 42, 36 32, 42 20 C 42 34, 48 38, 48 38 C 48 38, 45 22, 50 8 Z" fill="%23ffffff" stroke="%23ffffff" stroke-width="6"/>
      <path d="M 50 12 C 55 28, 76 38, 76 60 C 76 76, 64 88, 50 88 C 36 88, 24 76, 24 60 C 24 44, 38 34, 44 24 C 44 36, 50 40, 50 40 C 50 40, 46 24, 50 12 Z" fill="%23FF5722"/>
      <path d="M 50 36 C 54 48, 68 54, 68 68 C 68 78, 60 84, 50 84 C 40 84, 32 78, 32 68 C 32 56, 42 50, 46 42 Z" fill="%23FFC107"/>
      <path d="M 50 56 C 52 62, 58 66, 58 74 C 58 80, 54 82, 50 82 C 46 82, 42 80, 42 74 C 42 68, 48 64, 50 56 Z" fill="%23FFF9C4"/>
    </svg>`,
  },
  {
    id: 'emoji_sparkle_heart',
    name: 'Sparkle Heart',
    category: 'emoji',
    emojiChar: '💖',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M 50 30 C 40 10 10 20 20 50 C 30 75 50 90 50 90 C 50 90 70 75 80 50 C 90 20 60 10 50 30 Z" fill="%23ffffff" stroke="%23ffffff" stroke-width="8" stroke-linejoin="round"/>
      <path d="M 50 30 C 40 10 10 20 20 50 C 30 75 50 90 50 90 C 50 90 70 75 80 50 C 90 20 60 10 50 30 Z" fill="%23E91E63"/>
      <!-- Sparkle Highlights -->
      <polygon points="30,28 32,34 38,36 32,38 30,44 28,38 22,36 28,34" fill="%23FFF"/>
      <polygon points="70,44 71,48 75,50 71,52 70,56 69,52 65,50 69,48" fill="%23FFEB3B"/>
    </svg>`,
  },
  {
    id: 'emoji_sparkles',
    name: 'Magic Sparkles',
    category: 'emoji',
    emojiChar: '✨',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <!-- Main Star -->
      <path d="M 50 10 Q 50 45 15 50 Q 50 50 50 85 Q 50 50 85 50 Q 50 50 50 10 Z" fill="%23FFD700" stroke="%23ffffff" stroke-width="5"/>
      <!-- Small Top-Right Star -->
      <path d="M 76 16 Q 76 28 64 30 Q 76 30 76 42 Q 76 30 88 30 Q 76 30 76 16 Z" fill="%23FFAC33" stroke="%23ffffff" stroke-width="3"/>
      <!-- Small Bottom-Left Star -->
      <path d="M 24 64 Q 24 74 14 76 Q 24 76 24 86 Q 24 76 34 76 Q 24 76 24 64 Z" fill="%2355ACEE" stroke="%23ffffff" stroke-width="3"/>
    </svg>`,
  },
  {
    id: 'emoji_popper',
    name: 'Celebration',
    category: 'emoji',
    emojiChar: '🎉',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <!-- Party Cone -->
      <polygon points="18,82 48,72 28,42" fill="%23FFAC33" stroke="%23ffffff" stroke-width="5" stroke-linejoin="round"/>
      <polygon points="20,80 46,70 34,50" fill="%23FF5722"/>
      <polygon points="26,62 40,58 32,46" fill="%23FFEB3B"/>
      <!-- Confetti Streamers & Ribbons -->
      <circle cx="56" cy="38" r="4" fill="%234CAF50"/>
      <circle cx="70" cy="52" r="4.5" fill="%23E91E63"/>
      <circle cx="48" cy="24" r="4" fill="%232196F3"/>
      <circle cx="78" cy="28" r="3.5" fill="%23FFC107"/>
      <path d="M 44 40 Q 60 20 80 34" stroke="%239C27B0" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M 36 30 Q 52 14 68 18" stroke="%2300BCD4" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'emoji_hundred',
    name: '100 Score',
    category: 'emoji',
    emojiChar: '💯',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="8" y="12" width="84" height="76" rx="18" fill="%23ffffff"/>
      <!-- 100 Score Text Shape in Crimson Red -->
      <g fill="%23DD2E44" font-family="'Impact', 'Arial Black', sans-serif" font-weight="bold" font-size="44">
        <text x="14" y="60">100</text>
      </g>
      <!-- Double Underlines -->
      <line x1="14" y1="70" x2="86" y2="70" stroke="%23DD2E44" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="14" y1="78" x2="86" y2="78" stroke="%23DD2E44" stroke-width="4.5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: 'emoji_rainbow',
    name: 'Rainbow',
    category: 'emoji',
    emojiChar: '🌈',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g stroke-width="7" fill="none">
        <ellipse cx="50" cy="74" rx="42" ry="42" stroke="%23E91E63"/>
        <ellipse cx="50" cy="74" rx="35" ry="35" stroke="%23FF9800"/>
        <ellipse cx="50" cy="74" rx="28" ry="28" stroke="%23FFEB3B"/>
        <ellipse cx="50" cy="74" rx="21" ry="21" stroke="%234CAF50"/>
        <ellipse cx="50" cy="74" rx="14" ry="14" stroke="%232196F3"/>
      </g>
      <!-- Clouds on Bottom Ends -->
      <circle cx="16" cy="74" r="10" fill="%23ffffff" stroke="%23E2E8F0" stroke-width="2"/>
      <circle cx="26" cy="74" r="8" fill="%23ffffff"/>
      <circle cx="84" cy="74" r="10" fill="%23ffffff" stroke="%23E2E8F0" stroke-width="2"/>
      <circle cx="74" cy="74" r="8" fill="%23ffffff"/>
    </svg>`,
  },
  {
    id: 'emoji_crown',
    name: 'Crown',
    category: 'emoji',
    emojiChar: '👑',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <polygon points="12,74 88,74 84,34 62,56 50,22 38,56 16,34" fill="%23FFD700" stroke="%23ffffff" stroke-width="5" stroke-linejoin="round"/>
      <rect x="14" y="68" width="72" height="10" rx="3" fill="%23FFA000"/>
      <!-- Gems on tips -->
      <circle cx="16" cy="34" r="4" fill="%23E91E63"/>
      <circle cx="50" cy="22" r="5" fill="%232196F3"/>
      <circle cx="84" cy="34" r="4" fill="%23E91E63"/>
      <!-- Center Diamonds -->
      <circle cx="34" cy="73" r="3" fill="%234CAF50"/>
      <circle cx="50" cy="73" r="3.5" fill="%23E91E63"/>
      <circle cx="66" cy="73" r="3" fill="%234CAF50"/>
    </svg>`,
  },
  {
    id: 'emoji_thumbs_up',
    name: 'Thumbs Up',
    category: 'emoji',
    emojiChar: '👍',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g transform="translate(10, 10)">
        <path d="M 12 36 L 24 36 L 24 74 L 12 74 Z" fill="%23F4900C" stroke="%23ffffff" stroke-width="4" stroke-linejoin="round"/>
        <path d="M 24 42 L 44 42 C 48 42, 54 28, 46 16 C 42 10, 48 6, 54 10 C 60 14, 58 26, 56 38 L 72 38 C 78 38, 80 44, 76 50 C 80 54, 78 60, 74 64 C 76 68, 72 74, 66 74 L 24 74 Z" 
              fill="%23FFCC4D" stroke="%23ffffff" stroke-width="5" stroke-linejoin="round"/>
      </g>
    </svg>`,
  },
  {
    id: 'emoji_lightning',
    name: 'Electric Zap',
    category: 'emoji',
    emojiChar: '⚡',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <polygon points="56,8 18,52 46,52 38,92 82,42 54,42" fill="%23FFD700" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/>
      <polygon points="54,14 26,50 48,50 42,82 74,44 52,44" fill="%23FFEB3B"/>
    </svg>`,
  },
  // --- FOOD & DRINKS ---
  {
    id: 'coffee_cup',
    name: 'Espresso',
    category: 'food',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <ellipse cx="46" cy="55" rx="34" ry="34" fill="%23ffffff" stroke="%23ffffff" stroke-width="5"/>
        <path d="M 22 40 C 22 75, 70 75, 70 40 Z" fill="%23D97706" stroke="%23ffffff" stroke-width="5"/>
        <path d="M 68 45 C 80 45, 80 62, 66 64" fill="none" stroke="%23ffffff" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="46" cy="40" rx="24" ry="7" fill="%2378350F" stroke="%23ffffff" stroke-width="4"/>
        <path d="M 38 30 Q 40 22, 38 16 M 46 29 Q 48 20, 46 14 M 54 30 Q 56 22, 54 16" fill="none" stroke="%23FDE68A" stroke-width="3" stroke-linecap="round"/>
      </g>
    </svg>`,
  },
  {
    id: 'matcha_latte',
    name: 'Matcha Bowl',
    category: 'food',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <ellipse cx="50" cy="52" rx="36" ry="30" fill="%23ffffff"/>
        <path d="M 20 45 C 20 80, 80 80, 80 45 Z" fill="%2310B981" stroke="%23ffffff" stroke-width="5"/>
        <ellipse cx="50" cy="45" rx="30" ry="10" fill="%23059669" stroke="%23ffffff" stroke-width="4"/>
        <path d="M 45 42 Q 50 38 55 42 Q 50 48 45 42" fill="%23D1FAE5"/>
      </g>
    </svg>`,
  },
  {
    id: 'boba_tea',
    name: 'Boba Milk Tea',
    category: 'food',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <path d="M 30 25 L 70 25 L 64 85 L 36 85 Z" fill="%23ffffff" stroke="%23ffffff" stroke-width="8" stroke-linejoin="round"/>
        <path d="M 32 30 L 68 30 L 63 83 L 37 83 Z" fill="%23FDBA74"/>
        <line x1="50" y1="12" x2="50" y2="80" stroke="%23A855F7" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="50" cy="30" rx="18" ry="4" fill="%23FFF"/>
        <!-- Boba pearls -->
        <circle cx="44" cy="74" r="3.5" fill="%231E1B4B"/>
        <circle cx="56" cy="74" r="3.5" fill="%231E1B4B"/>
        <circle cx="50" cy="67" r="3.5" fill="%231E1B4B"/>
        <circle cx="42" cy="62" r="3" fill="%231E1B4B"/>
        <circle cx="58" cy="63" r="3" fill="%231E1B4B"/>
      </g>
    </svg>`,
  },
  {
    id: 'ramen_bowl',
    name: 'Tonkotsu Ramen',
    category: 'food',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <ellipse cx="50" cy="55" rx="38" ry="32" fill="%23ffffff"/>
        <path d="M 18 48 C 18 84, 82 84, 82 48 Z" fill="%23EF4444" stroke="%23ffffff" stroke-width="5"/>
        <ellipse cx="50" cy="48" rx="32" ry="12" fill="%23FDE68A" stroke="%23ffffff" stroke-width="4"/>
        <!-- Egg & Narutomaki -->
        <circle cx="40" cy="46" r="6" fill="%23FFFFFF"/>
        <circle cx="40" cy="46" r="3.5" fill="%23F97316"/>
        <circle cx="60" cy="46" r="5" fill="%23FFFFFF"/>
        <circle cx="60" cy="46" r="2.5" fill="%23EC4899"/>
        <!-- Chopsticks -->
        <line x1="22" y1="28" x2="78" y2="40" stroke="%2378350F" stroke-width="3.5" stroke-linecap="round"/>
      </g>
    </svg>`,
  },
  {
    id: 'croissant_snack',
    name: 'Butter Croissant',
    category: 'food',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <ellipse cx="50" cy="54" rx="38" ry="24" fill="%23ffffff"/>
        <path d="M 18 64 C 20 38 80 38 82 64 C 70 60 62 48 50 48 C 38 48 30 60 18 64 Z" fill="%23F59E0B" stroke="%23ffffff" stroke-width="4"/>
        <path d="M 32 46 C 40 42 60 42 68 46" stroke="%23B45309" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
  },
  {
    id: 'pizza_slice',
    name: 'Pepperoni Slice',
    category: 'food',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <path d="M 50 85 L 20 28 Q 50 18 80 28 Z" fill="%23F59E0B" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/>
        <path d="M 22 28 Q 50 20 78 28" stroke="%23B45309" stroke-width="7" fill="none"/>
        <circle cx="48" cy="46" r="6" fill="%23DC2626"/>
        <circle cx="36" cy="38" r="5" fill="%23DC2626"/>
        <circle cx="62" cy="40" r="5" fill="%23DC2626"/>
        <circle cx="50" cy="65" r="4.5" fill="%23DC2626"/>
      </g>
    </svg>`,
  },
  {
    id: 'sushi_roll',
    name: 'Salmon Nigiri',
    category: 'food',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <rect x="20" y="44" width="60" height="32" rx="14" fill="%23ffffff" stroke="%23ffffff" stroke-width="5"/>
        <rect x="22" y="46" width="56" height="28" rx="12" fill="%23F8FAFC"/>
        <rect x="16" y="32" width="68" height="24" rx="10" fill="%23F97316" stroke="%23ffffff" stroke-width="4"/>
        <line x1="28" y1="36" x2="38" y2="52" stroke="%23FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="46" y1="36" x2="56" y2="52" stroke="%23FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="44" y="30" width="12" height="46" rx="2" fill="%231E293B"/>
      </g>
    </svg>`,
  },
  {
    id: 'glazed_donut',
    name: 'Strawberry Donut',
    category: 'food',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <circle cx="50" cy="50" r="36" fill="%23ffffff"/>
        <circle cx="50" cy="50" r="32" fill="%23D97706"/>
        <circle cx="50" cy="50" r="28" fill="%23F472B6"/>
        <circle cx="50" cy="50" r="12" fill="%23000000"/>
        <!-- Sprinkles -->
        <line x1="36" y1="34" x2="42" y2="32" stroke="%23FEF08A" stroke-width="3" stroke-linecap="round"/>
        <line x1="62" y1="36" x2="68" y2="38" stroke="%2367E8F9" stroke-width="3" stroke-linecap="round"/>
        <line x1="64" y1="62" x2="58" y2="66" stroke="%23FFFFFF" stroke-width="3" stroke-linecap="round"/>
        <line x1="34" y1="58" x2="40" y2="62" stroke="%23A7F3D0" stroke-width="3" stroke-linecap="round"/>
      </g>
    </svg>`,
  },

  // --- MOOD & CELEBRATIONS ---
  {
    id: 'birthday_cake',
    name: 'Birthday Cake',
    category: 'mood',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <rect x="20" y="50" width="60" height="34" rx="8" fill="%23ffffff" stroke="%23ffffff" stroke-width="6"/>
        <rect x="23" y="53" width="54" height="28" rx="6" fill="%23EC4899"/>
        <path d="M 20 53 Q 28 62 35 53 Q 43 62 50 53 Q 58 62 65 53 Q 73 62 80 53" fill="%23FDE047" stroke="%23ffffff" stroke-width="3"/>
        <!-- Candle -->
        <rect x="47" y="30" width="6" height="20" rx="2" fill="%2338BDF8" stroke="%23ffffff" stroke-width="2"/>
        <path d="M 50 18 Q 46 25 50 28 Q 54 25 50 18 Z" fill="%23F59E0B" stroke="%23ffffff" stroke-width="1.5"/>
      </g>
    </svg>`,
  },
  {
    id: 'party_popper',
    name: 'Celebration Popper',
    category: 'mood',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g transform="rotate(-20 50 50)">
        <polygon points="20,80 40,35 65,60" fill="%23F59E0B" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/>
        <circle cx="65" cy="25" r="4" fill="%23EC4899"/>
        <circle cx="75" cy="40" r="3.5" fill="%2338BDF8"/>
        <circle cx="50" cy="20" r="3" fill="%2310B981"/>
        <path d="M 48 30 Q 60 15 72 24" stroke="%23A855F7" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
  },
  {
    id: 'sparkle_star',
    name: 'Magic Star',
    category: 'mood',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <path d="M 50 10 Q 50 50 10 50 Q 50 50 50 90 Q 50 50 90 50 Q 50 50 50 10 Z" 
              fill="%23FBBF24" stroke="%23FFFFFF" stroke-width="6" stroke-linejoin="round"/>
        <circle cx="50" cy="50" r="7" fill="%23FFFFFF"/>
        <circle cx="75" cy="25" r="4" fill="%23FDE68A"/>
      </g>
    </svg>`,
  },
  {
    id: 'glowing_heart',
    name: 'Ruby Heart',
    category: 'mood',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <path d="M 50 82 C 15 55, 10 25, 34 18 C 45 15, 50 25, 50 25 C 50 25, 55 15, 66 18 C 90 25, 85 55, 50 82 Z" 
              fill="%23FF2D55" stroke="%23FFFFFF" stroke-width="6" stroke-linejoin="round"/>
        <circle cx="36" cy="30" r="4" fill="%23FFFFFF" opacity="0.8"/>
      </g>
    </svg>`,
  },
  {
    id: 'golden_crown',
    name: 'Royal Crown',
    category: 'mood',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <polygon points="20,70 15,35 35,50 50,22 65,50 85,35 80,70" fill="%23F59E0B" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/>
        <circle cx="50" cy="22" r="3.5" fill="%23EF4444"/>
        <circle cx="15" cy="35" r="3" fill="%2338BDF8"/>
        <circle cx="85" cy="35" r="3" fill="%2338BDF8"/>
        <rect x="22" y="65" width="56" height="8" rx="2" fill="%23D97706"/>
      </g>
    </svg>`,
  },
  {
    id: 'fire_flame',
    name: 'Super Flame',
    category: 'mood',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <path d="M 50 15 C 65 35, 80 50, 80 68 C 80 84, 66 90, 50 90 C 34 90, 20 84, 20 68 C 20 50, 35 35, 50 15 Z" fill="%23EF4444" stroke="%23ffffff" stroke-width="6"/>
        <path d="M 50 40 C 60 52, 70 62, 70 74 C 70 82, 60 86, 50 86 C 40 86, 30 82, 30 74 C 30 62, 40 52, 50 40 Z" fill="%23F59E0B"/>
        <path d="M 50 60 C 55 68, 60 74, 60 80 C 60 84, 55 86, 50 86 C 45 86, 40 84, 40 80 C 40 74, 45 68, 50 60 Z" fill="%23FEF08A"/>
      </g>
    </svg>`,
  },

  // --- ACTIVITIES & HOBBIES ---
  {
    id: 'camera_retro',
    name: 'Retro Cam',
    category: 'activity',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <rect x="15" y="30" width="70" height="50" rx="12" fill="%23ffffff" stroke="%23ffffff" stroke-width="5"/>
        <rect x="18" y="33" width="64" height="44" rx="9" fill="%231E293B"/>
        <rect x="25" y="24" width="22" height="10" rx="4" fill="%2394A3B8" stroke="%23ffffff" stroke-width="4"/>
        <circle cx="50" cy="55" r="18" fill="%2338BDF8" stroke="%23ffffff" stroke-width="5"/>
        <circle cx="50" cy="55" r="9" fill="%230F172A"/>
        <circle cx="54" cy="51" r="3" fill="%23FFFFFF"/>
        <circle cx="70" cy="40" r="4" fill="%23EF4444"/>
      </g>
    </svg>`,
  },
  {
    id: 'airplane_travel',
    name: 'Jet Voyage',
    category: 'activity',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g transform="rotate(-25 50 50)">
        <path d="M 50 15 L 60 45 L 88 58 L 88 66 L 60 58 L 60 78 L 70 85 L 70 92 L 50 87 L 30 92 L 30 85 L 40 78 L 40 58 L 12 66 L 12 58 L 40 45 Z" 
              fill="%236366F1" stroke="%23FFFFFF" stroke-width="6" stroke-linejoin="round"/>
        <circle cx="50" cy="30" r="3" fill="%23FFFFFF"/>
      </g>
    </svg>`,
  },
  {
    id: 'gamepad_console',
    name: 'Pro Controller',
    category: 'activity',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <path d="M 22 35 C 32 32, 68 32, 78 35 C 90 40, 94 75, 82 82 C 72 88, 64 68, 50 68 C 36 68, 28 88, 18 82 C 6 75, 10 40, 22 35 Z" 
              fill="%236366F1" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/>
        <!-- D-pad -->
        <rect x="28" y="48" width="14" height="4" rx="2" fill="%231E1B4B"/>
        <rect x="33" y="43" width="4" height="14" rx="2" fill="%231E1B4B"/>
        <!-- Buttons -->
        <circle cx="70" cy="46" r="3" fill="%23EF4444"/>
        <circle cx="64" cy="52" r="3" fill="%2338BDF8"/>
        <circle cx="76" cy="52" r="3" fill="%23F59E0B"/>
        <circle cx="70" cy="58" r="3" fill="%2310B981"/>
      </g>
    </svg>`,
  },
  {
    id: 'headphones_music',
    name: 'DJ Headphones',
    category: 'activity',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <path d="M 22 55 A 28 28 0 0 1 78 55" fill="none" stroke="%23ffffff" stroke-width="9" stroke-linecap="round"/>
        <path d="M 22 55 A 28 28 0 0 1 78 55" fill="none" stroke="%23EC4899" stroke-width="5" stroke-linecap="round"/>
        <!-- Earcups -->
        <rect x="14" y="50" width="14" height="24" rx="6" fill="%231E293B" stroke="%23ffffff" stroke-width="4"/>
        <rect x="72" y="50" width="14" height="24" rx="6" fill="%231E293B" stroke="%23ffffff" stroke-width="4"/>
      </g>
    </svg>`,
  },
  {
    id: 'vinyl_record',
    name: 'Indie Vinyl',
    category: 'activity',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <circle cx="50" cy="50" r="38" fill="%23ffffff"/>
        <circle cx="50" cy="50" r="34" fill="%2309090B"/>
        <circle cx="50" cy="50" r="26" fill="none" stroke="%2327272A" stroke-width="2"/>
        <circle cx="50" cy="50" r="18" fill="none" stroke="%2327272A" stroke-width="1.5"/>
        <circle cx="50" cy="50" r="12" fill="%23EF4444"/>
        <circle cx="50" cy="50" r="3.5" fill="%23FFFFFF"/>
      </g>
    </svg>`,
  },
  {
    id: 'running_shoe',
    name: 'Speed Runner',
    category: 'activity',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <path d="M 15 65 C 15 65 25 35 48 35 C 60 35 70 48 85 58 C 88 62 85 72 75 72 L 20 72 C 16 72 15 68 15 65 Z" 
              fill="%23EC4899" stroke="%23FFFFFF" stroke-width="6" stroke-linejoin="round"/>
        <rect x="18" y="66" width="66" height="8" rx="4" fill="%23FFFFFF"/>
        <path d="M 38 42 L 52 56 M 46 40 L 60 54" stroke="%23FDE047" stroke-width="3" stroke-linecap="round"/>
      </g>
    </svg>`,
  },
  {
    id: 'gym_dumbbell',
    name: 'Iron Dumbbell',
    category: 'activity',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g transform="rotate(-30 50 50)">
        <rect x="25" y="46" width="50" height="8" rx="2" fill="%23CBD5E1" stroke="%23ffffff" stroke-width="4"/>
        <rect x="18" y="30" width="10" height="40" rx="4" fill="%23334155" stroke="%23ffffff" stroke-width="4"/>
        <rect x="72" y="30" width="10" height="40" rx="4" fill="%23334155" stroke="%23ffffff" stroke-width="4"/>
        <rect x="12" y="36" width="8" height="28" rx="3" fill="%2364748B" stroke="%23ffffff" stroke-width="3"/>
        <rect x="80" y="36" width="8" height="28" rx="3" fill="%2364748B" stroke="%23ffffff" stroke-width="3"/>
      </g>
    </svg>`,
  },
  {
    id: 'books_stack',
    name: 'Study Books',
    category: 'activity',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <rect x="20" y="62" width="60" height="14" rx="3" fill="%233B82F6" stroke="%23ffffff" stroke-width="4"/>
        <rect x="25" y="46" width="52" height="14" rx="3" fill="%23EC4899" stroke="%23ffffff" stroke-width="4"/>
        <rect x="30" y="30" width="44" height="14" rx="3" fill="%2310B981" stroke="%23ffffff" stroke-width="4"/>
        <!-- Book spine lines -->
        <line x1="32" y1="62" x2="32" y2="76" stroke="%23FEF08A" stroke-width="2.5"/>
        <line x1="36" y1="46" x2="36" y2="60" stroke="%23FFFFFF" stroke-width="2.5"/>
      </g>
    </svg>`,
  },

  // --- NATURE & PETS ---
  {
    id: 'shiba_pup',
    name: 'Happy Shiba',
    category: 'nature',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <circle cx="50" cy="52" r="36" fill="%23ffffff"/>
        <ellipse cx="50" cy="52" rx="30" ry="26" fill="%23F59E0B"/>
        <polygon points="26,38 32,15 48,32" fill="%23D97706" stroke="%23ffffff" stroke-width="4"/>
        <polygon points="74,38 68,15 52,32" fill="%23D97706" stroke="%23ffffff" stroke-width="4"/>
        <ellipse cx="50" cy="60" rx="18" ry="14" fill="%23FEF3C7"/>
        <ellipse cx="50" cy="53" rx="5" ry="3.5" fill="%231F2937"/>
        <circle cx="38" cy="48" r="3.5" fill="%231F2937"/>
        <circle cx="62" cy="48" r="3.5" fill="%231F2937"/>
        <circle cx="32" cy="56" r="4" fill="%23F87171" opacity="0.6"/>
        <circle cx="68" cy="56" r="4" fill="%23F87171" opacity="0.6"/>
      </g>
    </svg>`,
  },
  {
    id: 'cute_kitten',
    name: 'Sleepy Cat',
    category: 'nature',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <circle cx="50" cy="54" r="36" fill="%23ffffff"/>
        <ellipse cx="50" cy="54" rx="28" ry="24" fill="%2394A3B8"/>
        <!-- Ears -->
        <polygon points="28,40 30,20 44,36" fill="%23F472B6" stroke="%23ffffff" stroke-width="4"/>
        <polygon points="72,40 70,20 56,36" fill="%23F472B6" stroke="%23ffffff" stroke-width="4"/>
        <!-- Eyes closed -->
        <path d="M 36 50 Q 40 54 44 50" stroke="%231E293B" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 56 50 Q 60 54 64 50" stroke="%231E293B" stroke-width="3" fill="none" stroke-linecap="round"/>
        <polygon points="48,56 52,56 50,59" fill="%23F472B6"/>
        <line x1="28" y1="56" x2="42" y2="57" stroke="%23FFFFFF" stroke-width="2"/>
        <line x1="72" y1="56" x2="58" y2="57" stroke="%23FFFFFF" stroke-width="2"/>
      </g>
    </svg>`,
  },
  {
    id: 'house_plant',
    name: 'Monstera Leaf',
    category: 'nature',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <ellipse cx="50" cy="50" rx="35" ry="38" fill="%23ffffff"/>
        <path d="M 50 15 C 75 25 85 60 50 85 C 15 60 25 25 50 15 Z" fill="%2310B981" stroke="%23ffffff" stroke-width="4"/>
        <line x1="50" y1="18" x2="50" y2="85" stroke="%23047857" stroke-width="3"/>
        <path d="M 50 35 Q 32 40 25 46 M 50 50 Q 30 58 26 66 M 50 35 Q 68 40 75 46 M 50 50 Q 70 58 74 66" stroke="%23047857" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`,
  },
  {
    id: 'cherry_blossom',
    name: 'Sakura Petal',
    category: 'nature',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <circle cx="50" cy="50" r="34" fill="%23ffffff"/>
        <circle cx="50" cy="32" r="14" fill="%23F472B6"/>
        <circle cx="67" cy="44" r="14" fill="%23F472B6"/>
        <circle cx="61" cy="65" r="14" fill="%23F472B6"/>
        <circle cx="39" cy="65" r="14" fill="%23F472B6"/>
        <circle cx="33" cy="44" r="14" fill="%23F472B6"/>
        <circle cx="50" cy="50" r="8" fill="%23FEF08A" stroke="%23ffffff" stroke-width="2"/>
      </g>
    </svg>`,
  },
  {
    id: 'sunflower_bright',
    name: 'Sun Golden',
    category: 'nature',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <circle cx="50" cy="50" r="36" fill="%23ffffff"/>
        <circle cx="50" cy="50" r="30" fill="%23F59E0B"/>
        <circle cx="50" cy="50" r="18" fill="%2378350F" stroke="%23ffffff" stroke-width="3"/>
        <circle cx="45" cy="46" r="2.5" fill="%23FDE68A"/>
        <circle cx="55" cy="54" r="2.5" fill="%23FDE68A"/>
      </g>
    </svg>`,
  },
  {
    id: 'mountain_camp',
    name: 'Alpine Peak',
    category: 'nature',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <polygon points="50,18 85,78 15,78" fill="%230EA5E9" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/>
        <polygon points="50,18 64,44 54,38 46,44 36,44" fill="%23FFFFFF"/>
        <polygon points="68,40 92,80 44,80" fill="%230284C7" opacity="0.6"/>
      </g>
    </svg>`,
  },

  // --- OBJECTS & TECH ---
  {
    id: 'laptop_code',
    name: 'Dev Station',
    category: 'objects',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <rect x="20" y="25" width="60" height="42" rx="6" fill="%236366F1" stroke="%23ffffff" stroke-width="5"/>
        <rect x="25" y="30" width="50" height="32" rx="3" fill="%230F172A"/>
        <path d="M 32 42 L 38 46 L 32 50 M 42 50 L 52 50" stroke="%2338BDF8" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 12 70 L 88 70 C 88 74 84 76 80 76 L 20 76 C 16 76 12 74 12 70 Z" fill="%23CBD5E1" stroke="%23ffffff" stroke-width="4"/>
      </g>
    </svg>`,
  },
  {
    id: 'rocket_launch',
    name: 'Cosmic Rocket',
    category: 'objects',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g transform="rotate(45 50 50)">
        <path d="M 50 12 C 38 32, 38 60, 38 72 L 62 72 C 62 60, 62 32, 50 12 Z" fill="%23F8FAFC" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/>
        <!-- Fins -->
        <polygon points="38,55 24,75 38,72" fill="%23EF4444" stroke="%23ffffff" stroke-width="4"/>
        <polygon points="62,55 76,75 62,72" fill="%23EF4444" stroke="%23ffffff" stroke-width="4"/>
        <circle cx="50" cy="40" r="7" fill="%2338BDF8" stroke="%23ffffff" stroke-width="3"/>
        <!-- Flame -->
        <polygon points="44,74 50,92 56,74" fill="%23F59E0B"/>
      </g>
    </svg>`,
  },
  {
    id: 'art_palette',
    name: 'Paint Palette',
    category: 'objects',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <path d="M 50 18 C 75 18, 88 38, 80 62 C 75 76, 60 76, 56 68 C 52 60, 42 60, 38 68 C 30 84, 12 68, 16 48 C 20 28, 35 18, 50 18 Z" 
              fill="%23FBBF24" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/>
        <circle cx="34" cy="36" r="5" fill="%23EF4444"/>
        <circle cx="50" cy="30" r="5" fill="%233B82F6"/>
        <circle cx="66" cy="38" r="5" fill="%2310B981"/>
        <circle cx="72" cy="54" r="5" fill="%23A855F7"/>
      </g>
    </svg>`,
  },
  {
    id: 'diamond_gem',
    name: 'Rare Gem',
    category: 'objects',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g>
        <polygon points="30,28 70,28 88,48 50,82 12,48" fill="%2338BDF8" stroke="%23ffffff" stroke-width="6" stroke-linejoin="round"/>
        <line x1="12" y1="48" x2="88" y2="48" stroke="%23FFFFFF" stroke-width="3"/>
        <line x1="30" y1="28" x2="40" y2="48" stroke="%23FFFFFF" stroke-width="2.5"/>
        <line x1="70" y1="28" x2="60" y2="48" stroke="%23FFFFFF" stroke-width="2.5"/>
        <line x1="40" y1="48" x2="50" y2="82" stroke="%23FFFFFF" stroke-width="2.5"/>
        <line x1="60" y1="48" x2="50" y2="82" stroke="%23FFFFFF" stroke-width="2.5"/>
      </g>
    </svg>`,
  },
  {
    id: 'calendo_icon_gift',
    name: 'Calendo Gift',
    category: 'objects',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="10" y="10" width="80" height="80" rx="20" fill="%23EED5B3" stroke="%23ffffff" stroke-width="5"/>
      <rect x="22" y="20" width="56" height="60" rx="12" fill="%23FCFAF5"/>
      <rect x="22" y="20" width="56" height="18" fill="%23FF5A5F"/>
      <circle cx="36" cy="28" r="3" fill="%236A1315"/>
      <circle cx="64" cy="28" r="3" fill="%236A1315"/>
      <rect x="34" cy="26" width="32" height="4" rx="2" fill="%23FFF8DE"/>
      <g stroke="%2338BDF8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M 50 48 C 47 43 40 42 40 46 C 40 49 46 50 50 50 Z"/>
        <path d="M 50 48 C 53 43 60 42 60 46 C 60 49 54 50 50 50 Z"/>
        <rect x="38" y="50" width="24" height="6" rx="1"/>
        <rect x="40" y="56" width="20" height="16" rx="1"/>
        <line x1="50" y1="50" x2="50" y2="72"/>
      </g>
    </svg>`,
  },
];

export const PRESET_STICKERS: PresetSticker[] = RAW_STICKERS.map((s) => ({
  ...s,
  svgUrl: encodeSvgUri(s.svgUrl),
}));


