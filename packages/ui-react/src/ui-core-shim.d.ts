declare module '@editora/ui-core' {
  export type Placement = 'top' | 'bottom' | 'left' | 'right';

  export interface ThemeTokens {
    colors: {
      primary: string;
      primaryHover?: string;
      foregroundOnPrimary?: string;
      background?: string;
      surface?: string;
      text?: string;
      muted?: string;
      success?: string;
      danger?: string;
      warning?: string;
    };
    radius?: string;
    shadows?: { sm?: string; md?: string };
    spacing?: { xs?: string; sm?: string; md?: string; lg?: string };
    typography?: { family?: string; size?: { sm?: string; md?: string; lg?: string } };
    motion?: { durationShort?: string; durationBase?: string; durationLong?: string; easing?: string };
    zIndex?: { modal?: number; overlay?: number; toast?: number };
    breakpoints?: { sm?: string; md?: string; lg?: string };
  }

  export const defaultTokens: ThemeTokens;

  export function applyTheme(
    tokens: ThemeTokens,
    root?: ShadowRoot | Document | null
  ): void;

  export function registerThemeHost(el: HTMLElement): void;

  export function computePosition(
    anchor: HTMLElement | { getBoundingClientRect: () => DOMRect },
    content: HTMLElement,
    options?:
      | Placement
      | {
          placement?: Placement;
          offset?: number;
          flip?: boolean;
          shift?: boolean;
          arrow?: HTMLElement | null;
        }
  ): {
    top: number;
    left: number;
    placement: Placement;
    x?: number;
    y?: number;
  };

  export function showToast(
    message: string,
    options?: {
      duration?: number;
    }
  ): (() => void) | void;
}
