// Theme utilities and exports
export {
  applyTheme,
  getThemeCSS,
  setGlobalTheme,
  getCurrentTheme,
  toggleTheme,
  isDarkTheme,
  isLightTheme
} from './utils';

/**
 * Available theme presets
 */
export const themes = {
  light: 'light',
  dark: 'dark'
} as const;

export type ThemeName = keyof typeof themes;
