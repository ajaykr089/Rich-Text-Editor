import { describe, it, expect } from 'vitest';
import '../components/ui-presence';

describe('ui-presence', () => {
  it('emits enter/exit lifecycle events and transitions hidden state after exit', () => {
    const el = document.createElement('ui-presence') as HTMLElement;
    el.setAttribute('present', '');
    el.innerHTML = '<div>Presence content</div>';

    let beforeEnter = 0;
    let enter = 0;
    let beforeExit = 0;
    let exit = 0;
    let afterExit = 0;

    el.addEventListener('before-enter', () => { beforeEnter += 1; });
    el.addEventListener('enter', () => { enter += 1; });
    el.addEventListener('before-exit', () => { beforeExit += 1; });
    el.addEventListener('exit', () => { exit += 1; });
    el.addEventListener('after-exit', () => { afterExit += 1; });

    document.body.appendChild(el);
    expect(beforeEnter).toBeGreaterThan(0);
    expect(enter).toBeGreaterThan(0);

    el.removeAttribute('present');
    expect(beforeExit).toBe(1);
    expect(exit).toBe(1);

    const surface = el.shadowRoot?.querySelector('.presence') as HTMLElement | null;
    expect(surface).toBeTruthy();
    surface?.dispatchEvent(new Event('transitionend', { bubbles: true }));

    expect(afterExit).toBe(1);
    expect(el.getAttribute('data-state')).toBe('hidden');

    el.remove();
  });

  it('keeps node mounted after exit when keep-mounted is set', () => {
    const el = document.createElement('ui-presence') as HTMLElement;
    el.setAttribute('present', '');
    el.setAttribute('keep-mounted', '');
    el.innerHTML = '<div id="inner">Inner</div>';
    document.body.appendChild(el);

    el.removeAttribute('present');
    const surface = el.shadowRoot?.querySelector('.presence') as HTMLElement | null;
    surface?.dispatchEvent(new Event('transitionend', { bubbles: true }));

    expect(el.getAttribute('data-state')).toBe('exiting');
    expect(surface?.style.display).toBe('block');

    el.remove();
  });
});
