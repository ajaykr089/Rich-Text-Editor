import { describe, it, expect } from 'vitest';
import { computePosition, showPortalFor, createPortalContainer } from '../portal';

describe('portal / computePosition', () => {
  it('computes basic placements (top/bottom/left/right)', () => {
    const anchor = { getBoundingClientRect: () => ({ top: 200, bottom: 240, left: 100, right: 150, width: 50, height: 40 }) } as any;
    const content = { getBoundingClientRect: () => ({ width: 120, height: 40, top: 0, left: 0, right: 0, bottom: 0 }), offsetWidth: 120, offsetHeight: 40 } as any;

    const top = computePosition(anchor, content, { placement: 'top', offset: 8 });
    const bottom = computePosition(anchor, content, { placement: 'bottom', offset: 8 });
    const left = computePosition(anchor, content, { placement: 'left', offset: 8 });
    const right = computePosition(anchor, content, { placement: 'right', offset: 8 });

    expect(top.top).toBeLessThan(anchor.getBoundingClientRect().top);
    expect(bottom.top).toBeGreaterThan(anchor.getBoundingClientRect().bottom - 1);
    expect(left.left).toBeLessThan(anchor.getBoundingClientRect().left);
    expect(right.left).toBeGreaterThan(anchor.getBoundingClientRect().right - 1);
  });

  it('showPortalFor appends element to portal and cleanup removes it', () => {
    const anchor = document.createElement('div');
    anchor.style.position = 'absolute';
    anchor.style.top = '300px';
    anchor.style.left = '40px';
    document.body.appendChild(anchor);

    const content = document.createElement('div');
    content.textContent = 'portal test';
    const cleanup = showPortalFor(anchor, content, 'bottom');

    const root = createPortalContainer();
    expect(root).toBeTruthy();
    expect(content.parentElement).toBe(root);

    // cleanup should remove it
    cleanup && cleanup();
    expect(content.parentElement).toBeNull();

    document.body.removeChild(anchor);
  });

  it('computePosition accepts a virtual element and showPortalFor positions arrow when present', () => {
    const virtualAnchor: any = { getBoundingClientRect: () => ({ top: 200, bottom: 200, left: 200, right: 200, width: 0, height: 0 }) };
    const content = document.createElement('div');
    content.style.width = '120px';
    content.style.height = '40px';
    // add an arrow element inside the content so showPortalFor can position it
    const panel = document.createElement('div');
    panel.className = 'panel';
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    panel.appendChild(arrow);
    content.appendChild(panel);

    const cleanup = showPortalFor(virtualAnchor, content, { placement: 'bottom', shift: true });

    const root = createPortalContainer();
    expect(root).toBeTruthy();
    // arrow should be present inside the portal
    const mountedArrow = root.querySelector('.arrow') as HTMLElement | null;
    expect(mountedArrow).toBeTruthy();
    // arrow should have left/top style set by portal positioning logic
    expect(mountedArrow!.style.left || mountedArrow!.style.top).toBeTruthy();

    cleanup && cleanup();
  });
});
