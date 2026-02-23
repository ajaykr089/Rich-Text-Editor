import { ElementBase } from '../ElementBase';
import {
  combineDateTime,
  compareDateTimes,
  computePopoverPosition,
  isTruthyAttr,
  lockBodyScroll,
  parseConstraintDateTime,
  parseTimeInput,
  rafThrottle,
  shouldUseMobileSheet,
  splitDateTime
} from './date-time-utils';

type RangeDateTimeValue = { start: string | null; end: string | null };
type RangeDateTimeDetail = {
  mode: 'datetimerange';
  start: string | null;
  end: string | null;
  value: { start: string; end: string } | null;
  source: string;
};

type PendingState = {
  startDate: string | null;
  endDate: string | null;
  startTime: string;
  endTime: string;
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
    min-inline-size: min(260px, 100%);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-dp-text);
  }
  .root { display: grid; gap: 6px; }
  .label { font: 600 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ui-dp-text); }
  .label[hidden] { display: none; }
  .field {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 8px;
    min-block-size: 38px;
    border: 1px solid var(--ui-dp-border);
    border-radius: var(--ui-dp-radius);
    background: var(--ui-dp-bg);
    padding: 0 10px;
  }
  .input {
    border: 0;
    background: transparent;
    color: var(--ui-dp-text);
    outline: none;
    min-inline-size: 0;
    inline-size: 100%;
    padding: 8px 0;
    font: 500 14px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
`;

const overlayStyle = `
  .overlay { position: fixed; z-index: var(--ui-dp-z, 1100); pointer-events: none; }
  .panel {
    pointer-events: auto;
    min-inline-size: min(660px, calc(100vw - 16px));
    max-inline-size: min(720px, calc(100vw - 16px));
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
    max-block-size: min(82vh, 680px);
    overflow: auto;
  }
  .content { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 10px; align-items: start; }
  .time-groups { display: grid; gap: 10px; }
  .time-card { border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 85%, transparent); border-radius: 10px; padding: 10px; display: grid; gap: 6px; }
  .time-title { margin: 0; font: 700 12px/1.2 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ui-dp-text, #0f172a); }
  .time-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .time-grid label { font-size: 11px; color: var(--ui-dp-muted, #64748b); font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
  .time-grid select {
    min-block-size: 34px;
    border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 84%, transparent);
    border-radius: 8px;
    padding: 0 8px;
    background: color-mix(in srgb, var(--ui-dp-bg, #fff) 95%, transparent);
    color: var(--ui-dp-text, #0f172a);
    font: 600 13px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .footer { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }
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

function parseValue(raw: string | null): RangeDateTimeValue {
  if (!raw) return { start: null, end: null };
  try {
    const parsed = JSON.parse(raw);
    const start = typeof parsed?.start === 'string' ? parsed.start : null;
    const end = typeof parsed?.end === 'string' ? parsed.end : null;
    return { start, end };
  } catch {
    return { start: null, end: null };
  }
}

function serializeValue(value: RangeDateTimeValue): string | null {
  if (!value.start && !value.end) return null;
  return JSON.stringify({
    ...(value.start ? { start: value.start } : {}),
    ...(value.end ? { end: value.end } : {})
  });
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function defaultPending(value: RangeDateTimeValue): PendingState {
  const now = new Date();
  const defaultTimeStart = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
  const defaultTimeEnd = `${pad2((now.getHours() + 1) % 24)}:${pad2(now.getMinutes())}`;
  const start = splitDateTime(value.start || null);
  const end = splitDateTime(value.end || null);
  return {
    startDate: start?.date || null,
    endDate: end?.date || null,
    startTime: start?.time?.slice(0, 5) || defaultTimeStart,
    endTime: end?.time?.slice(0, 5) || defaultTimeEnd
  };
}

export class UIDateRangeTimePicker extends ElementBase {
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
      'step',
      'auto-normalize',
      'allow-partial',
      'disabled',
      'readonly',
      'required',
      'name',
      'close-on-select',
      'clearable',
      'mode',
      'label',
      'hint',
      'error'
    ];
  }

  private _value: RangeDateTimeValue = { start: null, end: null };
  private _pending: PendingState = defaultPending({ start: null, end: null });
  private _display = '';
  private _inlineError = '';
  private _open = false;
  private _syncing = false;
  private _overlay: HTMLDivElement | null = null;
  private _releaseScrollLock: (() => void) | null = null;
  private _isInitialized = false;
  private _hasView = false;
  private _restoreFocusEl: HTMLElement | null = null;
  private _overlayKey: string | null = null;
  private _schedulePosition = rafThrottle(() => this._positionOverlay());

  private _onRootClickBound = (event: Event) => this._onRootClick(event);
  private _onRootKeyDownBound = (event: Event) => this._onRootKeyDown(event);
  private _onOverlayClickBound = (event: Event) => this._onOverlayClick(event);
  private _onOverlayChangeBound = (event: Event) => this._onOverlayChange(event);
  private _onOverlayCalendarBound = (event: Event) => this._onOverlayCalendar(event);
  private _onDocumentPointerDownBound = (event: PointerEvent) => this._onDocumentPointerDown(event);
  private _onDocumentKeyDownBound = (event: KeyboardEvent) => this._onDocumentKeyDown(event);
  private _onWindowResizeBound = () => this._schedulePosition.run();
  private _onWindowScrollBound = () => this._schedulePosition.run();

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClickBound);
    this.root.addEventListener('keydown', this._onRootKeyDownBound);

    if (!this._isInitialized) {
      const initial = parseValue(this.getAttribute('value') || this.getAttribute('default-value'));
      this._value = initial;
      this._pending = defaultPending(initial);
      this._display = this._formatDisplay();
      this._open = this.hasAttribute('open') || isTruthyAttr(this.getAttribute('default-open'));
      this._isInitialized = true;
    }
    if (this._open && !this._isInlineMode()) this._ensureOverlay();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClickBound);
    this.root.removeEventListener('keydown', this._onRootKeyDownBound);
    this._destroyOverlay();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'value' && !this._syncing) {
      this._value = parseValue(newValue);
      this._pending = defaultPending(this._value);
      this._display = this._formatDisplay();
      this._inlineError = '';
    }
    if (name === 'open' && !this._syncing) {
      this._open = this.hasAttribute('open');
      this._syncOverlay('attribute');
    }
    if (name === 'mode') {
      this._syncOverlay('attribute');
    }
    if (name === 'disabled' && this.hasAttribute('disabled')) this._setOpen(false, 'outside');
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

  private _allowPartial(): boolean {
    return isTruthyAttr(this.getAttribute('allow-partial'), true);
  }

  private _autoNormalize(): boolean {
    return isTruthyAttr(this.getAttribute('auto-normalize'), true);
  }

  private _step(): number {
    const parsed = Number(this.getAttribute('step') || 5);
    if (!Number.isFinite(parsed) || parsed < 1) return 5;
    return Math.min(60, Math.trunc(parsed));
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

  private _syncValueAttribute(next: RangeDateTimeValue): void {
    const serialized = serializeValue(next);
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
    const detail: RangeDateTimeDetail = {
      mode: 'datetimerange',
      start: this._valueFromPending().start,
      end: this._valueFromPending().end,
      value: this._valueFromPending().start && this._valueFromPending().end
        ? { start: this._valueFromPending().start as string, end: this._valueFromPending().end as string }
        : null,
      source
    };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
  }

  private _emitChange(source: string): void {
    const detail: RangeDateTimeDetail = {
      mode: 'datetimerange',
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

  private _valueFromPending(): RangeDateTimeValue {
    return {
      start: combineDateTime(this._pending.startDate, this._pending.startTime),
      end: combineDateTime(this._pending.endDate, this._pending.endTime)
    };
  }

  private _formatDisplay(): string {
    const start = this._value.start;
    const end = this._value.end;
    if (!start && !end) return '';
    if (start && end) return `${start} — ${end}`;
    return start || end || '';
  }

  private _normalizePendingState(state: PendingState): PendingState {
    let start = combineDateTime(state.startDate, state.startTime);
    let end = combineDateTime(state.endDate, state.endTime);
    if (start && end && compareDateTimes(start, end) > 0) {
      if (this._autoNormalize()) {
        const tmp = start;
        start = end;
        end = tmp;
      }
    }
    const min = parseConstraintDateTime(this.getAttribute('min'));
    const max = parseConstraintDateTime(this.getAttribute('max'));
    const minValue = min ? `${min.date}T${min.time}` : null;
    const maxValue = max ? `${max.date}T${max.time}` : null;
    if (start && minValue && compareDateTimes(start, minValue) < 0) start = minValue;
    if (start && maxValue && compareDateTimes(start, maxValue) > 0) start = maxValue;
    if (end && minValue && compareDateTimes(end, minValue) < 0) end = minValue;
    if (end && maxValue && compareDateTimes(end, maxValue) > 0) end = maxValue;
    const splitStart = splitDateTime(start || '');
    const splitEnd = splitDateTime(end || '');
    return {
      startDate: splitStart?.date || null,
      endDate: splitEnd?.date || null,
      startTime: splitStart?.time?.slice(0, 5) || state.startTime,
      endTime: splitEnd?.time?.slice(0, 5) || state.endTime
    };
  }

  private _commit(state: PendingState, source: string): void {
    if (this._isDisabled() || this._isReadonly()) return;
    const normalized = this._normalizePendingState(state);
    const value = {
      start: combineDateTime(normalized.startDate, normalized.startTime),
      end: combineDateTime(normalized.endDate, normalized.endTime)
    };
    if (!this._allowPartial() && (!value.start || !value.end)) {
      this._inlineError = this.getAttribute('error') || 'Range is incomplete';
      this._emitInvalid(JSON.stringify(value), 'partial');
      this._updateHostState();
      return;
    }
    if (value.start && value.end && compareDateTimes(value.start, value.end) > 0) {
      this._inlineError = this.getAttribute('error') || 'Invalid range order';
      this._emitInvalid(JSON.stringify(value), 'order');
      this._updateHostState();
      return;
    }
    this._value = value;
    this._pending = normalized;
    this._display = this._formatDisplay();
    this._inlineError = '';
    this._syncValueAttribute(value);
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
    el.addEventListener('change', this._onOverlayChangeBound);
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
    this._overlay.removeEventListener('change', this._onOverlayChangeBound);
    this._overlay.removeEventListener('change', this._onOverlayCalendarBound as EventListener);
    if (this._overlay.parentElement) this._overlay.parentElement.removeChild(this._overlay);
    this._overlay = null;
    this._overlayKey = null;
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
    const position = computePopoverPosition(field.getBoundingClientRect(), panel.getBoundingClientRect());
    panel.style.position = 'absolute';
    panel.style.top = `${Math.round(position.top)}px`;
    panel.style.left = `${Math.round(position.left)}px`;
  }

  private _timeOptions(selected: string): { hours: string; minutes: string } {
    const parsed = parseTimeInput(selected, true) || { hours: 0, minutes: 0, seconds: 0 };
    const step = this._step();
    const hours = Array.from({ length: 24 }, (_, index) => {
      return `<option value="${index}" ${index === parsed.hours ? 'selected' : ''}>${pad2(index)}</option>`;
    }).join('');
    const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, index) => {
      const value = Math.min(59, index * step);
      return `<option value="${value}" ${value === parsed.minutes ? 'selected' : ''}>${pad2(value)}</option>`;
    }).join('');
    return { hours, minutes };
  }

  private _renderOverlayInner(sheet: boolean): string {
    const start = this._timeOptions(this._pending.startTime);
    const end = this._timeOptions(this._pending.endTime);
    const content = `
      <div class="content">
        <ui-calendar class="drtp-calendar" part="calendar"></ui-calendar>
        <section class="time-groups" part="time">
          <div class="time-card">
            <p class="time-title">Start time</p>
            <div class="time-grid">
              <div><label>Hour</label><select data-time="start" data-segment="hours">${start.hours}</select></div>
              <div><label>Minute</label><select data-time="start" data-segment="minutes">${start.minutes}</select></div>
            </div>
          </div>
          <div class="time-card">
            <p class="time-title">End time</p>
            <div class="time-grid">
              <div><label>Hour</label><select data-time="end" data-segment="hours">${end.hours}</select></div>
              <div><label>Minute</label><select data-time="end" data-segment="minutes">${end.minutes}</select></div>
            </div>
          </div>
        </section>
      </div>
      <footer class="footer" part="footer">
        <button type="button" class="action" data-action="clear">Clear</button>
        <button type="button" class="action" data-action="cancel">Cancel</button>
        <button type="button" class="action" data-action="apply" data-tone="primary">Apply</button>
      </footer>
    `;
    return `
      <style>${overlayStyle}</style>
      ${sheet ? '<div class="sheet-backdrop" data-action="backdrop"></div>' : ''}
      <section class="${sheet ? 'sheet' : 'panel'}" part="${sheet ? 'sheet' : 'popover'}">${content}</section>
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
    syncAttr('selection', 'range');
    syncAttr('value', JSON.stringify({
      ...(this._pending.startDate ? { start: this._pending.startDate } : {}),
      ...(this._pending.endDate ? { end: this._pending.endDate } : {})
    }));
    const min = parseConstraintDateTime(this.getAttribute('min'));
    const max = parseConstraintDateTime(this.getAttribute('max'));
    syncAttr('min', min?.date || null);
    syncAttr('max', max?.date || null);
    syncAttr('locale', this.getAttribute('locale'));
    syncAttr('week-start', this.getAttribute('week-start'));
    const sizeAttr = this.getAttribute('size');
    const effectiveSize = sizeAttr || 'sm';
    syncAttr('size', effectiveSize);
    syncAttr('variant', this.getAttribute('variant'));
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
  }

  private _overlaySignature(sheet: boolean): string {
    return [sheet ? 'sheet' : 'popover', this._step()].join(':');
  }

  private _ensureOverlayContent(sheet: boolean): void {
    if (!this._overlay) return;
    const signature = this._overlaySignature(sheet);
    if (this._overlayKey === signature && this._overlay.querySelector('.drtp-calendar')) return;
    this._overlayKey = signature;
    this._overlay.innerHTML = sheet
      ? `<div class="sheet-wrap">${this._renderOverlayInner(true)}</div>`
      : `<div class="overlay">${this._renderOverlayInner(false)}</div>`;
  }

  private _setClosestOptionValue(select: HTMLSelectElement, desired: number): void {
    const values = Array.from(select.options).map((option) => Number(option.value)).filter((n) => Number.isFinite(n));
    if (!values.length) return;
    let best = values[0];
    let bestDistance = Math.abs(best - desired);
    for (let index = 1; index < values.length; index += 1) {
      const current = values[index];
      const distance = Math.abs(current - desired);
      if (distance < bestDistance) {
        best = current;
        bestDistance = distance;
      }
    }
    select.value = String(best);
  }

  private _syncOverlayState(): void {
    if (!this._overlay) return;
    const sheet = this._isMobileSheet();
    this._ensureOverlayContent(sheet);
    const calendarEl = this._overlay.querySelector('.drtp-calendar') as HTMLElement | null;
    if (calendarEl) this._syncCalendar(calendarEl);
    const startParsed = parseTimeInput(this._pending.startTime, true) || { hours: 0, minutes: 0, seconds: 0 };
    const endParsed = parseTimeInput(this._pending.endTime, true) || { hours: 0, minutes: 0, seconds: 0 };
    const selectStartHour = this._overlay.querySelector('select[data-time="start"][data-segment="hours"]') as HTMLSelectElement | null;
    const selectStartMinute = this._overlay.querySelector('select[data-time="start"][data-segment="minutes"]') as HTMLSelectElement | null;
    const selectEndHour = this._overlay.querySelector('select[data-time="end"][data-segment="hours"]') as HTMLSelectElement | null;
    const selectEndMinute = this._overlay.querySelector('select[data-time="end"][data-segment="minutes"]') as HTMLSelectElement | null;
    if (selectStartHour) this._setClosestOptionValue(selectStartHour, startParsed.hours);
    if (selectStartMinute) this._setClosestOptionValue(selectStartMinute, startParsed.minutes);
    if (selectEndHour) this._setClosestOptionValue(selectEndHour, endParsed.hours);
    if (selectEndMinute) this._setClosestOptionValue(selectEndMinute, endParsed.minutes);
    const disabled = this._isDisabled() || this._isReadonly();
    [selectStartHour, selectStartMinute, selectEndHour, selectEndMinute].forEach((el) => {
      if (el) el.disabled = disabled;
    });
    const actions = this._overlay.querySelectorAll('.action');
    actions.forEach((node) => {
      (node as HTMLButtonElement).disabled = disabled;
    });
    if (!sheet) this._schedulePosition.run();
  }

  private _renderOverlay(): void {
    this._syncOverlayState();
  }

  private _applyTimeFromOverlay(target: HTMLSelectElement): void {
    const timeKey = target.getAttribute('data-time');
    const hourEl = this._overlay?.querySelector(`select[data-time="${timeKey}"][data-segment="hours"]`) as HTMLSelectElement | null;
    const minuteEl = this._overlay?.querySelector(`select[data-time="${timeKey}"][data-segment="minutes"]`) as HTMLSelectElement | null;
    if (!timeKey || !hourEl || !minuteEl) return;
    const hours = Number(hourEl.value);
    const minutes = Number(minuteEl.value);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;
    const time = `${pad2(hours)}:${pad2(minutes)}`;
    if (timeKey === 'start') this._pending.startTime = time;
    if (timeKey === 'end') this._pending.endTime = time;
    this._pending = this._normalizePendingState(this._pending);
    this._emitInput('time');
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const action = target.closest('[data-action]')?.getAttribute('data-action');
    if (!action) return;
    if (action === 'toggle') {
      this._restoreFocusEl = target;
      this._setOpen(!this._open, 'toggle');
      return;
    }
    if (action === 'clear') {
      this._pending = defaultPending({ start: null, end: null });
      this._commit(this._pending, 'clear');
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

  private _onOverlayClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const action = target.closest('[data-action]')?.getAttribute('data-action');
    if (!action) return;
    if (action === 'backdrop') {
      this._setOpen(false, 'outside');
      return;
    }
    if (action === 'cancel') {
      this._pending = defaultPending(this._value);
      this._setOpen(false, 'cancel');
      return;
    }
    if (action === 'clear') {
      this._pending = defaultPending({ start: null, end: null });
      this._emitInput('clear');
      this._renderOverlay();
      return;
    }
    if (action === 'apply') {
      this._commit(this._pending, 'apply');
      this._setOpen(false, 'apply');
    }
  }

  private _onOverlayChange(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLSelectElement)) return;
    if (!target.matches('select[data-time][data-segment]')) return;
    this._applyTimeFromOverlay(target);
  }

  private _onOverlayCalendar(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName.toLowerCase() !== 'ui-calendar') return;
    const detail = (event as CustomEvent<{ mode?: string; start?: string; end?: string }>).detail;
    if (!detail || detail.mode !== 'range') return;
    this._pending.startDate = detail.start || null;
    this._pending.endDate = detail.end || null;
    this._pending = this._normalizePendingState(this._pending);
    this._emitInput('calendar');
    if (isTruthyAttr(this.getAttribute('close-on-select'), false) && this._pending.startDate && this._pending.endDate) {
      this._commit(this._pending, 'calendar');
      this._setOpen(false, 'calendar');
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

  private _updateHostState(): void {
    if (!this._hasView) return;
    const label = this.getAttribute('label') || '';
    const hint = this.getAttribute('hint') || '';
    const manualError = this.getAttribute('error') || '';
    const error = this._inlineError || manualError;
    const hasValue = !!(this._value.start || this._value.end);
    const name = this.getAttribute('name') || '';
    const isInline = this._isInlineMode();

    const labelEl = this.root.querySelector('.label') as HTMLElement | null;
    const labelTextEl = this.root.querySelector('.label-text') as HTMLElement | null;
    const inputEl = this.root.querySelector('.input') as HTMLInputElement | null;
    const clearBtn = this.root.querySelector('.btn[data-action="clear"]') as HTMLButtonElement | null;
    const toggleBtn = this.root.querySelector('.btn[data-action="toggle"]') as HTMLButtonElement | null;
    const hintEl = this.root.querySelector('.hint') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;
    const hiddenInput = this.root.querySelector('.hidden-input') as HTMLInputElement | null;

    if (labelEl) labelEl.hidden = !label;
    if (labelTextEl) labelTextEl.textContent = label;
    if (inputEl) {
      if (inputEl.value !== this._display) inputEl.value = this._display;
      inputEl.placeholder = 'Start — End';
      inputEl.readOnly = true;
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
      hiddenInput.value = serializeValue(this._value) || '';
    }

    if (!isInline && this._open) this._syncOverlayState();
  }

  protected override render(): void {
    if (!this._hasView) {
      this.setContent(`
        <style>${style}</style>
        <div class="root">
          <label class="label" part="label"><span class="label-text"></span></label>
          <div class="field" part="field input">
            <span part="icon">📅</span>
            <input class="input" part="input" readonly />
            <button type="button" class="btn" part="clear" data-action="clear">✕</button>
            <button type="button" class="btn" part="toggle" data-action="toggle">▾</button>
          </div>
          <div class="hint" part="hint"></div>
          <div class="error" part="error" role="alert"></div>
          <input class="hidden-input" type="hidden" disabled />
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-date-range-time-picker')) {
  customElements.define('ui-date-range-time-picker', UIDateRangeTimePicker);
}
