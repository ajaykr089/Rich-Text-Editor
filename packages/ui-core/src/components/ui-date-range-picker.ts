import { ElementBase } from '../ElementBase';
import { compareISO } from './ui-calendar';
import {
  clampDateIso,
  computeLastDaysRange,
  computeMonthRange,
  computePopoverPosition,
  formatDateForDisplay,
  isTruthyAttr,
  lockBodyScroll,
  normalizeDateIso,
  normalizeLocale,
  parseConstraintDate,
  parseUserDateInput,
  rafThrottle,
  shouldUseMobileSheet
} from './date-time-utils';

type RangeValue = { start: string | null; end: string | null };
type RangeDetail = {
  mode: 'range';
  start: string | null;
  end: string | null;
  value: { start: string; end: string } | null;
  source: string;
};

const style = `
  :host {
    --ui-dp-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-dp-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-dp-text: var(--ui-color-text, #0f172a);
    --ui-dp-muted: var(--ui-color-muted, #64748b);
    --ui-dp-accent: var(--ui-color-primary, #2563eb);
    --ui-dp-radius: 12px;
    --ui-dp-field-error: var(--ui-color-danger, #dc2626);
    --ui-dp-z: 1100;
    color-scheme: light dark;
    display: inline-grid;
    inline-size: min(100%, var(--ui-width, 420px));
    min-inline-size: min(240px, 100%);
    color: var(--ui-dp-text);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    display: grid;
    gap: 6px;
  }

  .label {
    font: 600 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-dp-text);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .label[hidden] { display: none; }

  .required { color: var(--ui-dp-field-error); font-size: 11px; }

  .fields {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 8px;
    min-block-size: 38px;
    border: 1px solid var(--ui-dp-border);
    border-radius: var(--ui-dp-radius);
    padding: 0 10px;
    background: var(--ui-dp-bg);
  }

  .fields[data-single="true"] {
    grid-template-columns: 1fr auto auto;
  }

  .input {
    border: 0;
    background: transparent;
    color: var(--ui-dp-text);
    min-inline-size: 0;
    inline-size: 100%;
    padding: 8px 0;
    font: 500 14px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    outline: none;
  }

  .sep {
    color: var(--ui-dp-muted);
    font-size: 12px;
    user-select: none;
  }

  .btn {
    border: 0;
    background: transparent;
    inline-size: 28px;
    block-size: 28px;
    border-radius: 8px;
    color: color-mix(in srgb, var(--ui-dp-text) 72%, transparent);
    cursor: pointer;
  }

  .btn:hover { background: color-mix(in srgb, var(--ui-dp-text) 10%, transparent); color: var(--ui-dp-text); }
  .btn[hidden] { display: none; }

  .hint { color: var(--ui-dp-muted); font-size: 12px; line-height: 1.4; }
  .error { color: var(--ui-dp-field-error); font-size: 12px; line-height: 1.4; }
  .hint[hidden], .error[hidden] { display: none; }

  .inline-panel {
    border: 1px solid var(--ui-dp-border);
    border-radius: var(--ui-dp-radius);
    background: var(--ui-dp-bg);
    box-shadow: 0 18px 30px rgba(2, 6, 23, 0.12);
    padding: 10px;
    display: grid;
    gap: 10px;
  }

  .presets, .footer {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .action {
    border: 1px solid color-mix(in srgb, var(--ui-dp-border) 85%, transparent);
    background: color-mix(in srgb, var(--ui-dp-bg) 95%, transparent);
    color: var(--ui-dp-text);
    min-block-size: 30px;
    border-radius: 8px;
    padding: 0 10px;
    font: 600 12px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
  }

  .action[data-tone="primary"] {
    border-color: color-mix(in srgb, var(--ui-dp-accent) 60%, transparent);
    background: color-mix(in srgb, var(--ui-dp-accent) 18%, transparent);
  }

  :host([disabled]) .fields { opacity: 0.62; pointer-events: none; }

  :host([variant="contrast"]) {
    --ui-dp-bg: #0f172a;
    --ui-dp-border: #334155;
    --ui-dp-text: #e2e8f0;
    --ui-dp-muted: #93a4bd;
    --ui-dp-accent: #93c5fd;
  }
`;

