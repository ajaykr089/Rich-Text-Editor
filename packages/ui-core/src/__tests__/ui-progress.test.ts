import { describe, it, expect } from 'vitest';
import '../components/ui-progress';

describe('ui-progress', () => {
  it('reflects value/max/buffer and emits change + complete', () => {
    const el = document.createElement('ui-progress') as HTMLElement;
    el.setAttribute('value', '25');
    el.setAttribute('buffer', '45');
    el.setAttribute('max', '100');
    document.body.appendChild(el);

    const track = el.shadowRoot?.querySelector('[role="progressbar"]') as HTMLElement | null;
    expect(track).toBeTruthy();
    expect(track?.getAttribute('aria-valuenow')).toBe('25');
    expect(track?.getAttribute('aria-valuemax')).toBe('100');

    let changeCount = 0;
    let completeCount = 0;
    el.addEventListener('change', () => { changeCount += 1; });
    el.addEventListener('complete', () => { completeCount += 1; });

    el.setAttribute('value', '100');
    expect(changeCount).toBeGreaterThan(0);
    expect(completeCount).toBe(1);

    const buffer = el.shadowRoot?.querySelector('.buffer') as HTMLElement | null;
    const value = el.shadowRoot?.querySelector('.value') as HTMLElement | null;
    expect(buffer?.getAttribute('style') || '').toContain('45');
    expect(value?.getAttribute('style') || '').toContain('100');

    el.remove();
  });

  it('supports indeterminate mode aria semantics', () => {
    const el = document.createElement('ui-progress') as HTMLElement;
    el.setAttribute('indeterminate', '');
    document.body.appendChild(el);

    const track = el.shadowRoot?.querySelector('[role="progressbar"]') as HTMLElement | null;
    expect(track).toBeTruthy();
    expect(track?.getAttribute('aria-valuetext')).toBe('Loading');
    expect(track?.getAttribute('aria-busy')).toBe('true');

    el.remove();
  });
});
