import type { ThemeName } from './index';

/**
 * Apply a theme to an element
 */
export function applyTheme(element: HTMLElement, themeName: ThemeName): void {
  element.setAttribute('data-theme', themeName);
  element.classList.toggle('dark', themeName === 'dark');
}

/**
 * Get CSS content for a theme
 */
export function getThemeCSS(themeName: ThemeName): string {
  // This would dynamically load theme CSS
  // For now, return empty string - themes are loaded via CSS imports
  return '';
}

/**
 * Set global theme for the document
 */
export function setGlobalTheme(themeName: ThemeName): void {
  document.documentElement.setAttribute('data-theme', themeName);
  document.documentElement.classList.toggle('dark', themeName === 'dark');
}

/**
 * Get the current theme
 */
export function getCurrentTheme(): ThemeName {
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark' || theme === 'acme' || theme === 'light') {
    return theme;
  }
  return 'light';
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): ThemeName {
  const current = getCurrentTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setGlobalTheme(next);
  return next;
}

/**
 * Check if dark theme is active
 */
export function isDarkTheme(): boolean {
  return getCurrentTheme() === 'dark';
}

/**
 * Check if light theme is active
 */
export function isLightTheme(): boolean {
  return getCurrentTheme() === 'light';
}
