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
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
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
      // Ignore readonly event target in newer Node/Event implementations.
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
    this.hidden = false;
    this.id = '';
    this.attrs = new Map();
  }

  get isConnected() {
    return this.parentNode !== null || this.tagName === 'BODY' || this.tagName === 'HEAD' || this.tagName === 'HTML';
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

  hasAttribute(name) {
    return this.attrs.has(name) || (name === 'id' && Boolean(this.id));
  }

  removeAttribute(name) {
    if (name === 'id') this.id = '';
    this.attrs.delete(name);
  }

  matches(selector) {
    const parts = selector.split(',').map((part) => part.trim()).filter(Boolean);
    return parts.some((part) => this.matchesSingle(part));
  }

  matchesSingle(selector) {
    if (selector === '.rte-content') return this.classList.contains('rte-content');
    if (selector === '.editora-content') return this.classList.contains('editora-content');
    if (selector === '.rte-editor') return this.classList.contains('rte-editor');
    if (selector === '.editora-editor') return this.classList.contains('editora-editor');
    if (selector === 'editora-editor') return this.tagName.toLowerCase() === 'editora-editor';

    if (selector.startsWith('.')) {
      return this.classList.contains(selector.slice(1));
    }

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

  querySelector() {
    return null;
  }

  querySelectorAll() {
    return [];
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

class FakeDocument {
  constructor() {
    this.documentElement = new FakeElement('html');
    this.head = new FakeElement('head');
    this.body = new FakeElement('body');
    this.activeElement = null;
    this.listeners = new Map();
    this.editors = [];

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
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
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
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
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
  editor.innerHTML = `<p>${text}</p>`;
  env.document.body.appendChild(editor);
  env.document.registerEditor(editor);
  return editor;
}

describe('ApprovalWorkflowPlugin', () => {
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
  });

  it('isolates workflow state per editor instance', async () => {
    const { ApprovalWorkflowPlugin } = require('./ApprovalWorkflowPlugin.native.ts');
    const env = { document: globalThis.document };

    const editorA = createEditor(env, 'A');
    const editorB = createEditor(env, 'B');

    const plugin = ApprovalWorkflowPlugin({ defaultActor: 'QA Lead' });
    plugin.init?.call({}, { editorElement: editorA });
    plugin.init?.call({}, { editorElement: editorB });

    const requested = plugin.commands?.requestApprovalReview?.(undefined, { contentElement: editorA });
    expect(requested).toBe(true);

    const commented = plugin.commands?.addApprovalComment?.(
      { author: 'Reviewer B', message: 'Looks good from legal side.' },
      { contentElement: editorB },
    );
    expect(commented).toBe(true);

    let stateA = null;
    let stateB = null;
    plugin.commands?.getApprovalWorkflowState?.((state) => {
      stateA = state;
    }, { contentElement: editorA });
    plugin.commands?.getApprovalWorkflowState?.((state) => {
      stateB = state;
    }, { contentElement: editorB });

    expect(stateA.status).toBe('review');
    expect(stateA.comments.some((item) => item.message.includes('Review requested'))).toBe(true);

    expect(stateB.status).toBe('draft');
    expect(stateB.comments.some((item) => item.author === 'Reviewer B')).toBe(true);

    plugin.destroy?.();
    plugin.destroy?.();
  });

  it('locks editor on approval and restores pre-approval editability on reopen', async () => {
    const { ApprovalWorkflowPlugin } = require('./ApprovalWorkflowPlugin.native.ts');
    const env = { document: globalThis.document };

    const editor = createEditor(env, 'Workflow content');
    editor.setAttribute('contenteditable', 'true');
    editor.setAttribute('data-readonly', 'false');

    const plugin = ApprovalWorkflowPlugin({ lockOnApproval: true, defaultActor: 'Approver' });
    plugin.init?.call({}, { editorElement: editor });

    const approved = plugin.commands?.approveDocument?.({ comment: 'Final sign-off.' }, { contentElement: editor });
    expect(approved).toBe(true);
    expect(editor.getAttribute('contenteditable')).toBe('false');
    expect(editor.getAttribute('data-readonly')).toBe('true');

    const reopened = plugin.commands?.reopenDraft?.(undefined, { contentElement: editor });
    expect(reopened).toBe(true);
    expect(editor.getAttribute('contenteditable')).toBe('true');
    expect(editor.getAttribute('data-readonly')).toBe('false');

    plugin.destroy?.();
  });

  it('ignores workflow hotkeys when focus is outside editor scope', async () => {
    const { ApprovalWorkflowPlugin } = require('./ApprovalWorkflowPlugin.native.ts');
    const env = { document: globalThis.document };

    const editor = createEditor(env, 'Scoped shortcuts');
    const outsideInput = env.document.createElement('input');
    env.document.body.appendChild(outsideInput);

    const plugin = ApprovalWorkflowPlugin({ defaultActor: 'Owner' });
    plugin.init?.call({}, { editorElement: editor });

    outsideInput.focus();
    env.document.emit('keydown', {
      type: 'keydown',
      key: 'R',
      ctrlKey: true,
      metaKey: false,
      altKey: true,
      shiftKey: true,
      defaultPrevented: false,
      target: outsideInput,
      preventDefault() {
        this.defaultPrevented = true;
      },
      stopPropagation() {
        // noop
      },
    });

    let state = null;
    plugin.commands?.getApprovalWorkflowState?.((value) => {
      state = value;
    }, { contentElement: editor });

    expect(state.status).toBe('draft');
    expect(state.comments).toHaveLength(0);

    plugin.destroy?.();
  });

  it('enforces approval comment requirement when configured', async () => {
    const { ApprovalWorkflowPlugin } = require('./ApprovalWorkflowPlugin.native.ts');
    const env = { document: globalThis.document };

    const editor = createEditor(env, 'Review');
    const plugin = ApprovalWorkflowPlugin({ requireCommentOnApprove: true, defaultActor: 'Owner' });
    plugin.init?.call({}, { editorElement: editor });

    const blocked = plugin.commands?.approveDocument?.(undefined, { contentElement: editor });
    expect(blocked).toBe(false);

    let state = null;
    plugin.commands?.getApprovalWorkflowState?.((value) => {
      state = value;
    }, { contentElement: editor });
    expect(state.status).toBe('draft');
    expect(state.signoffs).toHaveLength(0);

    const approved = plugin.commands?.approveDocument?.('Approved with policy note.', { contentElement: editor });
    expect(approved).toBe(true);

    plugin.commands?.getApprovalWorkflowState?.((value) => {
      state = value;
    }, { contentElement: editor });
    expect(state.status).toBe('approved');
    expect(state.signoffs).toHaveLength(1);

    plugin.destroy?.();
  });
});
