import { describe, it, expect, beforeEach } from 'vitest';
import OverlayManager from '../overlayManager';

describe('OverlayManager lock-count API', () => {
  beforeEach(() => {
    // reset internal state
    (OverlayManager as any).stack.length = 0;
    // @ts-ignore - reset private counter for deterministic tests
    (OverlayManager as any)._lockCount = 0;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });

  it('acquireLock / releaseLock manage internal counter and scroll lock', () => {
    expect(OverlayManager.lockCount()).toBe(0);

    OverlayManager.acquireLock();
    expect(OverlayManager.lockCount()).toBe(1);
    expect(document.body.style.overflow).toBe('hidden');

    OverlayManager.acquireLock();
    expect(OverlayManager.lockCount()).toBe(2);

    OverlayManager.releaseLock();
    expect(OverlayManager.lockCount()).toBe(1);
    expect(document.body.style.overflow).toBe('hidden');

    OverlayManager.releaseLock();
    expect(OverlayManager.lockCount()).toBe(0);
    expect(document.body.style.overflow).toBe('');
  });

  it('lockScroll / unlockScroll are backwards-compatible aliases', () => {
    OverlayManager.lockScroll();
    expect(OverlayManager.lockCount()).toBe(1);

    OverlayManager.lockScroll();
    expect(OverlayManager.lockCount()).toBe(2);

    OverlayManager.unlockScroll();
    expect(OverlayManager.lockCount()).toBe(1);

    OverlayManager.unlockScroll();
    expect(OverlayManager.lockCount()).toBe(0);
  });

  it('releaseLock does not drop below zero', () => {
    OverlayManager.releaseLock();
    OverlayManager.releaseLock();
    expect(OverlayManager.lockCount()).toBe(0);
  });
});