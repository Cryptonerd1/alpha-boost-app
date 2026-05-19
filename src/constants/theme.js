/**
 * Theme — Single source of truth for all design tokens.
 * Change a value here and it updates everywhere.
 */

export const Colors = {
  // Brand
  primary: '#22c55e',
  primaryDark: '#16a34a',
  primaryLight: '#dcfce7',
  primaryBorder: '#bbf7d0',

  // Neutrals
  black: '#111827',
  white: '#ffffff',
  grey: '#6b7280',
  lightGrey: '#f3f4f6',
  border: '#e5e7eb',
  background: '#ffffff',

  // Performance pillars
  bloodFlow: '#22c55e',
  testosterone: '#f59e0b',
  stamina: '#3b82f6',
  stress: '#f43f5e',
  fertility: '#8b5cf6',

  // Verdicts
  boost: '#22c55e',
  boostBg: '#dcfce7',
  neutral: '#f59e0b',
  neutralBg: '#fef9c3',
  avoid: '#ef4444',
  avoidBg: '#fee2e2',

  // Streak
  streakOrange: '#ea580c',
  streakBg: '#fff7ed',
  streakBorder: '#fed7aa',
};

export const Typography = {
  // Weights
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',

  // Sizes
  xs: 10,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  '2xl': 22,
  '3xl': 26,
  '4xl': 32,
  hero: 64,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  screenTop: 60,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  '2xl': 20,
  pill: 100,
  full: 9999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  fab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};
