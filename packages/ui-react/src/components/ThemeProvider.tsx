import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { applyTheme, defaultTokens, registerThemeHost, ThemeTokens } from '@editora/ui-core';

type ThemeContextValue = {
  tokens: ThemeTokens;
  setTokens: (t: ThemeTokens) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = {
  tokens?: Partial<ThemeTokens>;
  children: React.ReactNode;
  /**
   * If provided (default: 'editora.theme.tokens'), theme tokens will be persisted to localStorage.
   * Set to `null` to disable persistence.
   */
  storageKey?: string | null;
};

function readTokensFromDOM(): Partial<ThemeTokens> {
  try {
    const cs = getComputedStyle(document.documentElement);
    const primary = cs.getPropertyValue('--ui-color-primary').trim();
    if (!primary) return {};
    return {
      colors: {
        primary: primary || undefined,
        text: cs.getPropertyValue('--ui-color-text').trim() || undefined,
        background: cs.getPropertyValue('--ui-color-background').trim() || undefined
      }
    } as Partial<ThemeTokens>;
  } catch (e) {
    return {};
  }
}

export function ThemeProvider({ tokens, children, storageKey = 'editora.theme.tokens' }: Props) {
  const computeInitial = () => {
    // prefer persisted value
    if (typeof window !== 'undefined' && storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) return JSON.parse(raw) as ThemeTokens;
      } catch (e) { /* ignore */ }
    }

    // tokens prop wins next
    if (tokens && Object.keys(tokens).length) return ({ ...defaultTokens, ...(tokens as any) } as ThemeTokens);

    // attempt to pick up server-rendered CSS variables (SSR hydration safety)
    if (typeof window !== 'undefined') {
      const dom = readTokensFromDOM();
      if (dom.colors && dom.colors.primary) return ({ ...defaultTokens, ...dom } as ThemeTokens);
    }

    return ({ ...defaultTokens, ...(tokens || {}) } as ThemeTokens);
  };

  const [current, setCurrent] = useState<ThemeTokens>(() => computeInitial());

  // respond to external tokens prop changes (controlled usage / Storybook controls)
  useEffect(() => {
    if (tokens && Object.keys(tokens).length) {
      setCurrent((prev) => ({ ...prev, ...(tokens as any) }));
    }
  }, [tokens]);

  // persist changes and apply tokens to document
  useEffect(() => {
    applyTheme(current);
    try { registerThemeHost(document.documentElement); } catch (e) {}

    // persist tokens lazily to avoid blocking UI when users rapidly change tokens (Storybook controls)
    if (typeof window !== 'undefined' && storageKey) {
      const payload = JSON.stringify(current);
      let idleId: number | undefined;
      const save = () => {
        try { localStorage.setItem(storageKey, payload); } catch (e) {}
      };

      if ((window as any).requestIdleCallback) {
        idleId = (window as any).requestIdleCallback(save, { timeout: 1000 });
      } else {
        idleId = window.setTimeout(save, 250);
      }

      return () => {
        try {
          if ((window as any).cancelIdleCallback && idleId) (window as any).cancelIdleCallback(idleId);
          else if (idleId) clearTimeout(idleId);
        } catch (e) {}
      };
    }

    return;
  }, [current, storageKey]);

  const setTokens = (t: ThemeTokens) => setCurrent(t);

  return (
    <ThemeContext.Provider value={{ tokens: current, setTokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeProvider;