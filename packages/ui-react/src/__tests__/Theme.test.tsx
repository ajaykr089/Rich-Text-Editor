import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme, Button } from '../components';

function Consumer() {
  const { tokens, setTokens } = useTheme() as any;
  return (
    <div>
      <div data-testid="primary">{tokens.colors.primary}</div>
      <Button onClick={() => setTokens({ ...tokens, colors: { ...tokens.colors, primary: '#000000' } })}>Set</Button>
    </div>
  );
}

describe('ThemeProvider (React)', () => {
  it('applies tokens and allows updates via useTheme', () => {
    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    expect(getByTestId('primary').textContent).toBeDefined();
    fireEvent.click(getByText('Set'));
    expect(getByTestId('primary').textContent).toBe('#000000');
    // CSS variable should be set on documentElement
    expect(getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary').trim()).toBe('#000000');
  });
});