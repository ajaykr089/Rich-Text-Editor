const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');

class FakeClassList {
  constructor() {
    this.classes = new Set();
  }

  add(...tokens) {
    tokens.forEach((token) => this.classes.add(token));
  }

  remove(...tokens) {
    tokens.forEach((token) => this.classes.delete(token));
  }

  contains(token) {
    return this.classes.has(token);
  }

  toggle(token, force) {
    if (typeof force === 'boolean') {
      if (force) this.classes.add(token);
      else this.classes.delete(token);
      return force;
    }

    if (this.classes.has(token)) {
      this.classes.delete(token);
      return false;
    }

    this.classes.add(token);
    return true;
  }
}

class MiniEventTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event) {
    if (!event || !event.type) return true;
    try {
      if (!event.target) {
        Object.defineProperty(event, 'target', {
          configurable: true,
          value: this,
        });
      }
    } catch {
      // ignore readonly target
    }

    this.listeners.get(event.type)?.forEach((listener) => listener(event));
    return true;
  }
}

class FakeElement extends MiniEventTarget {
  constructor(tagName = 'div') {
    super();
    this.nodeType = 1;
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.ownerDocument = null;
    this.classList = new FakeClassList();
    this.style = {};
    this.innerHTML = '';
    this.innerText = '';
    this.textContent = '';
    this.id = '';
    this.attrs = new Map();
  }

  get isConnected() {
    let current = this;
    while (current.parentNode) {
      current = current.parentNode;
    }

    return current.tagName === 'BODY' || current.tagName === 'HEAD' || current.tagName === 'HTML';
  }

  appendChild(child) {
    child.parentNode = this;
    child.ownerDocument = this.ownerDocument;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      child.parentNode = null;
      if (this.ownerDocument && typeof this.ownerDocument.notifyMutation === 'function') {
        this.ownerDocument.notifyMutation(this, child);
      }
    }
    return child;
  }

  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }

  setAttribute(name, value) {
    if (name === 'class') {
      value
        .split(/\s+/)
        .filter(Boolean)
        .forEach((token) => this.classList.add(token));
    }

    if (name === 'id') {
      this.id = value;
    }

    this.attrs.set(name, value);
  }

  getAttribute(name) {
    if (name === 'id' && this.id) return this.id;
    return this.attrs.has(name) ? this.attrs.get(name) : null;
  }

  removeAttribute(name) {
    if (name === 'id') this.id = '';
    this.attrs.delete(name);
  }

  matches(selector) {
    const selectors = selector.split(',').map((item) => item.trim()).filter(Boolean);
    return selectors.some((item) => this.matchesSingle(item));
  }

  matchesSingle(selector) {
    if (selector === '.rte-content') return this.classList.contains('rte-content');
    if (selector === '.editora-content') return this.classList.contains('editora-content');
    if (selector === '.rte-editor') return this.classList.contains('rte-editor');
    if (selector === '.editora-editor') return this.classList.contains('editora-editor');
    if (selector === 'editora-editor') return this.tagName.toLowerCase() === 'editora-editor';

    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));

    const attrMatch = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
    if (attrMatch) {
      const attrName = attrMatch[1];
      const attrValue = attrMatch[2];
      const current = this.getAttribute(attrName);
      if (typeof attrValue === 'string') return current === attrValue;
      return current !== null;
    }

    return false;
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (current.matches(selector)) return current;
      current = current.parentNode;
    }
    return null;
  }

  querySelector(selector) {
    const queue = [...this.children];
    while (queue.length > 0) {
      const next = queue.shift();
      if (next.matches && next.matches(selector)) return next;
      if (next.children?.length) queue.push(...next.children);
    }
    return null;
  }

  querySelectorAll(selector) {
    const matched = [];
    const queue = [...this.children];
    while (queue.length > 0) {
      const next = queue.shift();
      if (next.matches && next.matches(selector)) matched.push(next);
      if (next.children?.length) queue.push(...next.children);
    }
    return matched;
  }

  focus() {
    if (this.ownerDocument) {
      this.ownerDocument.activeElement = this;
    }
  }

  scrollIntoView() {
    // noop
  }

  getBoundingClientRect() {
    return {
      x: 10,
      y: 10,
      top: 10,
      left: 10,
      right: 610,
      bottom: 410,
      width: 600,
      height: 400,
      toJSON: () => ({}),
    };
  }
}

