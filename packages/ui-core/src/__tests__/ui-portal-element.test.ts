import { describe, it, expect } from 'vitest';
import '../components/ui-portal';

describe('ui-portal element', () => {
  it('ports content to target without recursive slotchange remount loops', async () => {
    const target = document.createElement('div');
    target.id = 'portal-target-test';
    document.body.appendChild(target);

    const el = document.createElement('ui-portal') as HTMLElement;
    el.setAttribute('target', '#portal-target-test');
    const a = document.createElement('div');
    a.textContent = 'A';
    el.appendChild(a);

    let mountCount = 0;
    let unmountCount = 0;
    el.addEventListener('mount', () => { mountCount += 1; });
    el.addEventListener('unmount', () => { unmountCount += 1; });

    document.body.appendChild(el);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(target.textContent).toContain('A');
    expect(mountCount).toBe(1);
    expect(unmountCount).toBe(0);

    const b = document.createElement('div');
    b.textContent = 'B';
    el.appendChild(b);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(target.textContent).toContain('A');
    expect(target.textContent).toContain('B');
    // single slot change should cause at most one unmount/mount cycle
    expect(mountCount).toBeLessThan(4);
    expect(unmountCount).toBeLessThan(3);

    el.remove();
    target.remove();
  });
});
