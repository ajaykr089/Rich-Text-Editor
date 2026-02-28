import { describe, it, expect } from 'vitest';

describe('UIButton disabled parsing', () => {
  it('treats disabled="false" as not disabled', () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('disabled', 'false');
    document.body.appendChild(el);

    const btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    expect(btn?.hasAttribute('disabled')).toBe(false);
  });

  it('treats presence of disabled attribute as disabled', () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('disabled', '');
    document.body.appendChild(el);

    const btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn?.hasAttribute('disabled')).toBe(true);
  });

  it('loading still disables inner button regardless of disabled attr', () => {
    const el = document.createElement('ui-button') as HTMLElement;
    el.setAttribute('loading', '');
    document.body.appendChild(el);

    const btn = el.shadowRoot?.querySelector('button') as HTMLButtonElement | null;
    expect(btn?.hasAttribute('disabled')).toBe(true);
  });
});