// =====================================================
// CAMPUSFIX DESIGN SYSTEM
// Global Typography, Colors, Spacing & Geometry
// =====================================================

/*
 * =====================================================
 * TYPOGRAPHY
 * =====================================================
 *
 * Inter is used throughout the entire application.
 * This keeps Student, Technician and Warden screens
 * visually consistent.
 */

export const Typography = {
  // Font Families
  display: 'Inter_700Bold',
  displaySemiBold: 'Inter_600SemiBold',
  displayRegular: 'Inter_400Regular',

  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',

  // Keep these names because existing screens use them.
  // They now also use Inter for consistency.
  mono: 'Inter_400Regular',
  monoMedium: 'Inter_500Medium',
  monoBold: 'Inter_700Bold',

  // Font Sizes
  sizes: {
    hero: 36,
    h1: 32,
    h2: 24,
    h3: 20,

    body: 14,
    bodyLarge: 16,

    caption: 13,
    micro: 11,
    tag: 11,
  },

  // Line Heights
  lineHeights: {
    hero: 42,
    h1: 38,
    h2: 30,
    h3: 26,

    body: 20,
    bodyLarge: 22,

    caption: 18,
    micro: 15,
  },
};


/*
 * =====================================================
 * GLOBAL COLOR PALETTE
 * =====================================================
 *
 * Based on the new CampusFix login design:
 *
 * Background  → deep navy / charcoal
 * Surface     → slate
 * Text        → warm white
 * Secondary   → muted blue-grey
 * Accent      → warm orange
 */

export const Palette = {
  // ---------------------------------------------------
  // Brand Accent
  // ---------------------------------------------------

  accent: '#F2643D',
  accentHover: '#DE5330',
  accentSubtleLight: '#FCEDE8',
  accentSubtleDark: '#3A2723',

  // ---------------------------------------------------
  // Status Colors
  // ---------------------------------------------------

  status: {
    reported: '#7F8998',
    assigned: '#7189A5',
    inProgress: '#F2643D',
    resolved: '#6F9875',
  },

  // ---------------------------------------------------
  // Priority Colors
  // ---------------------------------------------------

  priority: {
    high: '#F2643D',
    medium: '#E58A68',
    low: '#6F9875',
  },
};


/*
 * =====================================================
 * SHARED DARK CAMPUSFIX COLORS
 * =====================================================
 */

const CampusDarkColors = {
  background: '#171C23',

  surface: '#202731',

  surfaceSubtle: '#252D38',

  surfaceHover: '#2B3440',

  textPrimary: '#F7F5F0',

  textSecondary: '#A8B2C0',

  textMuted: '#7F8998',

  border: '#354150',

  borderLight: '#2C3541',

  borderFocus: '#F2643D',

  accent: '#F2643D',

  accentSubtle: '#3A2723',

  cardBackground: '#202731',

  inputBackground: '#202731',

  inputBorder: '#354150',

  tabBarBackground: '#171C23',

  tabBarBorder: '#354150',

  tabBarActive: '#F2643D',

  tabBarInactive: '#7F8998',

  divider: '#2C3541',
};


/*
 * =====================================================
 * STUDENT THEME
 * =====================================================
 *
 * Student now uses the SAME visual language as the
 * Login / Technician / Warden screens.
 *
 * This means the entire app feels like one product.
 */

export const StudentTheme = {
  name: 'student' as const,

  isDark: true,

  colors: CampusDarkColors,

  status: Palette.status,

  priority: Palette.priority,
};


/*
 * =====================================================
 * TECHNICIAN / WARDEN / LOGIN THEME
 * =====================================================
 */

export const DarkTheme = {
  name: 'dark' as const,

  isDark: true,

  colors: CampusDarkColors,

  status: Palette.status,

  priority: Palette.priority,
};


/*
 * =====================================================
 * THEME TYPE
 * =====================================================
 */

export type AppTheme =
  | typeof StudentTheme
  | typeof DarkTheme;


/*
 * =====================================================
 * SPACING
 * =====================================================
 */

export const Spacing = {
  screenHorizontal: 24,

  screenVertical: 20,

  cardPadding: 16,

  cardPaddingCompact: 12,

  gap: 16,

  gapSmall: 8,

  gapMicro: 4,

  gapLarge: 24,

  gapExtraLarge: 32,

  inputHeight: 46,

  buttonHeight: 48,

  buttonHeightSmall: 38,

  minTouchTarget: 48,
};


/*
 * =====================================================
 * GEOMETRY
 * =====================================================
 */

export const Geometry = {
  /*
   * The new design uses slightly rounded cards,
   * unlike the old completely square design.
   */

  radiusNone: 0,

  radiusSmall: 8,

  radiusMedium: 12,

  radiusLarge: 20,

  radiusPill: 999,

  borderWidthThin: 1,

  borderWidthMedium: 1.5,

  borderWidthThick: 2,
};