class FakeTextNode {
  constructor(element) {
    this.nodeType = 3;
    this.parentElement = element;
    this.parentNode = element;
  }

  get data() {
    return this.parentElement.textContent || '';
  }

  set data(value) {
    this.parentElement.textContent = value;
    this.parentElement.innerText = value;
    this.parentElement.innerHTML = value;
  }
}

class FakeDocument {
  constructor() {
    this.documentElement = new FakeElement('html');
    this.head = new FakeElement('head');
    this.body = new FakeElement('body');
    this.activeElement = null;
    this.listeners = new Map();
    this.editors = [];
    this.mutationObservers = new Set();

    this.documentElement.ownerDocument = this;
    this.head.ownerDocument = this;
    this.body.ownerDocument = this;

    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
  }

  registerEditor(editor) {
    this.editors.push(editor);
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  emit(type, event) {
    const listeners = this.listeners.get(type);
    if (!listeners) return;
    listeners.forEach((listener) => listener(event));
  }

  createElement(tagName) {
    const element = new FakeElement(tagName);
    element.ownerDocument = this;
    return element;
  }

  createTreeWalker(root) {
    const textNode = new FakeTextNode(root);
    let consumed = false;

    return {
      nextNode() {
        if (consumed) return null;
        consumed = true;
        const value = root.textContent || '';
        if (!value) return null;
        return textNode;
      },
    };
  }

  getElementById(id) {
    const queue = [this.head, this.body];
    while (queue.length > 0) {
      const next = queue.shift();
      if (next.id === id) return next;
      queue.push(...next.children);
    }
    return null;
  }

  querySelector(selector) {
    if (selector.includes('.rte-content') || selector.includes('.editora-content')) {
      return this.editors[0] || null;
    }
    return null;
  }

  registerMutationObserver(observer) {
    this.mutationObservers.add(observer);
  }

  unregisterMutationObserver(observer) {
    this.mutationObservers.delete(observer);
  }

  isInSubtree(node, ancestor) {
    let current = node;
    while (current) {
      if (current === ancestor) return true;
      current = current.parentNode;
    }
    return false;
  }

  notifyMutation(target, removedNode) {
    const record = {
      type: 'childList',
      target,
      removedNodes: [removedNode],
      addedNodes: [],
    };

    this.mutationObservers.forEach((observer) => {
      if (!observer?.__observing || !observer.__options?.childList) return;

      const observedTarget = observer.__target;
      if (!observedTarget) return;

      const inScope = target === observedTarget || (observer.__options.subtree && this.isInSubtree(target, observedTarget));
      if (!inScope) return;

      observer.__callback([record]);
    });
  }
}

class FakeWindow {
  constructor() {
    this.innerWidth = 1280;
    this.innerHeight = 800;
    this.listeners = new Map();
    this.setTimeout = (...args) => setTimeout(...args);
    this.clearTimeout = (timerId) => clearTimeout(timerId);
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  getSelection() {
    return null;
  }
}

function installFakeDom() {
  const document = new FakeDocument();
  const window = new FakeWindow();

  globalThis.document = document;
  globalThis.window = window;
  globalThis.HTMLElement = FakeElement;
  globalThis.Element = FakeElement;
  globalThis.Node = { ELEMENT_NODE: 1, TEXT_NODE: 3 };
  globalThis.NodeFilter = { SHOW_TEXT: 4 };
  globalThis.MutationObserver = class MutationObserverPolyfill {
    constructor(callback) {
      this.__callback = callback;
      this.__target = null;
      this.__options = null;
      this.__observing = false;
    }

    observe(target, options) {
      this.__target = target;
      this.__options = options || {};
      this.__observing = true;
      document.registerMutationObserver(this);
    }

    disconnect() {
      this.__observing = false;
      document.unregisterMutationObserver(this);
    }
  };

  if (!globalThis.Event) {
    class EventPolyfill {
      constructor(type, params = {}) {
        this.type = type;
        this.bubbles = Boolean(params.bubbles);
        this.cancelable = Boolean(params.cancelable);
      }
    }
    globalThis.Event = EventPolyfill;
  }

  if (!globalThis.CustomEvent) {
    class CustomEventPolyfill extends globalThis.Event {
      constructor(type, params) {
        super(type, params);
        this.detail = params?.detail;
      }
    }
    globalThis.CustomEvent = CustomEventPolyfill;
  }

  return { document, window };
}

function createEditor(env, text) {
  const editor = env.document.createElement('div');
  editor.classList.add('rte-content');
  editor.setAttribute('contenteditable', 'true');
  editor.textContent = text;
  editor.innerText = text;
  editor.innerHTML = text;
  env.document.body.appendChild(editor);
  env.document.registerEditor(editor);
  return editor;
}

function createEditorHost(env, text) {
  const host = env.document.createElement('div');
  host.setAttribute('data-editora-editor', 'true');
  host.classList.add('rte-editor');

  const editor = env.document.createElement('div');
  editor.classList.add('rte-content');
  editor.setAttribute('contenteditable', 'true');
  editor.textContent = text;
  editor.innerText = text;
  editor.innerHTML = text;

  host.appendChild(editor);
  env.document.body.appendChild(host);
  env.document.registerEditor(editor);

  return { host, editor };
}

describe('PIIRedactionPlugin', () => {
  beforeEach(() => {
    jest.resetModules();
    installFakeDom();
  });

  afterEach(() => {
    delete globalThis.document;
    delete globalThis.window;
    delete globalThis.HTMLElement;
    delete globalThis.Element;
    delete globalThis.Node;
    delete globalThis.NodeFilter;
    delete globalThis.MutationObserver;
  });

  it('isolates scan findings per editor instance', async () => {
    const { PIIRedactionPlugin } = require('./PIIRedactionPlugin.native.ts');
    const env = { document: globalThis.document };

    const editorA = createEditor(env, 'Email: alice@acme.com');
    const editorB = createEditor(env, 'API key: sk-ABCDEF1234567890ABCDEF1234567890AB');

    const plugin = PIIRedactionPlugin({ enableRealtime: false });
    plugin.init?.call({}, { editorElement: editorA });
    plugin.init?.call({}, { editorElement: editorB });

    await plugin.commands?.runPIIScan?.(undefined, { contentElement: editorA });
    await plugin.commands?.runPIIScan?.(undefined, { contentElement: editorB });

    let findingsA = [];
    let findingsB = [];

    plugin.commands?.getPIIRedactionFindings?.((findings) => {
      findingsA = findings;
    }, { contentElement: editorA });

    plugin.commands?.getPIIRedactionFindings?.((findings) => {
      findingsB = findings;
    }, { contentElement: editorB });

    expect(findingsA.some((item) => item.type === 'email')).toBe(true);
    expect(findingsA.some((item) => item.type === 'api-key')).toBe(false);

    expect(findingsB.some((item) => item.type === 'api-key')).toBe(true);
    expect(findingsB.some((item) => item.type === 'email')).toBe(false);

    plugin.destroy?.();
    plugin.destroy?.();
  });

  it('redacts all findings and rescans clean', async () => {
    const { PIIRedactionPlugin } = require('./PIIRedactionPlugin.native.ts');
    const env = { document: globalThis.document };

    const editor = createEditor(env, 'Contact: bob@acme.com | Phone: 415-555-0100');
    const plugin = PIIRedactionPlugin({ enableRealtime: false, redactionMode: 'token' });
    plugin.init?.call({}, { editorElement: editor });

    await plugin.commands?.runPIIScan?.(undefined, { contentElement: editor });

    const redacted = await plugin.commands?.redactAllPII?.(undefined, { contentElement: editor });
    expect(redacted).toBe(true);
    expect(editor.textContent.includes('[REDACTED:EMAIL]')).toBe(true);

    let findings = [];
    plugin.commands?.getPIIRedactionFindings?.((value) => {
      findings = value;
    }, { contentElement: editor });

    expect(findings).toHaveLength(0);

    plugin.destroy?.();
  });

  it('blocks redaction in readonly mode and supports runtime detector updates', async () => {
    const { PIIRedactionPlugin } = require('./PIIRedactionPlugin.native.ts');
    const env = { document: globalThis.document };

    const editor = createEditor(env, 'Primary: secops@acme.com');
    const plugin = PIIRedactionPlugin({ enableRealtime: false });
    plugin.init?.call({}, { editorElement: editor });

    await plugin.commands?.runPIIScan?.(undefined, { contentElement: editor });

    editor.setAttribute('contenteditable', 'false');
    editor.setAttribute('data-readonly', 'true');

    const blocked = await plugin.commands?.redactAllPII?.(undefined, { contentElement: editor });
    expect(blocked).toBe(false);

    editor.setAttribute('contenteditable', 'true');
    editor.removeAttribute('data-readonly');

    plugin.commands?.setPIIRedactionOptions?.({
      detectors: {
        email: false,
      },
    }, { contentElement: editor });

    await plugin.commands?.runPIIScan?.(undefined, { contentElement: editor });

    let findings = [];
    plugin.commands?.getPIIRedactionFindings?.((value) => {
      findings = value;
    }, { contentElement: editor });

    expect(findings.some((item) => item.type === 'email')).toBe(false);

    plugin.destroy?.();
  });

  it('resolves commands with explicit command editor context', async () => {
    const { PIIRedactionPlugin } = require('./PIIRedactionPlugin.native.ts');
    const env = { document: globalThis.document };

    const first = createEditorHost(env, 'Primary contact: alice@acme.com');
    const second = createEditorHost(env, 'Leaked key: sk-ABCDEF1234567890ABCDEF1234567890AB');

    const plugin = PIIRedactionPlugin({ enableRealtime: false, redactionMode: 'token' });
    plugin.init?.call({}, { editorElement: first.host });
    plugin.init?.call({}, { editorElement: second.host });

    await plugin.commands?.runPIIScan?.(undefined, { contentElement: first.editor });
    await plugin.commands?.runPIIScan?.(undefined, { contentElement: second.editor });
    await plugin.commands?.runPIIScan?.(undefined, { contentElement: first.editor });

    globalThis.window.__editoraCommandEditorRoot = second.editor;
    const redacted = await plugin.commands?.redactAllPII?.();
    expect(redacted).toBe(true);
    expect(second.editor.textContent.includes('[REDACTED:API-KEY]')).toBe(true);
    expect(first.editor.textContent.includes('[REDACTED:EMAIL]')).toBe(false);

    plugin.destroy?.();
    plugin.destroy?.();
  });

  it('returns immutable findings snapshots', async () => {
    const { PIIRedactionPlugin } = require('./PIIRedactionPlugin.native.ts');
    const env = { document: globalThis.document };

    const editor = createEditor(env, 'Email: audit@acme.com');
    const plugin = PIIRedactionPlugin({ enableRealtime: false });
    plugin.init?.call({}, { editorElement: editor });
    await plugin.commands?.runPIIScan?.(undefined, { contentElement: editor });

    let firstFindings = [];
    let firstStats = null;
    plugin.commands?.getPIIRedactionFindings?.((findings, stats) => {
      firstFindings = findings;
      firstStats = stats;
    }, { contentElement: editor });

    expect(firstFindings.length).toBeGreaterThan(0);
    firstFindings[0].match = 'tampered-value';
    firstFindings.push({
      id: 'fake',
      type: 'email',
      severity: 'low',
      match: 'fake',
      masked: 'fake',
      occurrence: 999,
    });
    firstStats.total = 777;

    let secondFindings = [];
    let secondStats = null;
    plugin.commands?.getPIIRedactionFindings?.((findings, stats) => {
      secondFindings = findings;
      secondStats = stats;
    }, { contentElement: editor });

    expect(secondFindings.length).toBeLessThan(firstFindings.length);
    expect(secondFindings[0].match).not.toBe('tampered-value');
    expect(secondStats.total).not.toBe(777);

    plugin.destroy?.();
  });

  it('does not apply redact shortcut when keydown target is outside editor context', async () => {
    const { PIIRedactionPlugin } = require('./PIIRedactionPlugin.native.ts');
    const env = { document: globalThis.document };

    const editor = createEditor(env, 'Contact: bob@acme.com');
    const plugin = PIIRedactionPlugin({ enableRealtime: false, redactionMode: 'token' });
    plugin.init?.call({}, { editorElement: editor });
    await plugin.commands?.runPIIScan?.(undefined, { contentElement: editor });

    const outside = env.document.createElement('button');
    env.document.body.appendChild(outside);

    env.document.emit('keydown', {
      type: 'keydown',
      key: 'm',
      ctrlKey: true,
      metaKey: false,
      altKey: true,
      shiftKey: true,
      defaultPrevented: false,
      target: outside,
      preventDefault() {},
      stopPropagation() {},
    });

    expect(editor.textContent.includes('[REDACTED:EMAIL]')).toBe(false);

    plugin.destroy?.();
  });

  it('cleans panel state when editor host is detached from DOM', async () => {
    const { PIIRedactionPlugin } = require('./PIIRedactionPlugin.native.ts');
    const env = { document: globalThis.document };

    const { host, editor } = createEditorHost(env, 'Email: remove.me@acme.com');
    const plugin = PIIRedactionPlugin({ enableRealtime: false });
    plugin.init?.call({}, { editorElement: host });

    plugin.commands?.togglePIIRedactionPanel?.(true, { contentElement: editor });
    const hasPanelBeforeDetach = env.document.body.children.some((node) =>
      typeof node.id === 'string' && node.id.startsWith('rte-pii-redaction-panel-'));
    expect(hasPanelBeforeDetach).toBe(true);

    env.document.body.removeChild(host);

    const hasPanelAfterDetach = env.document.body.children.some((node) =>
      typeof node.id === 'string' && node.id.startsWith('rte-pii-redaction-panel-'));
    expect(hasPanelAfterDetach).toBe(false);

    plugin.destroy?.();
  });

  it('keeps mask-mode redaction idempotent with unsafe maskChar values', async () => {
    const { PIIRedactionPlugin } = require('./PIIRedactionPlugin.native.ts');
    const env = { document: globalThis.document };

    const editor = createEditor(env, 'Email: audit-team@acme.com');
    const plugin = PIIRedactionPlugin({
      enableRealtime: false,
      redactionMode: 'mask',
      maskChar: '-', // unsafe for email local-part if not normalized
    });
    plugin.init?.call({}, { editorElement: editor });

    await plugin.commands?.runPIIScan?.(undefined, { contentElement: editor });
    const changed = await plugin.commands?.redactAllPII?.(undefined, { contentElement: editor });
    expect(changed).toBe(true);

    await plugin.commands?.runPIIScan?.(undefined, { contentElement: editor });

    let findings = [];
    plugin.commands?.getPIIRedactionFindings?.((value) => {
      findings = value;
    }, { contentElement: editor });

    expect(findings.length).toBe(0);
    expect(editor.textContent.includes('[at]')).toBe(true);

    plugin.destroy?.();
  });
});
