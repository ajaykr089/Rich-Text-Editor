import React, { useState, useMemo } from 'react';
import { ThemeProvider, Button } from '@editora/ui-react';

// Default light and dark theme tokens
const light = {
  colors: { primary: '#2563eb', background: '#ffffff', text: '#111827' },
  radius: '8px',
  typography: { size: { md: '16px' } }
};
const dark = {
  colors: { primary: '#7c3aed', background: '#111827', text: '#f8fafc' },
  radius: '8px',
  typography: { size: { md: '16px' } }
};

export const withThemeSwitcher = (Story, context) => {
  const [theme, setTheme] = useState('light');
  const tokens = useMemo(() => (theme === 'dark' ? dark : light), [theme]);
  return (
    <ThemeProvider tokens={tokens}>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
        <Button size="sm" variant="secondary" onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </Button>
      </div>
      <div style={{ background: 'var(--ui-color-background)', color: 'var(--ui-color-text)', minHeight: '100vh', transition: 'background 0.2s, color 0.2s' }}>
        <Story {...context} />
      </div>
    </ThemeProvider>
  );
};
