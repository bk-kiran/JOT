// Brand colors matching jot-landing-page globals.css
export const Colors = {
  background: 'hsl(220, 20%, 4%)',     // #070C14
  card: 'hsl(220, 18%, 8%)',            // #0F1520
  border: 'hsl(220, 18%, 14%)',         // #1C2535
  muted: 'hsl(220, 15%, 55%)',          // #7D8EA8
  primary: 'hsl(200, 100%, 55%)',       // #0DB8F5
  white: '#FFFFFF',
  black: '#000000',

  // Status colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;

export const Fonts = {
  sans: 'SpaceGrotesk',
  mono: 'JetBrainsMono',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const UNDO_WINDOW_MS = 4000;
export const FREE_TIER_DAILY_LIMIT = 10;
export const AI_CONFIDENCE_HIGH = 0.85;
export const AI_CONFIDENCE_LOW = 0.60;
