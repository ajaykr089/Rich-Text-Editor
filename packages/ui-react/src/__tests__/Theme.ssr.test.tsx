import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../components';

function Consumer() {
  const { tokens } = useTheme() as any;
  return <div data-testid="primary">{tokens.colors.primary}</div>;
}

describe('ThemeProvider SSR hydration behavior', () => {
  beforeEach(() => {
    document.documentElement.style.cssText = '';
    localStorage.clear();
  });

  it('picks up server-rendered CSS variables on mount when no tokens prop provided', () => {
    // simulate server-rendered CSS variables
    document.documentElement.style.setProperty('--ui-color-primary', '#123456');
    document.documentElement.style.setProperty('--ui-color-text', '#222222');

    const { getByTestId } = render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    // ThemeProvider should have initialized from DOM vars
    expect(getByTestId('primary').textContent).toBe('#123456');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary').trim()).toBe('#123456');
  });

  it('overrides server DOM variables when tokens prop is provided', () => {
    document.documentElement.style.setProperty('--ui-color-primary', '#000000');

    const { getByTestId } = render(
      <ThemeProvider tokens={{ colors: { primary: '#abcdef' } }}>
        <Consumer />
      </ThemeProvider>
    );

    expect(getByTestId('primary').textContent).toBe('#abcdef');
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary').trim()).toBe('#abcdef');
  });
});