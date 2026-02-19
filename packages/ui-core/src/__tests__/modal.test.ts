import { describe, it, expect, beforeEach } from 'vitest';
import OverlayManager from '../overlayManager';

describe('UIModal overlay integration', () => {
  beforeEach(() => {
    // reset overlay stack and document scroll state
    OverlayManager.stack.length = 0 as any;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });

  it('registers with OverlayManager and locks scroll on open()/unregisters on close()', () => {
    const el = document.createElement('ui-modal') as any;
    document.body.appendChild(el);

    expect(OverlayManager.top()).toBeNull();

    el.open();
    expect(OverlayManager.top()).toBe(el);
    expect(document.body.style.overflow).toBe('hidden');

    el.close();
    expect(OverlayManager.top()).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('setting open attribute registers and locks scroll', () => {
    const el = document.createElement('ui-modal') as HTMLElement;
    document.body.appendChild(el);

    el.setAttribute('open', '');
    expect(OverlayManager.top()).toBe(el as any);
    expect(document.documentElement.style.overflow).toBe('hidden');

    el.removeAttribute('open');
    expect(OverlayManager.top()).toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('clicking overlay closes the modal and unregisters it', () => {
    const el = document.createElement('ui-modal') as any;
    document.body.appendChild(el);
    el.open();

    const overlay = el.shadowRoot?.querySelector('.overlay') as HTMLElement | null;
    expect(overlay).toBeTruthy();

    overlay!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(el.hasAttribute('open')).toBe(false);
    expect(OverlayManager.top()).toBeNull();
  });

  it('does not unlock scroll while other overlays remain', () => {
    const a = document.createElement('ui-modal') as any;
    const b = document.createElement('ui-modal') as any;
    document.body.appendChild(a);
    document.body.appendChild(b);

    a.open();
    expect(document.body.style.overflow).toBe('hidden');

    b.open();
    // b is top, closing b should not unlock scroll because a is still registered
    b.close();
    expect(document.body.style.overflow).toBe('hidden');

    a.close();
    expect(document.body.style.overflow).toBe('');
  });

  it('restores focus to the previously focused element on close', () => {
    const outside = document.createElement('button');
    outside.id = 'outside-focus';
    document.body.appendChild(outside);
    outside.focus();
    expect(document.activeElement).toBe(outside);

    const el = document.createElement('ui-modal') as any;
    el.innerHTML = '<button id="inside-focus">OK</button>';
    document.body.appendChild(el);

    el.open();

    const inside = el.querySelector('#inside-focus') as HTMLElement | null;
    // FocusManager.trap should move focus into the modal
    expect(document.activeElement === inside || el.contains(document.activeElement)).toBe(true);

    el.close();
    // focus should be returned to the previously focused element
    expect(document.activeElement).toBe(outside);

    outside.remove();
    el.remove();
  });
});