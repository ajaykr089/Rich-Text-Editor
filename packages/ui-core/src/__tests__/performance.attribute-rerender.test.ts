import { describe, it, expect } from 'vitest';
import '../components/ui-command-palette';
import '../components/ui-floating-toolbar';
import '../components/ui-tabs';
import '../components/ui-stepper';
import '../components/ui-wizard';
import '../components/ui-quick-actions';

function flushMicrotask() {
  return Promise.resolve();
}

describe('performance: non-template attribute updates should not rebuild shadow DOM', () => {
  it('ui-command-palette keeps panel node stable across open/close', async () => {
    const el = document.createElement('ui-command-palette') as HTMLElement;
    el.innerHTML = `<button slot="command">Open patients</button>`;
    document.body.appendChild(el);
    await flushMicrotask();

    const panelBefore = el.shadowRoot?.querySelector('.panel');
    expect(panelBefore).toBeTruthy();

    el.setAttribute('open', '');
    el.removeAttribute('open');
    el.setAttribute('open', '');
    await flushMicrotask();

    const panelAfter = el.shadowRoot?.querySelector('.panel');
    expect(panelAfter).toBe(panelBefore);
    el.remove();
  });

  it('ui-floating-toolbar keeps panel node stable across anchor/open updates', async () => {
    const anchor = document.createElement('button');
    anchor.id = 'perf-anchor';
    document.body.appendChild(anchor);

    const el = document.createElement('ui-floating-toolbar') as HTMLElement;
    el.innerHTML = `<button slot="toolbar">Action</button>`;
    document.body.appendChild(el);
    await flushMicrotask();

    const panelBefore = el.shadowRoot?.querySelector('.panel');
    expect(panelBefore).toBeTruthy();

    el.setAttribute('anchor-id', 'perf-anchor');
    el.setAttribute('open', '');
    el.removeAttribute('open');
    el.setAttribute('open', '');
    await flushMicrotask();

    const panelAfter = el.shadowRoot?.querySelector('.panel');
    expect(panelAfter).toBe(panelBefore);

    el.remove();
    anchor.remove();
  });

  it('ui-tabs keeps shell node stable while selected/value changes', async () => {
    const el = document.createElement('ui-tabs') as HTMLElement;
    el.innerHTML = `
      <button slot="tab" data-value="a">General</button>
      <button slot="tab" data-value="b">Security</button>
      <div slot="panel">Panel A</div>
      <div slot="panel">Panel B</div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const shellBefore = el.shadowRoot?.querySelector('.shell');
    expect(shellBefore).toBeTruthy();

    el.setAttribute('selected', '1');
    el.setAttribute('value', 'a');
    await flushMicrotask();

    const shellAfter = el.shadowRoot?.querySelector('.shell');
    expect(shellAfter).toBe(shellBefore);
    el.remove();
  });

  it('ui-stepper keeps frame node stable while value changes', async () => {
    const el = document.createElement('ui-stepper') as HTMLElement;
    el.setAttribute(
      'steps',
      JSON.stringify([
        { value: 'info', label: 'Info' },
        { value: 'billing', label: 'Billing' },
        { value: 'review', label: 'Review' }
      ])
    );
    el.setAttribute('value', 'info');
    document.body.appendChild(el);
    await flushMicrotask();

    const frameBefore = el.shadowRoot?.querySelector('.frame');
    expect(frameBefore).toBeTruthy();

    el.setAttribute('value', 'billing');
    el.setAttribute('value', 'review');
    await flushMicrotask();

    const frameAfter = el.shadowRoot?.querySelector('.frame');
    expect(frameAfter).toBe(frameBefore);
    el.remove();
  });

  it('ui-wizard keeps frame node stable while value changes', async () => {
    const el = document.createElement('ui-wizard') as HTMLElement;
    el.innerHTML = `
      <section slot="step" data-value="1" data-title="First">A</section>
      <section slot="step" data-value="2" data-title="Second">B</section>
      <section slot="step" data-value="3" data-title="Third">C</section>
    `;
    el.setAttribute('value', '1');
    document.body.appendChild(el);
    await flushMicrotask();

    const frameBefore = el.shadowRoot?.querySelector('.frame');
    expect(frameBefore).toBeTruthy();

    el.setAttribute('value', '2');
    el.setAttribute('value', '3');
    await flushMicrotask();

    const frameAfter = el.shadowRoot?.querySelector('.frame');
    expect(frameAfter).toBe(frameBefore);
    el.remove();
  });

  it('ui-quick-actions keeps root node stable while open toggles', async () => {
    const el = document.createElement('ui-quick-actions') as HTMLElement;
    el.innerHTML = `
      <button slot="action">A</button>
      <button slot="action">B</button>
    `;
    el.setAttribute('collapsible', '');
    document.body.appendChild(el);
    await flushMicrotask();

    const rootBefore = el.shadowRoot?.querySelector('.root');
    expect(rootBefore).toBeTruthy();

    el.setAttribute('open', '');
    el.removeAttribute('open');
    el.setAttribute('open', '');
    await flushMicrotask();

    const rootAfter = el.shadowRoot?.querySelector('.root');
    expect(rootAfter).toBe(rootBefore);
    el.remove();
  });
});