const overlayStyle = `
  .overlay { position: fixed; z-index: var(--ui-dp-z, 1100); pointer-events: none; }
  .panel {
    pointer-events: auto;
    min-inline-size: min(420px, calc(100vw - 16px));
    max-inline-size: min(460px, calc(100vw - 16px));
    border: 1px solid var(--ui-dp-border, #cbd5e1);
    border-radius: var(--ui-dp-radius, 12px);
    background: var(--ui-dp-bg, #fff);
    color: var(--ui-dp-text, #0f172a);
    box-shadow: 0 20px 34px rgba(2, 6, 23, 0.16);
    padding: 10px;
    display: grid;
    gap: 10px;
  }
  .sheet-wrap { position: fixed; inset: 0; display: grid; align-items: end; z-index: var(--ui-dp-z, 1100); }
  .sheet-backdrop { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.52); }
  .sheet {
    position: relative;
    pointer-events: auto;
    background: var(--ui-dp-bg, #fff);
    color: var(--ui-dp-text, #0f172a);
    border-radius: 16px 16px 0 0;
    border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 84%, transparent);
    box-shadow: 0 -12px 30px rgba(2, 6, 23, 0.2);
    padding: 12px;
    display: grid;
    gap: 10px;
    max-block-size: min(82vh, 640px);
    overflow: auto;
  }
  .presets, .footer { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
  .action {
    border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 85%, transparent);
    background: color-mix(in srgb, var(--ui-dp-bg, #fff) 95%, transparent);
    color: var(--ui-dp-text, #0f172a);
    min-block-size: 30px;
    border-radius: 8px;
    padding: 0 10px;
    font: 600 12px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
  }
  .action[data-tone="primary"] { border-color: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 60%, transparent); background: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 18%, transparent); }
`;

function parseRangeValue(raw: string | null): RangeValue {
  if (!raw) return { start: null, end: null };
  try {
    const parsed = JSON.parse(raw);
    const start = normalizeDateIso(parsed?.start || null);
    const end = normalizeDateIso(parsed?.end || null);
    return { start, end };
  } catch {
    return { start: null, end: null };
  }
}

function serializeRangeValue(value: RangeValue): string | null {
  if (!value.start && !value.end) return null;
  return JSON.stringify({
    ...(value.start ? { start: value.start } : {}),
    ...(value.end ? { end: value.end } : {})
  });
}

