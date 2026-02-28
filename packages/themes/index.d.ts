export const themes: {
  readonly light: "light";
  readonly dark: "dark";
  readonly acme: "acme";
};

export type ThemeName = keyof typeof themes;

export function applyTheme(element: HTMLElement, themeName: ThemeName): void;
export function getThemeCSS(themeName: ThemeName): string;
export function setGlobalTheme(themeName: ThemeName): void;
export function getCurrentTheme(): ThemeName;
export function toggleTheme(): ThemeName;
export function isDarkTheme(): boolean;
export function isLightTheme(): boolean;
