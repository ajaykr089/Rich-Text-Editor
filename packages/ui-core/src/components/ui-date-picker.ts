import { ElementBase } from '../ElementBase';
import { compareISO } from './ui-calendar';
import {
  clampDateIso,
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

type DatePickerSource =
  | 'typing'
  | 'blur'
  | 'enter'
  | 'calendar'
  | 'apply'
  | 'clear'
  | 'today'
  | 'api'
  | 'outside'
  | 'escape';

type DatePickerDetail = {
  mode: 'single';
  value: string | null;
  displayValue: string;
  source: DatePickerSource;
};

const style = `
  :host {
    --ui-dp-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-dp-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-dp-text: var(--ui-color-text, #0f172a);
    --ui-dp-muted: var(--ui-color-muted, #64748b);
    --ui-dp-accent: var(--ui-color-primary, #2563eb);
    --ui-dp-radius: 12px;
    --ui-dp-shadow: 0 18px 34px rgba(2, 6, 23, 0.14);
    --ui-dp-padding: 10px 12px;
    --ui-dp-z: 1100;
    --ui-dp-gap: 8px;
    --ui-dp-hit: 36px;
    --ui-dp-field-bg: var(--ui-dp-bg);
    --ui-dp-field-border: var(--ui-dp-border);
    --ui-dp-field-focus: color-mix(in srgb, var(--ui-dp-accent) 55%, transparent);
    --ui-dp-field-error: var(--ui-color-danger, #dc2626);
    --ui-dp-sheet-backdrop: rgba(15, 23, 42, 0.52);
    --ui-dp-sheet-bg: var(--ui-dp-bg);
    color-scheme: light dark;
    display: inline-grid;
    inline-size: min(100%, var(--ui-width, 320px));
    min-inline-size: min(220px, 100%);
    color: var(--ui-dp-text);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    min-inline-size: 0;
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

  .required {
    color: var(--ui-dp-field-error);
    font-size: 11px;
    line-height: 1;
  }

  .field {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 8px;
    min-block-size: var(--ui-dp-hit);
    padding: 0 10px;
    border: 1px solid var(--ui-dp-field-border);
    border-radius: var(--ui-dp-radius);
    background: var(--ui-dp-field-bg);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.08);
    transition: border-color 140ms ease, box-shadow 140ms ease;
  }

  .field:focus-within {
    border-color: var(--ui-dp-field-focus);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-dp-field-focus) 30%, transparent);
  }

  .field[data-invalid="true"] {
    border-color: color-mix(in srgb, var(--ui-dp-field-error) 68%, transparent);
  }

  .icon {
    display: inline-grid;
    place-items: center;
    color: color-mix(in srgb, var(--ui-dp-text) 68%, transparent);
  }

  .input {
    inline-size: 100%;
    min-inline-size: 0;
    border: 0;
    background: transparent;
    color: var(--ui-dp-text);
    padding: 8px 0;
    outline: none;
    font: 500 14px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .input::placeholder {
    color: color-mix(in srgb, var(--ui-dp-text) 44%, transparent);
  }

  .btn {
    border: 0;
    background: transparent;
    color: color-mix(in srgb, var(--ui-dp-text) 74%, transparent);
    inline-size: 28px;
    block-size: 28px;
    border-radius: 8px;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
  }

  .btn:hover {
    background: color-mix(in srgb, var(--ui-dp-text) 10%, transparent);
    color: var(--ui-dp-text);
  }

  .btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-dp-accent) 62%, transparent);
    outline-offset: 1px;
  }

  .btn[hidden] {
    display: none;
  }

  .hint {
    color: var(--ui-dp-muted);
    font-size: 12px;
    line-height: 1.4;
  }

  .error {
    color: var(--ui-dp-field-error);
    font-size: 12px;
    line-height: 1.4;
  }

  .hint[hidden],
  .error[hidden],
  .label[hidden] {
    display: none;
  }

  :host([disabled]) .field {
    opacity: 0.62;
    pointer-events: none;
  }

  :host([variant="contrast"]) {
    --ui-dp-bg: #0f172a;
    --ui-dp-border: #334155;
    --ui-dp-text: #e2e8f0;
    --ui-dp-muted: #93a4bd;
    --ui-dp-accent: #93c5fd;
    --ui-dp-field-bg: #0f172a;
    --ui-dp-sheet-bg: #0f172a;
    --ui-dp-sheet-backdrop: rgba(2, 6, 23, 0.74);
  }

  .inline-panel {
    border: 1px solid var(--ui-dp-border);
    border-radius: var(--ui-dp-radius);
    background: var(--ui-dp-bg);
    box-shadow: var(--ui-dp-shadow);
    padding: 8px;
    display: grid;
    gap: var(--ui-dp-gap);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
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

  @media (prefers-reduced-motion: reduce) {
    .field,
    .btn {
      transition: none !important;
    }
  }
`;

const overlayStyle = `
  .overlay {
    position: fixed;
    z-index: var(--ui-dp-z, 1100);
    pointer-events: none;
  }

  .panel {
    pointer-events: auto;
    border: 1px solid var(--ui-dp-border, #cbd5e1);
    border-radius: var(--ui-dp-radius, 12px);
    background: var(--ui-dp-bg, #fff);
    color: var(--ui-dp-text, #0f172a);
    box-shadow: var(--ui-dp-shadow, 0 18px 34px rgba(2, 6, 23, 0.14));
    padding: 8px;
    display: grid;
    gap: var(--ui-dp-gap, 8px);
    min-inline-size: min(320px, calc(100vw - 16px));
    max-inline-size: min(360px, calc(100vw - 16px));
  }

  .sheet-wrap {
    position: fixed;
    inset: 0;
    display: grid;
    align-items: end;
    z-index: var(--ui-dp-z, 1100);
  }

  .sheet-backdrop {
    position: absolute;
    inset: 0;
    background: var(--ui-dp-sheet-backdrop, rgba(15, 23, 42, 0.52));
  }

  .sheet {
    position: relative;
    pointer-events: auto;
    background: var(--ui-dp-sheet-bg, #fff);
    color: var(--ui-dp-text, #0f172a);
    border-radius: 16px 16px 0 0;
    border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 84%, transparent);
    box-shadow: 0 -12px 30px rgba(2, 6, 23, 0.2);
    padding: 12px;
    display: grid;
    gap: 10px;
    max-block-size: min(82vh, 620px);
    overflow: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .title {
    margin: 0;
    font: 700 14px/1.3 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-dp-text, #0f172a);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }

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

  .action[data-tone="primary"] {
    border-color: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 60%, transparent);
    background: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 18%, transparent);
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UIDatePicker extends ElementBase {
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
      'placeholder',
      'label',
      'hint',
      'error',
      'clearable',
      'allow-input',
      'close-on-select',
      'outside-click',
      'disabled',
      'readonly',
      'required',
      'name',
      'mode',
      'events',
      'events-max',
      'events-display',
      'format',
      'display-format'
    ];
  }

  private _value: string | null = null;
  private _pendingValue: string | null = null;
  private _draftInput = '';
  private _inlineError = '';
  private _open = false;
  private _syncing = false;
  private _overlay: HTMLDivElement | null = null;
  private _releaseScrollLock: (() => void) | null = null;
  private _lastOpenSource: DatePickerSource | 'attribute' = 'api';
  private _restoreFocusEl: HTMLElement | null = null;
  private _isInitialized = false;
  private _hasView = false;
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
  private _onOverlaySelectBound = (event: Event) => this._onCalendarSelect(event);

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClickBound);
    this.root.addEventListener('input', this._onRootInputBound);
    this.root.addEventListener('focusout', this._onRootBlurBound);
    this.root.addEventListener('keydown', this._onRootKeyDownBound);

    if (!this._isInitialized) {
      const initial = normalizeDateIso(this.getAttribute('value'))
        || normalizeDateIso(this.getAttribute('default-value'));
      this._value = initial;
      this._pendingValue = initial;
      this._draftInput = this._formatDisplay(initial);
      this._open = this.hasAttribute('open') || isTruthyAttr(this.getAttribute('default-open'));
      this._isInitialized = true;
    }

    if (this._open && !this._isInlineMode()) {
      this._ensureOverlay();
    }
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
      this._value = normalizeDateIso(newValue);
      this._pendingValue = this._value;
      this._draftInput = this._formatDisplay(this._value);
      this._inlineError = '';
    }

    if (name === 'open' && !this._syncing) {
      this._open = this.hasAttribute('open');
      this._syncOverlay(this._open ? 'api' : 'outside');
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

  private _allowInput(): boolean {
    return isTruthyAttr(this.getAttribute('allow-input'), true);
  }

  private _clearable(): boolean {
    return isTruthyAttr(this.getAttribute('clearable'), true);
  }

  private _closeOnSelect(): boolean {
    return isTruthyAttr(this.getAttribute('close-on-select'), true);
  }

  private _locale(): string {
    return normalizeLocale(this.getAttribute('locale'));
  }

  private _formatMode(): 'iso' | 'locale' | 'custom' {
    const value = (this.getAttribute('format') || 'locale').trim();
    if (value === 'iso' || value === 'custom') return value;
    return 'locale';
  }

  private _displayFormat(): string | null {
    const value = (this.getAttribute('display-format') || '').trim();
    return value || null;
  }

  private _placeholder(): string {
    const placeholder = this.getAttribute('placeholder');
    if (placeholder) return placeholder;
    return this._formatMode() === 'iso' ? 'YYYY-MM-DD' : 'Select date';
  }

  private _todayIso(): string {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${mm}-${dd}`;
  }

  private _minIso(): string | null {
    return parseConstraintDate(this.getAttribute('min'));
  }

  private _maxIso(): string | null {
    return parseConstraintDate(this.getAttribute('max'));
  }

  private _isWithinBounds(iso: string): boolean {
    const minIso = this._minIso();
    const maxIso = this._maxIso();
    if (minIso && compareISO(iso, minIso) < 0) return false;
    if (maxIso && compareISO(iso, maxIso) > 0) return false;
    return true;
  }

  private _formatDisplay(value: string | null): string {
    return formatDateForDisplay(value, this._locale(), this._formatMode(), this._displayFormat());
  }

  private _syncValueAttribute(next: string | null): void {
    this._syncing = true;
    try {
      if (!next) {
        if (this.hasAttribute('value')) this.removeAttribute('value');
      } else if (this.getAttribute('value') !== next) {
        this.setAttribute('value', next);
      }
    } finally {
      this._syncing = false;
    }
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

  private _emitInput(source: DatePickerSource): void {
    const detail: DatePickerDetail = {
      mode: 'single',
      value: this._pendingValue,
      displayValue: this._formatDisplay(this._pendingValue),
      source
    };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
  }

  private _emitChange(source: DatePickerSource): void {
    const detail: DatePickerDetail = {
      mode: 'single',
      value: this._value,
      displayValue: this._formatDisplay(this._value),
      source
    };
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _emitInvalid(raw: string, reason: string): void {
    this.dispatchEvent(
      new CustomEvent('invalid', {
        detail: { raw, reason },
        bubbles: true,
        composed: true
      })
    );
  }

  private _setOpen(next: boolean, source: DatePickerSource): void {
    if (this._isDisabled()) return;
    if (this._open === next) return;
    this._open = next;
    this._lastOpenSource = source;
    this._syncOpenAttribute(next);
    this._syncOverlay(source);
    this._updateHostState();
    this.dispatchEvent(new CustomEvent(next ? 'open' : 'close', { bubbles: true, composed: true }));
  }

  private _syncOverlay(source: DatePickerSource | 'attribute'): void {
    if (this._isInlineMode()) {
      this._destroyOverlay();
      return;
    }
    if (this._open) {
      this._ensureOverlay();
      this._syncOverlayState();
    } else {
      this._destroyOverlay();
      if (source !== 'outside') {
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
    }
  }

  private _ensureOverlay(): void {
    if (this._overlay || typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.className = 'ui-date-picker-overlay-host';
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.zIndex = '1100';
    el.style.pointerEvents = 'none';
    el.addEventListener('click', this._onOverlayClickBound);
    el.addEventListener('select', this._onOverlaySelectBound as EventListener);
    el.addEventListener('change', this._onOverlaySelectBound as EventListener);
    document.body.appendChild(el);
    this._overlay = el;
    document.addEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.addEventListener('keydown', this._onDocumentKeyDownBound);
    window.addEventListener('resize', this._onWindowResizeBound);
    window.addEventListener('scroll', this._onWindowScrollBound, true);
    if (this._isMobileSheet()) {
      this._releaseScrollLock = lockBodyScroll();
    }
  }

  private _destroyOverlay(): void {
    if (!this._overlay) return;
    this._schedulePosition.cancel();
    document.removeEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.removeEventListener('keydown', this._onDocumentKeyDownBound);
    window.removeEventListener('resize', this._onWindowResizeBound);
    window.removeEventListener('scroll', this._onWindowScrollBound, true);
    this._overlay.removeEventListener('click', this._onOverlayClickBound);
    this._overlay.removeEventListener('select', this._onOverlaySelectBound as EventListener);
    this._overlay.removeEventListener('change', this._onOverlaySelectBound as EventListener);
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
    const field = this.root.querySelector('.field') as HTMLElement | null;
    const panel = this._overlay.querySelector('.panel') as HTMLElement | null;
    if (!field || !panel) return;
    const anchorRect = field.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const position = computePopoverPosition(anchorRect, panelRect);
    panel.style.position = 'absolute';
    panel.style.top = `${Math.round(position.top)}px`;
    panel.style.left = `${Math.round(position.left)}px`;
    panel.setAttribute('data-placement', position.placement);
  }

  private _parseAndValidate(raw: string): string | null {
    return parseUserDateInput(raw, this._locale());
  }

  private _commit(next: string | null, source: DatePickerSource): void {
    if (this._isReadonly() || this._isDisabled()) return;
    this._value = next;
    this._pendingValue = next;
    this._draftInput = this._formatDisplay(next);
    this._inlineError = '';
    this._syncValueAttribute(next);
    this._emitInput(source);
    this._emitChange(source);
    this._updateHostState();
  }

  private _renderPanelInner(isSheet: boolean): string {
    const label = this.getAttribute('label') || 'Select date';
    const shouldShowApply = !this._closeOnSelect() || isSheet;
    const panelClass = isSheet ? 'sheet' : 'panel';
    return `
      <style>${overlayStyle}</style>
      ${isSheet ? '<div class="sheet-backdrop" data-action="backdrop"></div>' : ''}
      <section class="${panelClass}" part="${isSheet ? 'sheet' : 'popover'}" aria-label="Date picker panel">
        ${isSheet ? `<header class="header" part="header"><p class="title">${escapeHtml(label)}</p><button type="button" class="action" data-action="cancel">Cancel</button></header>` : ''}
        <ui-calendar class="dp-calendar" part="calendar"></ui-calendar>
        <footer class="footer" part="footer">
          <button type="button" class="action" data-action="today" part="presets">Today</button>
          <button type="button" class="action" data-action="clear" part="clear">Clear</button>
          ${shouldShowApply ? '<button type="button" class="action" data-tone="primary" data-action="apply" part="apply">Apply</button>' : ''}
        </footer>
      </section>
    `;
  }

  private _syncCalendarElement(calendarEl: HTMLElement): void {
    const syncAttr = (name: string, value: string | null) => {
      if (value == null || value === '') {
        if (calendarEl.hasAttribute(name)) calendarEl.removeAttribute(name);
        return;
      }
      if (calendarEl.getAttribute(name) !== value) calendarEl.setAttribute(name, value);
    };
    const syncBool = (name: string, enabled: boolean) => {
      if (enabled) {
        if (!calendarEl.hasAttribute(name)) calendarEl.setAttribute(name, '');
      } else if (calendarEl.hasAttribute(name)) {
        calendarEl.removeAttribute(name);
      }
    };

    syncAttr('selection', 'single');
    syncAttr('value', this._pendingValue);
    syncAttr('min', this.getAttribute('min'));
    syncAttr('max', this.getAttribute('max'));
    syncAttr('locale', this.getAttribute('locale'));
    syncAttr('week-start', this.getAttribute('week-start'));
    const sizeAttr = this.getAttribute('size');
    const effectiveSize = sizeAttr || 'sm';
    syncAttr('size', effectiveSize);
    syncAttr('variant', this.getAttribute('variant'));
    syncAttr('outside-click', this.getAttribute('outside-click'));
    syncAttr('events', this.getAttribute('events'));
    syncAttr('events-max', this.getAttribute('events-max'));
    syncAttr('events-display', this.getAttribute('events-display'));
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
    syncBool('readonly', this._isReadonly());
    syncBool('disabled', this._isDisabled());
  }

  private _ensureOverlayContent(sheet: boolean): void {
    if (!this._overlay) return;
    const mode: 'sheet' | 'popover' = sheet ? 'sheet' : 'popover';
    if (this._overlayMode === mode && this._overlay.querySelector('.dp-calendar')) return;
    this._overlayMode = mode;
    this._overlay.innerHTML = sheet
      ? `<div class="sheet-wrap">${this._renderPanelInner(true)}</div>`
      : `<div class="overlay">${this._renderPanelInner(false)}</div>`;
  }

  private _syncOverlayState(): void {
    if (!this._overlay) return;
    const sheet = this._isMobileSheet();
    this._ensureOverlayContent(sheet);
    const title = this._overlay.querySelector('.title') as HTMLElement | null;
    if (title) title.textContent = this.getAttribute('label') || 'Select date';
    const apply = this._overlay.querySelector('[data-action="apply"]') as HTMLButtonElement | null;
    if (apply) apply.hidden = this._closeOnSelect() && !sheet;
    const actions = this._overlay.querySelectorAll('.action');
    const actionsDisabled = this._isDisabled();
    actions.forEach((node) => {
      (node as HTMLButtonElement).disabled = actionsDisabled;
    });
    const calendarEl = this._overlay.querySelector('.dp-calendar') as HTMLElement | null;
    if (calendarEl) this._syncCalendarElement(calendarEl);
    if (!sheet) this._schedulePosition.run();
  }

  private _renderOverlay(): void {
    this._syncOverlayState();
  }

  private _renderInlineCalendar(): void {
    const calendarEl = this.root.querySelector('.inline-calendar') as HTMLElement | null;
    if (!calendarEl) return;
    this._syncCalendarElement(calendarEl);
  }

  private _handleDraftCommit(source: DatePickerSource): void {
    const raw = this._draftInput.trim();
    if (!raw) {
      this._commit(null, source);
      return;
    }
    const parsed = this._parseAndValidate(raw);
    if (!parsed) {
      this._inlineError = this.getAttribute('error') || 'Invalid date';
      this._emitInvalid(raw, 'parse');
      this._updateHostState();
      return;
    }
    if (!this._isWithinBounds(parsed)) {
      this._inlineError = this.getAttribute('error') || 'Date is outside the allowed range';
      this._emitInvalid(raw, 'range');
      this._updateHostState();
      return;
    }
    this._pendingValue = parsed;
    this._commit(parsed, source);
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const actionEl = target.closest('[data-action]') as HTMLElement | null;
    const action = actionEl?.getAttribute('data-action');

    if (action === 'toggle') {
      this._restoreFocusEl = target;
      this._setOpen(!this._open, 'api');
      return;
    }
    if (action === 'clear') {
      event.preventDefault();
      this._commit(null, 'clear');
      return;
    }
    if (action === 'today') {
      event.preventDefault();
      const today = this._todayIso();
      const clamped = this._parseAndValidate(today);
      if (!clamped) return;
      const next = clampDateIso(clamped, this._minIso(), this._maxIso());
      if (!next) return;
      this._pendingValue = next;
      this._emitInput('today');
      if (this._closeOnSelect() && !this._isInlineMode()) {
        this._commit(next, 'today');
        this._setOpen(false, 'today');
      } else {
        this._updateHostState();
      }
      return;
    }
    if (action === 'apply') {
      event.preventDefault();
      this._commit(this._pendingValue, 'apply');
      if (!this._isInlineMode()) this._setOpen(false, 'apply');
      return;
    }
    if (action === 'cancel') {
      event.preventDefault();
      this._pendingValue = this._value;
      this._draftInput = this._formatDisplay(this._value);
      this._inlineError = '';
      if (!this._isInlineMode()) this._setOpen(false, 'outside');
      this._updateHostState();
      return;
    }
  }

  private _onRootInput(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains('input')) return;
    if (!this._allowInput()) return;
    this._draftInput = target.value;
    this._inlineError = '';
    const parsed = this._parseAndValidate(target.value);
    this._pendingValue = parsed;
    this._emitInput('typing');
  }

  private _onRootBlur(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains('input')) return;
    if (!this._allowInput()) return;
    this._handleDraftCommit('blur');
  }

  private _onRootKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const target = keyboardEvent.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains('input')) return;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this._handleDraftCommit('enter');
      if (!this._isInlineMode()) this._setOpen(false, 'enter');
      return;
    }
    if (keyboardEvent.key === 'ArrowDown' && !this._open && !this._isInlineMode()) {
      keyboardEvent.preventDefault();
      this._setOpen(true, 'api');
      return;
    }
    if (keyboardEvent.key === 'Escape' && this._open && !this._isInlineMode()) {
      keyboardEvent.preventDefault();
      this._setOpen(false, 'escape');
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

    if (action === 'today') {
      const clamped = this._parseAndValidate(this._todayIso());
      if (!clamped) return;
      const next = clampDateIso(clamped, this._minIso(), this._maxIso());
      this._pendingValue = next;
      this._emitInput('today');
      if (this._closeOnSelect()) {
        this._commit(next, 'today');
        this._setOpen(false, 'today');
      } else {
        this._renderOverlay();
      }
      return;
    }
    if (action === 'clear') {
      this._pendingValue = null;
      this._emitInput('clear');
      if (this._closeOnSelect()) {
        this._commit(null, 'clear');
        this._setOpen(false, 'clear');
      } else {
        this._renderOverlay();
      }
      return;
    }
    if (action === 'apply') {
      this._commit(this._pendingValue, 'apply');
      this._setOpen(false, 'apply');
      return;
    }
    if (action === 'cancel') {
      this._pendingValue = this._value;
      this._setOpen(false, 'outside');
    }
  }

  private _onCalendarSelect(event: Event): void {
    const customEvent = event as CustomEvent<{ value?: string; mode?: string }>;
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName.toLowerCase() !== 'ui-calendar') return;

    let iso: string | null = null;
    if (customEvent.type === 'select') {
      iso = normalizeDateIso(customEvent.detail?.value || null);
    } else if (customEvent.type === 'change') {
      const value = (customEvent.detail as { value?: unknown })?.value;
      if (typeof value === 'string') iso = normalizeDateIso(value);
    }
    if (!iso) return;
    this._pendingValue = iso;
    this._emitInput('calendar');
    if (this._closeOnSelect()) {
      this._commit(iso, 'calendar');
      if (!this._isInlineMode()) this._setOpen(false, 'calendar');
    } else {
      this._updateHostState();
    }
  }

  private _updateHostState(): void {
    if (!this._hasView) return;
    const label = this.getAttribute('label') || '';
    const hint = this.getAttribute('hint') || '';
    const manualError = this.getAttribute('error') || '';
    const error = this._inlineError || manualError;
    const placeholder = this._placeholder();
    const hasValue = !!this._value;
    const name = this.getAttribute('name') || '';
    const isInline = this._isInlineMode();
    const fieldValue = this._allowInput() ? this._draftInput : this._formatDisplay(this._value);

    const labelEl = this.root.querySelector('.label') as HTMLElement | null;
    const labelText = this.root.querySelector('.label-text') as HTMLElement | null;
    const requiredEl = this.root.querySelector('.required') as HTMLElement | null;
    const fieldEl = this.root.querySelector('.field') as HTMLElement | null;
    const inputEl = this.root.querySelector('.input') as HTMLInputElement | null;
    const clearBtn = this.root.querySelector('.btn[data-action="clear"]') as HTMLButtonElement | null;
    const toggleBtn = this.root.querySelector('.btn[data-action="toggle"]') as HTMLButtonElement | null;
    const hintEl = this.root.querySelector('.hint') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;
    const hiddenInput = this.root.querySelector('.hidden-input') as HTMLInputElement | null;
    const inlinePanel = this.root.querySelector('.inline-panel') as HTMLElement | null;

    if (labelEl) labelEl.hidden = !label;
    if (labelText) labelText.textContent = label;
    if (requiredEl) requiredEl.hidden = !this.hasAttribute('required');
    if (fieldEl) fieldEl.dataset.invalid = error ? 'true' : 'false';

    if (inputEl) {
      if (inputEl.value !== fieldValue) inputEl.value = fieldValue;
      inputEl.placeholder = placeholder;
      inputEl.readOnly = !this._allowInput() || this._isReadonly();
      inputEl.disabled = this._isDisabled();
      inputEl.required = this.hasAttribute('required');
    }
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
    if (hiddenInput) {
      hiddenInput.disabled = !name;
      hiddenInput.name = name;
      hiddenInput.value = this._value || '';
    }
    if (inlinePanel) inlinePanel.hidden = !isInline;

    if (isInline) {
      this._renderInlineCalendar();
      this._destroyOverlay();
      return;
    }

    if (this._open) this._syncOverlayState();
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
          <div class="field" part="field input">
            <span class="icon" part="icon" aria-hidden="true">📅</span>
            <input class="input" part="input" />
            <button type="button" class="btn" part="clear" data-action="clear" aria-label="Clear date">✕</button>
            <button type="button" class="btn" part="toggle" data-action="toggle" aria-label="Toggle calendar">▾</button>
          </div>
          <div class="hint" part="hint"></div>
          <div class="error" part="error" role="alert"></div>
          <input class="hidden-input" type="hidden" disabled />
          <section class="inline-panel" part="popover">
            <ui-calendar class="inline-calendar" part="calendar"></ui-calendar>
            <footer class="footer" part="footer">
              <button type="button" class="action" data-action="today" part="presets">Today</button>
              <button type="button" class="action" data-action="clear" part="clear">Clear</button>
              <button type="button" class="action" data-tone="primary" data-action="apply" part="apply">Apply</button>
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-date-picker')) {
  customElements.define('ui-date-picker', UIDatePicker);
}