export class UIDateRangePicker extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'default-open',
      'value',
      'default-value',
      'min',
      'max',
      'locale',
      'week-start',
      'size',
      'variant',
      'range-variant',
      'label',
      'hint',
      'error',
      'allow-same-day',
      'allow-partial',
      'close-on-select',
      'clearable',
      'disabled',
      'readonly',
      'required',
      'name',
      'name-start',
      'name-end',
      'mode'
    ];
  }

  private _value: RangeValue = { start: null, end: null };
  private _pending: RangeValue = { start: null, end: null };
  private _draftStart = '';
  private _draftEnd = '';
  private _draftSingle = '';
  private _inlineError = '';
  private _open = false;
  private _syncing = false;
  private _overlay: HTMLDivElement | null = null;
  private _releaseScrollLock: (() => void) | null = null;
  private _isInitialized = false;
  private _hasView = false;
  private _restoreFocusEl: HTMLElement | null = null;
  private _overlayMode: 'sheet' | 'popover' | null = null;
  private _schedulePosition = rafThrottle(() => this._positionOverlay());

  private _onRootClickBound = (event: Event) => this._onRootClick(event);
  private _onRootInputBound = (event: Event) => this._onRootInput(event);
  private _onRootBlurBound = (event: Event) => this._onRootBlur(event);
  private _onRootKeyDownBound = (event: Event) => this._onRootKeyDown(event);
  private _onDocumentPointerDownBound = (event: PointerEvent) => this._onDocumentPointerDown(event);
  private _onDocumentKeyDownBound = (event: KeyboardEvent) => this._onDocumentKeyDown(event);
  private _onWindowResizeBound = () => this._schedulePosition.run();
  private _onWindowScrollBound = () => this._schedulePosition.run();
  private _onOverlayClickBound = (event: Event) => this._onOverlayClick(event);
  private _onOverlayCalendarBound = (event: Event) => this._onOverlayCalendarChange(event);

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClickBound);
    this.root.addEventListener('input', this._onRootInputBound);
    this.root.addEventListener('focusout', this._onRootBlurBound);
    this.root.addEventListener('keydown', this._onRootKeyDownBound);

    if (!this._isInitialized) {
      const initial = parseRangeValue(this.getAttribute('value') || this.getAttribute('default-value'));
      this._value = initial;
      this._pending = { ...initial };
      this._refreshDraftFromValue();
      this._open = this.hasAttribute('open') || isTruthyAttr(this.getAttribute('default-open'));
      this._isInitialized = true;
    }

    if (this._open && !this._isInlineMode()) this._ensureOverlay();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClickBound);
    this.root.removeEventListener('input', this._onRootInputBound);
    this.root.removeEventListener('focusout', this._onRootBlurBound);
    this.root.removeEventListener('keydown', this._onRootKeyDownBound);
    this._destroyOverlay();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'value' && !this._syncing) {
      this._value = parseRangeValue(newValue);
      this._pending = { ...this._value };
      this._refreshDraftFromValue();
      this._inlineError = '';
    }

    if (name === 'open' && !this._syncing) {
      this._open = this.hasAttribute('open');
      this._syncOverlay('attribute');
    }

    if (name === 'mode') {
      this._syncOverlay('attribute');
    }

    if (name === 'disabled' && this.hasAttribute('disabled')) {
      this._setOpen(false, 'outside');
    }

    if (!this.isConnected) return;
    if (!this._hasView) {
      this.requestRender();
      return;
    }
    this._updateHostState();
  }

  private _isInlineMode(): boolean {
    return (this.getAttribute('mode') || 'popover') === 'inline';
  }

  private _isMobileSheet(): boolean {
    return shouldUseMobileSheet(this.getAttribute('mode'));
  }

  private _isDisabled(): boolean {
    return this.hasAttribute('disabled');
  }

  private _isReadonly(): boolean {
    return this.hasAttribute('readonly');
  }

  private _clearable(): boolean {
    return isTruthyAttr(this.getAttribute('clearable'), true);
  }

  private _closeOnSelect(): boolean {
    return isTruthyAttr(this.getAttribute('close-on-select'), false);
  }

  private _allowPartial(): boolean {
    return isTruthyAttr(this.getAttribute('allow-partial'), true);
  }

  private _allowSameDay(): boolean {
    return isTruthyAttr(this.getAttribute('allow-same-day'), true);
  }

  private _locale(): string {
    return normalizeLocale(this.getAttribute('locale'));
  }

  private _rangeVariant(): 'two-fields' | 'single-field' {
    return (this.getAttribute('range-variant') || 'two-fields') === 'single-field' ? 'single-field' : 'two-fields';
  }

  private _minIso(): string | null {
    return parseConstraintDate(this.getAttribute('min'));
  }

  private _maxIso(): string | null {
    return parseConstraintDate(this.getAttribute('max'));
  }

  private _refreshDraftFromValue(): void {
    const startDisplay = formatDateForDisplay(this._value.start, this._locale(), 'locale', null);
    const endDisplay = formatDateForDisplay(this._value.end, this._locale(), 'locale', null);
    this._draftStart = startDisplay;
    this._draftEnd = endDisplay;
    this._draftSingle = [startDisplay, endDisplay].filter(Boolean).join(' — ');
  }

  private _syncOpenAttribute(next: boolean): void {
    this._syncing = true;
    try {
      if (next) {
        if (!this.hasAttribute('open')) this.setAttribute('open', '');
      } else if (this.hasAttribute('open')) {
        this.removeAttribute('open');
      }
    } finally {
      this._syncing = false;
    }
  }

  private _syncValueAttribute(next: RangeValue): void {
    const serialized = serializeRangeValue(next);
    this._syncing = true;
    try {
      if (!serialized) {
        if (this.hasAttribute('value')) this.removeAttribute('value');
      } else if (this.getAttribute('value') !== serialized) {
        this.setAttribute('value', serialized);
      }
    } finally {
      this._syncing = false;
    }
  }

  private _emitInput(source: string): void {
    const detail: RangeDetail = {
      mode: 'range',
      start: this._pending.start,
      end: this._pending.end,
      value: this._pending.start && this._pending.end ? { start: this._pending.start, end: this._pending.end } : null,
      source
    };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
  }

  private _emitChange(source: string): void {
    const detail: RangeDetail = {
      mode: 'range',
      start: this._value.start,
      end: this._value.end,
      value: this._value.start && this._value.end ? { start: this._value.start, end: this._value.end } : null,
      source
    };
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _emitInvalid(raw: string, reason: string): void {
    this.dispatchEvent(new CustomEvent('invalid', { detail: { raw, reason }, bubbles: true, composed: true }));
  }

  private _normalizePending(next: RangeValue): RangeValue {
    const minIso = this._minIso();
    const maxIso = this._maxIso();
    const start = next.start ? clampDateIso(next.start, minIso, maxIso) : null;
    const end = next.end ? clampDateIso(next.end, minIso, maxIso) : null;
    if (!start || !end) return { start, end };
    if (compareISO(start, end) > 0) {
      return { start: end, end: start };
    }
    return { start, end };
  }

  private _canCommit(value: RangeValue): boolean {
    if (!value.start && !value.end) return true;
    if (!this._allowPartial() && (!value.start || !value.end)) return false;
    if (value.start && value.end && !this._allowSameDay() && value.start === value.end) return false;
    return true;
  }

  private _commit(next: RangeValue, source: string): void {
    if (this._isDisabled() || this._isReadonly()) return;
    const normalized = this._normalizePending(next);
    if (!this._canCommit(normalized)) {
      this._inlineError = this.getAttribute('error') || 'Invalid range';
      this._emitInvalid(JSON.stringify(next), 'range');
      this._updateHostState();
      return;
    }
    this._value = normalized;
    this._pending = { ...normalized };
    this._inlineError = '';
    this._refreshDraftFromValue();
    this._syncValueAttribute(this._value);
    this._emitInput(source);
    this._emitChange(source);
    this._updateHostState();
  }

  private _setOpen(next: boolean, source: string): void {
    if (this._isDisabled()) return;
    if (this._open === next) return;
    this._open = next;
    this._syncOpenAttribute(next);
    this._syncOverlay(source);
    this._updateHostState();
    this.dispatchEvent(new CustomEvent(next ? 'open' : 'close', { bubbles: true, composed: true }));
  }

  private _syncOverlay(_source: string): void {
    if (this._isInlineMode()) {
      this._destroyOverlay();
      return;
    }
    if (this._open) {
      this._ensureOverlay();
      this._syncOverlayState();
      return;
    }
    this._destroyOverlay();
    const focusTarget = this._restoreFocusEl;
    this._restoreFocusEl = null;
    if (focusTarget && focusTarget.isConnected) {
      try {
        focusTarget.focus();
      } catch {
        // no-op
      }
    }
  }

  private _ensureOverlay(): void {
    if (this._overlay || typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.zIndex = '1100';
    el.style.pointerEvents = 'none';
    el.addEventListener('click', this._onOverlayClickBound);
    el.addEventListener('change', this._onOverlayCalendarBound as EventListener);
    document.body.appendChild(el);
    this._overlay = el;
    document.addEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.addEventListener('keydown', this._onDocumentKeyDownBound);
    window.addEventListener('resize', this._onWindowResizeBound);
    window.addEventListener('scroll', this._onWindowScrollBound, true);
    if (this._isMobileSheet()) this._releaseScrollLock = lockBodyScroll();
  }

  private _destroyOverlay(): void {
    if (!this._overlay) return;
    this._schedulePosition.cancel();
    document.removeEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.removeEventListener('keydown', this._onDocumentKeyDownBound);
    window.removeEventListener('resize', this._onWindowResizeBound);
    window.removeEventListener('scroll', this._onWindowScrollBound, true);
    this._overlay.removeEventListener('click', this._onOverlayClickBound);
    this._overlay.removeEventListener('change', this._onOverlayCalendarBound as EventListener);
    if (this._overlay.parentElement) this._overlay.parentElement.removeChild(this._overlay);
    this._overlay = null;
    this._overlayMode = null;
    if (this._releaseScrollLock) {
      this._releaseScrollLock();
      this._releaseScrollLock = null;
    }
  }

  private _positionOverlay(): void {
    if (!this._overlay || !this._open || this._isMobileSheet()) return;
    const field = this.root.querySelector('.fields') as HTMLElement | null;
    const panel = this._overlay.querySelector('.panel') as HTMLElement | null;
    if (!field || !panel) return;
    const anchorRect = field.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const position = computePopoverPosition(anchorRect, panelRect);
    panel.style.position = 'absolute';
    panel.style.top = `${Math.round(position.top)}px`;
    panel.style.left = `${Math.round(position.left)}px`;
  }

  private _renderPanelInner(sheet: boolean): string {
    const body = `
      <ui-calendar class="drp-calendar" part="calendar"></ui-calendar>
      <div class="presets" part="presets">
        <button type="button" class="action" data-action="preset-today">Today</button>
        <button type="button" class="action" data-action="preset-last7">Last 7 days</button>
        <button type="button" class="action" data-action="preset-month">This month</button>
      </div>
      <footer class="footer" part="footer">
        <button type="button" class="action" data-action="clear" part="clear">Clear</button>
        <button type="button" class="action" data-action="cancel" part="cancel">Cancel</button>
        <button type="button" class="action" data-action="apply" data-tone="primary" part="apply">Apply</button>
      </footer>
    `;

    return `
      <style>${overlayStyle}</style>
      ${sheet ? '<div class="sheet-backdrop" data-action="backdrop"></div>' : ''}
      <section class="${sheet ? 'sheet' : 'panel'}" part="${sheet ? 'sheet' : 'popover'}">${body}</section>
    `;
  }

  private _syncCalendar(calendarEl: HTMLElement): void {
    const syncAttr = (name: string, value: string | null) => {
      if (value == null || value === '') {
        if (calendarEl.hasAttribute(name)) calendarEl.removeAttribute(name);
        return;
      }
      if (calendarEl.getAttribute(name) !== value) calendarEl.setAttribute(name, value);
    };
    const payload = serializeRangeValue(this._pending);
    syncAttr('selection', 'range');
    syncAttr('value', payload);
    syncAttr('min', this.getAttribute('min'));
    syncAttr('max', this.getAttribute('max'));
    syncAttr('locale', this.getAttribute('locale'));
    syncAttr('week-start', this.getAttribute('week-start'));
    const sizeAttr = this.getAttribute('size');
    const effectiveSize = sizeAttr || 'sm';
    syncAttr('size', effectiveSize);
    syncAttr('variant', this.getAttribute('variant'));
    syncAttr('outside-click', this.getAttribute('outside-click'));
    const compact = !sizeAttr || sizeAttr === 'sm';
    if (compact) {
      calendarEl.style.setProperty('--ui-calendar-day-height', '38px');
      calendarEl.style.setProperty('--ui-calendar-gap', '8px');
      calendarEl.style.setProperty('--ui-calendar-day-font-size', '11px');
      calendarEl.style.setProperty('--ui-calendar-weekday-font-size', '10px');
      calendarEl.style.setProperty('--ui-calendar-title-font-size', '13px');
    } else {
      calendarEl.style.removeProperty('--ui-calendar-day-height');
      calendarEl.style.removeProperty('--ui-calendar-gap');
      calendarEl.style.removeProperty('--ui-calendar-day-font-size');
      calendarEl.style.removeProperty('--ui-calendar-weekday-font-size');
      calendarEl.style.removeProperty('--ui-calendar-title-font-size');
    }
    if (this._isReadonly()) syncAttr('readonly', '');
    else syncAttr('readonly', null);
    if (this._isDisabled()) syncAttr('disabled', '');
    else syncAttr('disabled', null);
  }

  private _ensureOverlayContent(sheet: boolean): void {
    if (!this._overlay) return;
    const mode: 'sheet' | 'popover' = sheet ? 'sheet' : 'popover';
    if (this._overlayMode === mode && this._overlay.querySelector('.drp-calendar')) return;
    this._overlayMode = mode;
    this._overlay.innerHTML = sheet
      ? `<div class="sheet-wrap">${this._renderPanelInner(true)}</div>`
      : `<div class="overlay">${this._renderPanelInner(false)}</div>`;
  }

  private _syncOverlayState(): void {
    if (!this._overlay) return;
    const sheet = this._isMobileSheet();
    this._ensureOverlayContent(sheet);
    const actions = this._overlay.querySelectorAll('.action');
    const disabled = this._isDisabled();
    actions.forEach((node) => {
      (node as HTMLButtonElement).disabled = disabled;
    });
    const calendarEl = this._overlay.querySelector('.drp-calendar') as HTMLElement | null;
    if (calendarEl) this._syncCalendar(calendarEl);
    if (!sheet) this._schedulePosition.run();
  }

  private _renderOverlay(): void {
    this._syncOverlayState();
  }

  private _renderInlineCalendar(): void {
    const calendarEl = this.root.querySelector('.inline-calendar') as HTMLElement | null;
    if (!calendarEl) return;
    this._syncCalendar(calendarEl);
  }

  private _updateHostState(): void {
    if (!this._hasView) return;
    const label = this.getAttribute('label') || '';
    const hint = this.getAttribute('hint') || '';
    const manualError = this.getAttribute('error') || '';
    const error = this._inlineError || manualError;
    const variant = this._rangeVariant();
    const isInline = this._isInlineMode();
    const hasValue = !!(this._value.start || this._value.end);

    const labelEl = this.root.querySelector('.label') as HTMLElement | null;
    const labelTextEl = this.root.querySelector('.label-text') as HTMLElement | null;
    const requiredEl = this.root.querySelector('.required') as HTMLElement | null;
    const fields = this.root.querySelector('.fields') as HTMLElement | null;
    const single = this.root.querySelector('.single') as HTMLInputElement | null;
    const start = this.root.querySelector('.start') as HTMLInputElement | null;
    const end = this.root.querySelector('.end') as HTMLInputElement | null;
    const sep = this.root.querySelector('.sep') as HTMLElement | null;
    const clearBtn = this.root.querySelector('.btn[data-action="clear"]') as HTMLButtonElement | null;
    const toggleBtn = this.root.querySelector('.btn[data-action="toggle"]') as HTMLButtonElement | null;
    const hintEl = this.root.querySelector('.hint') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;
    const inlinePanel = this.root.querySelector('.inline-panel') as HTMLElement | null;
    const hiddenRange = this.root.querySelector('.hidden-range') as HTMLInputElement | null;
    const hiddenStart = this.root.querySelector('.hidden-start') as HTMLInputElement | null;
    const hiddenEnd = this.root.querySelector('.hidden-end') as HTMLInputElement | null;

    if (labelEl) labelEl.hidden = !label;
    if (labelTextEl) labelTextEl.textContent = label;
    if (requiredEl) requiredEl.hidden = !this.hasAttribute('required');
    if (fields) fields.dataset.single = variant === 'single-field' ? 'true' : 'false';
    if (single) {
      if (single.value !== this._draftSingle) single.value = this._draftSingle;
      single.hidden = variant !== 'single-field';
      single.readOnly = this._isReadonly();
      single.disabled = this._isDisabled();
      single.required = this.hasAttribute('required');
    }
    if (start) {
      if (start.value !== this._draftStart) start.value = this._draftStart;
      start.hidden = variant === 'single-field';
      start.readOnly = this._isReadonly();
      start.disabled = this._isDisabled();
      start.required = this.hasAttribute('required');
    }
    if (end) {
      if (end.value !== this._draftEnd) end.value = this._draftEnd;
      end.hidden = variant === 'single-field';
      end.readOnly = this._isReadonly();
      end.disabled = this._isDisabled();
      end.required = this.hasAttribute('required');
    }
    if (sep) sep.hidden = variant === 'single-field';
    if (clearBtn) clearBtn.hidden = !(this._clearable() && hasValue);
    if (toggleBtn) toggleBtn.hidden = isInline;
    if (hintEl) {
      hintEl.hidden = !hint;
      hintEl.textContent = hint;
    }
    if (errorEl) {
      errorEl.hidden = !error;
      errorEl.textContent = error;
    }
    if (inlinePanel) inlinePanel.hidden = !isInline;

    const name = this.getAttribute('name') || '';
    const startName = this.getAttribute('name-start') || '';
    const endName = this.getAttribute('name-end') || '';
    const combined = this._value.start && this._value.end ? `${this._value.start}..${this._value.end}` : '';
    if (hiddenRange) {
      hiddenRange.disabled = !name;
      hiddenRange.name = name;
      hiddenRange.value = combined;
    }
    if (hiddenStart) {
      hiddenStart.disabled = !!name || !startName;
      hiddenStart.name = startName;
      hiddenStart.value = this._value.start || '';
    }
    if (hiddenEnd) {
      hiddenEnd.disabled = !!name || !endName;
      hiddenEnd.name = endName;
      hiddenEnd.value = this._value.end || '';
    }

    if (isInline) {
      this._renderInlineCalendar();
      this._destroyOverlay();
      return;
    }

    if (this._open) this._syncOverlayState();
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const actionEl = target.closest('[data-action]') as HTMLElement | null;
    const action = actionEl?.getAttribute('data-action');
    if (!action) return;
    if (action === 'toggle') {
      this._restoreFocusEl = target;
      this._setOpen(!this._open, 'toggle');
      return;
    }
    if (action === 'clear') {
      this._commit({ start: null, end: null }, 'clear');
      return;
    }
    if (action === 'apply') {
      this._commit(this._pending, 'apply');
      if (!this._isInlineMode()) this._setOpen(false, 'apply');
      return;
    }
    if (action === 'cancel') {
      this._pending = { ...this._value };
      if (!this._isInlineMode()) this._setOpen(false, 'cancel');
      this._updateHostState();
    }
  }

  private _onRootInput(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement)) return;
    const variant = this._rangeVariant();
    if (variant === 'single-field' && target.classList.contains('single')) {
      this._draftSingle = target.value;
      return;
    }
    if (target.classList.contains('start')) this._draftStart = target.value;
    if (target.classList.contains('end')) this._draftEnd = target.value;
  }

  private _onRootBlur(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement)) return;

    const variant = this._rangeVariant();
    if (variant === 'single-field' && target.classList.contains('single')) {
      const raw = this._draftSingle.trim();
      if (!raw) {
        this._pending = { start: null, end: null };
        return;
      }
      const split = raw.split(/\s*[—-]\s*/);
      const start = parseUserDateInput(split[0] || '', this._locale());
      const end = parseUserDateInput(split[1] || '', this._locale());
      if (!start || (!end && !this._allowPartial())) {
        this._inlineError = this.getAttribute('error') || 'Invalid range';
        this._emitInvalid(raw, 'parse');
        this._updateHostState();
        return;
      }
      this._pending = this._normalizePending({ start, end: end || null });
      this._commit(this._pending, 'blur');
      return;
    }

    if (target.classList.contains('start') || target.classList.contains('end')) {
      const start = this._draftStart ? parseUserDateInput(this._draftStart, this._locale()) : null;
      const end = this._draftEnd ? parseUserDateInput(this._draftEnd, this._locale()) : null;
      if ((this._draftStart && !start) || (this._draftEnd && !end)) {
        this._inlineError = this.getAttribute('error') || 'Invalid range';
        this._emitInvalid(`${this._draftStart} ${this._draftEnd}`.trim(), 'parse');
        this._updateHostState();
        return;
      }
      this._pending = this._normalizePending({ start, end });
      this._commit(this._pending, 'blur');
    }
  }

  private _onRootKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Escape' && this._open && !this._isInlineMode()) {
      keyboardEvent.preventDefault();
      this._setOpen(false, 'escape');
      return;
    }
    if (keyboardEvent.key === 'ArrowDown' && !this._open && !this._isInlineMode()) {
      keyboardEvent.preventDefault();
      this._setOpen(true, 'keyboard');
    }
  }

  private _onDocumentPointerDown(event: PointerEvent): void {
    if (!this._open || !this._overlay) return;
    const path = event.composedPath();
    if (path.includes(this) || path.includes(this._overlay)) return;
    this._setOpen(false, 'outside');
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (!this._open) return;
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this._setOpen(false, 'escape');
  }

  private _onOverlayClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const actionEl = target.closest('[data-action]') as HTMLElement | null;
    const action = actionEl?.getAttribute('data-action');
    if (!action) return;

    if (action === 'backdrop') {
      this._setOpen(false, 'outside');
      return;
    }

    if (action === 'clear') {
      this._pending = { start: null, end: null };
      this._emitInput('clear');
      this._renderOverlay();
      return;
    }
    if (action === 'cancel') {
      this._pending = { ...this._value };
      this._setOpen(false, 'cancel');
      return;
    }
    if (action === 'apply') {
      this._commit(this._pending, 'apply');
      this._setOpen(false, 'apply');
      return;
    }
    if (action === 'preset-today') {
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const iso = `${today.getFullYear()}-${mm}-${dd}`;
      this._pending = this._normalizePending({ start: iso, end: iso });
      this._emitInput('preset-today');
      this._renderOverlay();
      return;
    }
    if (action === 'preset-last7') {
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const todayIso = `${now.getFullYear()}-${mm}-${dd}`;
      this._pending = this._normalizePending(computeLastDaysRange(todayIso, 7));
      this._emitInput('preset-last7');
      this._renderOverlay();
      return;
    }
    if (action === 'preset-month') {
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const todayIso = `${now.getFullYear()}-${mm}-${dd}`;
      this._pending = this._normalizePending(computeMonthRange(todayIso));
      this._emitInput('preset-month');
      this._renderOverlay();
    }
  }

  private _onOverlayCalendarChange(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName.toLowerCase() !== 'ui-calendar') return;
    const detail = (event as CustomEvent<{ mode?: string; start?: string; end?: string }>).detail;
    if (!detail || detail.mode !== 'range') return;
    this._pending = this._normalizePending({
      start: normalizeDateIso(detail.start || null),
      end: normalizeDateIso(detail.end || null)
    });
    this._emitInput('calendar');
    if (this._closeOnSelect() && this._pending.start && this._pending.end) {
      this._commit(this._pending, 'calendar');
      if (!this._isInlineMode()) this._setOpen(false, 'calendar');
      return;
    }
    this._updateHostState();
  }

  protected override render(): void {
    if (!this._hasView) {
      this.setContent(`
        <style>${style}</style>
        <div class="root">
          <label class="label" part="label">
            <span class="label-text"></span>
            <span class="required">*</span>
          </label>
          <div class="fields" part="field input" data-single="false">
            <input class="input single" part="input" placeholder="Start — End" />
            <input class="input start" part="input" placeholder="Start date" />
            <span class="sep">—</span>
            <input class="input end" part="input" placeholder="End date" />
            <button type="button" class="btn" part="clear" data-action="clear">✕</button>
            <button type="button" class="btn" part="toggle" data-action="toggle">▾</button>
          </div>
          <div class="hint" part="hint"></div>
          <div class="error" part="error" role="alert"></div>
          <input class="hidden-range" type="hidden" disabled />
          <input class="hidden-start" type="hidden" disabled />
          <input class="hidden-end" type="hidden" disabled />
          <section class="inline-panel" part="popover">
            <ui-calendar class="inline-calendar" part="calendar"></ui-calendar>
            <div class="presets" part="presets">
              <button type="button" class="action" data-action="preset-today">Today</button>
              <button type="button" class="action" data-action="preset-last7">Last 7 days</button>
              <button type="button" class="action" data-action="preset-month">This month</button>
            </div>
            <footer class="footer" part="footer">
              <button type="button" class="action" data-action="clear">Clear</button>
              <button type="button" class="action" data-action="apply" data-tone="primary">Apply</button>
            </footer>
          </section>
        </div>
      `, { force: true });
      this._hasView = true;
    }
    this._updateHostState();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-date-range-picker')) {
  customElements.define('ui-date-range-picker', UIDateRangePicker);
}
