import { describe, it, expect, beforeEach } from 'vitest';

describe('layout primitives (ui-box / ui-flex / ui-grid / ui-section / ui-container)', () => {
  beforeEach(() => {
    const root = document.getElementById('ui-portal-root');
    if (root && root.parentElement) root.parentElement.removeChild(root);
  });

  it('ui-box applies padding and margin attributes to host style', () => {
    const el = document.createElement('ui-box') as any;
    el.setAttribute('p', 'sm');
    el.setAttribute('m', '8px');
    document.body.appendChild(el);

    expect(el.style.padding).toBeDefined();
    expect(el.style.margin).toBe('8px');

    el.remove();
  });

  it('ui-box accepts responsive JSON attributes and injects scoped CSS', () => {
    const el = document.createElement('ui-box') as any;
    // use token for initial and different value for md breakpoint
    el.setAttribute('p', JSON.stringify({ initial: 'md', md: 'lg' }));
    document.body.appendChild(el);

    // class added to host
    const cls = Array.from(el.classList).find((c: string) => c.startsWith('ui-box-rsp-'));
    expect(cls).toBeTruthy();

    // style tag should exist in head with media query for md and mapped token
    const style = Array.from(document.head.querySelectorAll('style')).find(s => s.textContent && s.textContent.includes(cls as string));
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('@media (min-width: var(--ui-breakpoint-md)');
    // token 'md' should be expanded via tokenOrRaw mapping inside injected CSS
    expect(style?.textContent).toContain('padding: var(--ui-space-md');

    el.remove();
    // cleanup should remove injected style element
    const still = Array.from(document.head.querySelectorAll('style')).find(s => s === style);
    expect(still).toBeUndefined();
  });

  it('ui-box mirrors legacy `classname` attribute into classList and cleans up', () => {
    const el = document.createElement('ui-box') as any;
    el.setAttribute('classname', 'legacy-a legacy-b');
    document.body.appendChild(el);

    expect(el.classList.contains('legacy-a')).toBe(true);
    expect(el.classList.contains('legacy-b')).toBe(true);

    el.removeAttribute('classname');
    // attribute change should trigger render and remove mirrored classes
    expect(el.classList.contains('legacy-a')).toBe(false);
    expect(el.classList.contains('legacy-b')).toBe(false);

    el.remove();
  });

  it('ui-box accepts shorthand attributes (bg, color, w, h) and applies to host style', () => {
    const el = document.createElement('ui-box') as any;
    el.setAttribute('bg', 'tomato');
    el.setAttribute('color', 'white');
    el.setAttribute('w', '100%');
    el.setAttribute('h', '48px');
    document.body.appendChild(el);

    expect(el.style.background).toBe('tomato');
    expect(el.style.color).toBe('white');
    expect(el.style.width).toBe('100%');
    expect(el.style.height).toBe('48px');

    el.remove();
  });

  it('ui-box accepts responsive shorthand attributes and injects scoped CSS', () => {
    const el = document.createElement('ui-box') as any;
    el.setAttribute('bg', JSON.stringify({ initial: 'red', md: 'blue' }));
    document.body.appendChild(el);

    const cls = Array.from(el.classList).find((c: string) => c.startsWith('ui-box-rsp-'));
    expect(cls).toBeTruthy();

    const style = Array.from(document.head.querySelectorAll('style')).find(s => s.textContent && s.textContent.includes(cls as string));
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('@media (min-width: var(--ui-breakpoint-md)');
    expect(style?.textContent).toContain('background:');

    el.remove();
  });

  it('ui-box defaults to align-items: center (unless overridden)', () => {
    const el = document.createElement('ui-box') as any;
    document.body.appendChild(el);

    // inline style should include align-items: center
    expect(el.style.alignItems).toBe('center');

    // if user provides explicit align via style, it should be preserved
    const el2 = document.createElement('ui-box') as any;
    el2.style.alignItems = 'flex-start';
    document.body.appendChild(el2);
    expect(el2.style.alignItems).toBe('flex-start');

    el.remove(); el2.remove();
  });

  it('ui-box respects explicit align attribute and supports responsive align', () => {
    const el = document.createElement('ui-box') as any;
    el.setAttribute('align', 'flex-start');
    document.body.appendChild(el);
    expect(el.style.alignItems).toBe('flex-start');
    el.remove();

    const el2 = document.createElement('ui-box') as any;
    el2.setAttribute('align', JSON.stringify({ initial: 'flex-start', md: 'center' }));
    document.body.appendChild(el2);

    const cls = Array.from(el2.classList).find((c: string) => c.startsWith('ui-box-rsp-'));
    expect(cls).toBeTruthy();

    const style = Array.from(document.head.querySelectorAll('style')).find(s => s.textContent && s.textContent.includes(cls as string));
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('align-items: flex-start;');
    expect(style?.textContent).toContain('@media (min-width: var(--ui-breakpoint-md)');

    el2.remove();
  });

  it('ui-grid defaults to align-items: center', () => {
    const el = document.createElement('ui-grid') as any;
    document.body.appendChild(el);

    const grid = el.querySelector('.grid') as HTMLElement | null;
    expect(grid).toBeTruthy();
    expect(getComputedStyle(grid!).alignItems).toBe('center');

    el.remove();
  });

  it('ui-flex renders flex direction and gap', () => {
    const el = document.createElement('ui-flex') as any;
    el.setAttribute('direction', 'column');
    el.setAttribute('gap', '6px');
    document.body.appendChild(el);

    expect(getComputedStyle(el.querySelector('.flex')).flexDirection).toBe('column');

    el.remove();
  });

  it('ui-flex accepts responsive JSON attributes and injects scoped CSS', () => {
    const el = document.createElement('ui-flex') as any;
    el.setAttribute('gap', JSON.stringify({ initial: 'sm', md: 'lg' }));
    el.setAttribute('direction', JSON.stringify({ initial: 'row', md: 'column' }));
    document.body.appendChild(el);

    const cls = Array.from(el.classList).find((c: string) => c.startsWith('ui-flex-rsp-'));
    expect(cls).toBeTruthy();

    const style = Array.from(document.head.querySelectorAll('style')).find(s => s.textContent && s.textContent.includes(cls as string));
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('@media (min-width: var(--ui-breakpoint-md)');
    expect(style?.textContent).toContain('--ui-gap');

    el.remove();
    const still = Array.from(document.head.querySelectorAll('style')).find(s => s === style);
    expect(still).toBeUndefined();
  });

  it('ui-flex mirrors legacy `classname` attribute into classList and cleans up', () => {
    const el = document.createElement('ui-flex') as any;
    el.setAttribute('classname', 'legacy-flex');
    document.body.appendChild(el);

    expect(el.classList.contains('legacy-flex')).toBe(true);

    el.removeAttribute('classname');
    expect(el.classList.contains('legacy-flex')).toBe(false);

    el.remove();
  });

  it('ui-grid accepts columns attribute', () => {
    const el = document.createElement('ui-grid') as any;
    el.setAttribute('columns', '1fr 2fr');
    document.body.appendChild(el);

    const grid = el.querySelector('.grid') as HTMLElement | null;
    expect(grid).toBeTruthy();
    expect(getComputedStyle(grid!).gridTemplateColumns).toContain('1fr');

    el.remove();
  });

  it('ui-grid accepts responsive JSON attributes and injects scoped CSS', () => {
    const el = document.createElement('ui-grid') as any;
    el.setAttribute('columns', JSON.stringify({ initial: '1fr', md: 'repeat(3, 1fr)' }));
    el.setAttribute('gap', JSON.stringify({ initial: '8px', md: '16px' }));
    document.body.appendChild(el);

    const cls = Array.from(el.classList).find((c: string) => c.startsWith('ui-grid-rsp-'));
    expect(cls).toBeTruthy();

    const style = Array.from(document.head.querySelectorAll('style')).find(s => s.textContent && s.textContent.includes(cls as string));
    expect(style).toBeTruthy();
    expect(style?.textContent).toContain('@media (min-width: var(--ui-breakpoint-md)');
    expect(style?.textContent).toContain('--ui-grid-columns');

    el.remove();
    const still = Array.from(document.head.querySelectorAll('style')).find(s => s === style);
    expect(still).toBeUndefined();
  });

  it('ui-grid mirrors legacy `classname` attribute into classList and cleans up', () => {
    const el = document.createElement('ui-grid') as any;
    el.setAttribute('classname', 'legacy-grid');
    document.body.appendChild(el);

    expect(el.classList.contains('legacy-grid')).toBe(true);

    el.removeAttribute('classname');
    expect(el.classList.contains('legacy-grid')).toBe(false);

    el.remove();
  });

  it('ui-section applies size-based padding', () => {
    const el = document.createElement('ui-section') as any;
    el.setAttribute('size', 'large');
    document.body.appendChild(el);

    const inner = el.shadowRoot!.querySelector('.section') as HTMLElement | null;
    expect(inner).toBeTruthy();

    el.remove();
  });

  it('ui-container sets max-width for sizes', () => {
    const el = document.createElement('ui-container') as any;
    el.setAttribute('size', 'lg');
    document.body.appendChild(el);

    const inner = el.shadowRoot!.querySelector('.container') as HTMLElement | null;
    expect(inner).toBeTruthy();

    el.remove();
  });
});
