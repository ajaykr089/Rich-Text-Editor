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
        Object.defineProperty(event, 'target', { configurable: true, value: this });
      }
    } catch {
      // Ignore readonly target.
    }

    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
    return true;
  }
}

class FakeTemplateContent {
  constructor() {
    this.nodes = [];
  }

  append(...items) {
    this.nodes.push(...items);
  }
}

class FakeElement extends MiniEventTarget {
  constructor(tagName = 'div') {
    super();
    this.nodeType = 1;
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.ownerDocument = null;
    this.classList = new FakeClassList();
    this.attrs = new Map();
    this.style = {};
    this.innerHTML = '';
    this.textContent = '';
    this.id = '';
    this.content = this.tagName === 'TEMPLATE' ? new FakeTemplateContent() : undefined;
  }

  get className() {
    return Array.from(this.classList.classes).join(' ');
  }

  set className(value) {
    this.classList = new FakeClassList();
    String(value || '')
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token) => this.classList.add(token));
  }

  get isConnected() {
    let current = this;
    while (current.parentNode) {
      current = current.parentNode;
    }
    return current.tagName === 'BODY' || current.tagName === 'HTML';
  }

  get childNodes() {
    return this.children;
  }

  get nextSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.children || [];
    const index = siblings.indexOf(this);
    if (index < 0) return null;
    return siblings[index + 1] || null;
  }

  appendChild(child) {
    child.parentNode = this;
    child.ownerDocument = this.ownerDocument;
    this.children.push(child);
    return child;
  }

  insertBefore(child, referenceNode) {
    child.parentNode = this;
    child.ownerDocument = this.ownerDocument;

    if (!referenceNode) {
      this.children.push(child);
      return child;
    }

    const index = this.children.indexOf(referenceNode);
    if (index < 0) {
      this.children.push(child);
      return child;
    }

    this.children.splice(index, 0, child);
    return child;
  }

  append(...items) {
    items.forEach((item) => {
      if (item && typeof item === 'object' && item.tagName) {
        this.appendChild(item);
      }
    });
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

  contains(node) {
    if (!node) return false;
    if (node === this) return true;
    return this.children.some((child) => child.contains?.(node));
  }

  setAttribute(name, value) {
    if (name === 'class') {
      this.className = value;
      return;
    }
    if (name === 'id') {
      this.id = String(value);
      return;
    }
    this.attrs.set(name, String(value));
  }

  getAttribute(name) {
    if (name === 'id') return this.id || null;
    return this.attrs.has(name) ? this.attrs.get(name) : null;
  }

  hasAttribute(name) {
    return name === 'id' ? Boolean(this.id) : this.attrs.has(name);
  }

  removeAttribute(name) {
    if (name === 'id') {
      this.id = '';
      return;
    }
    this.attrs.delete(name);
  }

  matches(selector) {
    const selectors = String(selector)
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    return selectors.some((entry) => this.matchesSingle(entry));
  }

  matchesSingle(selector) {
    if (!selector) return false;

    if (selector.startsWith('.')) {
      const classMatch = selector.match(/^\.([a-zA-Z0-9_-]+)/);
      if (classMatch && !this.classList.contains(classMatch[1])) return false;

      const attrMatch = selector.match(/\[([^=\]]+)=\"([^\"]*)\"\]/);
      if (attrMatch) {
        return this.getAttribute(attrMatch[1]) === attrMatch[2];
      }
      return true;
    }

    if (selector.startsWith('[')) {
      const attrMatch = selector.match(/^\[([^=\]]+)(?:=\"([^\"]*)\")?\]$/);
      if (!attrMatch) return false;
      const current = this.getAttribute(attrMatch[1]);
      if (typeof attrMatch[2] === 'string') return current === attrMatch[2];
      return current !== null;
    }

    return this.tagName.toLowerCase() === selector.toLowerCase();
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

  getBoundingClientRect() {
    return {
      x: 10,
      y: 10,
      top: 10,
      left: 10,
      right: 620,
      bottom: 420,
      width: 610,
      height: 410,
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

    this.documentElement.ownerDocument = this;
    this.head.ownerDocument = this;
    this.body.ownerDocument = this;
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
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

  createElement(tagName) {
    const element = new FakeElement(tagName);
    element.ownerDocument = this;
    return element;
  }

  querySelector(selector) {
    return this.documentElement.querySelector(selector);
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
}

function createEditorHost(document) {
  const host = document.createElement('div');
  host.classList.add('rte-editor');
  host.setAttribute('data-editora-editor', 'true');

  const editor = document.createElement('div');
  editor.classList.add('rte-content');
  editor.setAttribute('contenteditable', 'true');

  host.appendChild(editor);
  document.body.appendChild(host);
  return { host, editor };
}

function appendToolbarToggle(host, command) {
  const button = host.ownerDocument.createElement('button');
  button.classList.add('rte-toolbar-button');
  button.setAttribute('data-command', command);
  host.appendChild(button);
  return button;
}

function setHeadings(document, editor, headingTexts) {
  editor.children = [];
  headingTexts.forEach((text) => {
    const heading = document.createElement('h2');
    heading.textContent = text;
    editor.appendChild(heading);
  });
}

function setHeadingsWithLevel(document, editor, headingTexts, level = 2) {
  editor.children = [];
  headingTexts.forEach((text) => {
    const heading = document.createElement(`h${level}`);
    heading.textContent = text;
    editor.appendChild(heading);
  });
}

function readHeadingTexts(editor) {
  return editor.querySelectorAll('h1, h2, h3, h4, h5, h6').map((item) => item.textContent);
}

function readHeadingTags(editor) {
  return editor.querySelectorAll('h1, h2, h3, h4, h5, h6').map((item) => item.tagName);
}

describe('DocSchemaPlugin', () => {
  let originalWindow;
  let originalDocument;
  let originalHTMLElement;
  let originalNode;
  let originalCustomEvent;
  let originalEvent;

  beforeEach(() => {
    jest.resetModules();
    originalWindow = global.window;
    originalDocument = global.document;
    originalHTMLElement = global.HTMLElement;
    originalNode = global.Node;
    originalCustomEvent = global.CustomEvent;
    originalEvent = global.Event;
  });

  afterEach(() => {
    global.window = originalWindow;
    global.document = originalDocument;
    global.HTMLElement = originalHTMLElement;
    global.Node = originalNode;
    global.CustomEvent = originalCustomEvent;
    global.Event = originalEvent;
  });

  function setupRuntime() {
    const fakeDocument = new FakeDocument();
    const fakeWindow = {
      getSelection: () => null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      setTimeout,
      clearTimeout,
      innerWidth: 1280,
      innerHeight: 900,
      executeEditorCommand: jest.fn(),
    };

    global.document = fakeDocument;
    global.window = fakeWindow;
    global.HTMLElement = FakeElement;
    global.Node = { ELEMENT_NODE: 1, TEXT_NODE: 3 };
    global.CustomEvent = class CustomEvent {
      constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
        this.bubbles = Boolean(init.bubbles);
      }
    };
    global.Event = class Event {
      constructor(type, init = {}) {
        this.type = type;
        this.bubbles = Boolean(init.bubbles);
      }
    };

    return { fakeDocument };
  }

  it('detects missing required sections for strict schema', () => {
    const { fakeDocument } = setupRuntime();
    const { DocSchemaPlugin } = require('./DocSchemaPlugin.native.ts');

    const plugin = DocSchemaPlugin({
      defaultSchemaId: 'policy',
      schemas: [
        {
          id: 'policy',
          label: 'Policy',
          strictOrder: true,
          allowUnknownHeadings: false,
          sections: [{ title: 'Policy Statement' }, { title: 'Controls' }, { title: 'Enforcement' }],
        },
      ],
    });

    const { host, editor } = createEditorHost(fakeDocument);
    setHeadings(fakeDocument, editor, ['Policy Statement']);
    plugin.init.call({}, { editorElement: host });

    expect(plugin.commands.runDocSchemaValidation(undefined, { contentElement: editor })).toBe(true);

    let snapshot = null;
    plugin.commands.getDocSchemaState((state) => {
      snapshot = state;
    }, { contentElement: editor });

    expect(snapshot).toBeTruthy();
    expect(snapshot.issues.some((issue) => issue.type === 'missing-section' && issue.sectionTitle === 'Controls')).toBe(true);
    expect(snapshot.issues.some((issue) => issue.type === 'missing-section' && issue.sectionTitle === 'Enforcement')).toBe(true);
  });

  it('switches schema mode at runtime and refreshes issue set', () => {
    const { fakeDocument } = setupRuntime();
    const { DocSchemaPlugin } = require('./DocSchemaPlugin.native.ts');

    const plugin = DocSchemaPlugin({
      defaultSchemaId: 'alpha',
      schemas: [
        {
          id: 'alpha',
          label: 'Alpha',
          sections: [{ title: 'Summary' }],
        },
        {
          id: 'beta',
          label: 'Beta',
          sections: [{ title: 'Root Cause' }],
        },
      ],
    });

    const { host, editor } = createEditorHost(fakeDocument);
    setHeadings(fakeDocument, editor, ['Root Cause']);
    plugin.init.call({}, { editorElement: host });

    plugin.commands.runDocSchemaValidation(undefined, { contentElement: editor });
    let alphaState = null;
    plugin.commands.getDocSchemaState((state) => {
      alphaState = state;
    }, { contentElement: editor });

    expect(alphaState.issues.some((issue) => issue.type === 'missing-section' && issue.sectionTitle === 'Summary')).toBe(
      true,
    );

    expect(plugin.commands.setDocSchemaMode('beta', { contentElement: editor })).toBe(true);

    let betaState = null;
    plugin.commands.getDocSchemaState((state) => {
      betaState = state;
    }, { contentElement: editor });

    expect(betaState.activeSchemaId).toBe('beta');
    expect(betaState.issues.some((issue) => issue.type === 'missing-section')).toBe(false);
  });

  it('uses configurable issue list label in panel markup', () => {
    const { fakeDocument } = setupRuntime();
    const { DocSchemaPlugin } = require('./DocSchemaPlugin.native.ts');

    const plugin = DocSchemaPlugin({
      labels: {
        issueListLabel: 'Governance issues',
      },
    });

    const { host, editor } = createEditorHost(fakeDocument);
    setHeadings(fakeDocument, editor, ['Policy Statement']);
    plugin.init.call({}, { editorElement: host });

    expect(plugin.commands.openDocSchemaPanel(undefined, { contentElement: editor })).toBe(true);
    const panel = fakeDocument.body.querySelector('.rte-doc-schema-panel');
    expect(panel).toBeTruthy();
    expect(panel.innerHTML).toContain('aria-label="Governance issues"');
  });

  it('does not execute schema shortcuts from external focused inputs with stale editor selection', () => {
    const { fakeDocument } = setupRuntime();
    const { DocSchemaPlugin } = require('./DocSchemaPlugin.native.ts');

    const plugin = DocSchemaPlugin({ enableRealtime: false });
    const { host, editor } = createEditorHost(fakeDocument);
    setHeadings(fakeDocument, editor, ['Policy Statement']);
    plugin.init.call({}, { editorElement: host });

    const externalInput = fakeDocument.createElement('input');
    fakeDocument.body.appendChild(externalInput);
    externalInput.focus();

    global.window.getSelection = () => ({
      rangeCount: 1,
      getRangeAt: () => ({ startContainer: editor }),
    });

    const keydownListeners = Array.from(fakeDocument.listeners.get('keydown') || []);
    keydownListeners.forEach((listener) =>
      listener({
        type: 'keydown',
        key: 'g',
        ctrlKey: true,
        metaKey: false,
        altKey: true,
        shiftKey: true,
        target: externalInput,
        defaultPrevented: false,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      }),
    );

    const visiblePanel = fakeDocument.body.querySelector('.rte-doc-schema-panel.show');
    expect(visiblePanel).toBeNull();
  });

  it('inserts strict-order missing sections near schema boundaries and keeps heading level consistent', () => {
    const { fakeDocument } = setupRuntime();
    const { DocSchemaPlugin } = require('./DocSchemaPlugin.native.ts');

    const plugin = DocSchemaPlugin({
      defaultSchemaId: 'policy',
      schemas: [
        {
          id: 'policy',
          label: 'Policy',
          strictOrder: true,
          allowUnknownHeadings: true,
          sections: [{ title: 'Policy Statement' }, { title: 'Controls' }, { title: 'Enforcement' }],
        },
      ],
    });

    const { host, editor } = createEditorHost(fakeDocument);
    setHeadingsWithLevel(fakeDocument, editor, ['Controls'], 3);
    plugin.init.call({}, { editorElement: host });

    expect(plugin.commands.insertMissingDocSchemaSections(undefined, { contentElement: editor })).toBe(true);

    expect(readHeadingTexts(editor)).toEqual(['Policy Statement', 'Controls', 'Enforcement']);
    expect(readHeadingTags(editor)).toEqual(['H3', 'H3', 'H3']);
  });

  it('blocks missing-section insertion when editor is read-only', () => {
    const { fakeDocument } = setupRuntime();
    const { DocSchemaPlugin } = require('./DocSchemaPlugin.native.ts');

    const plugin = DocSchemaPlugin({
      defaultSchemaId: 'policy',
      schemas: [
        {
          id: 'policy',
          label: 'Policy',
          strictOrder: true,
          allowUnknownHeadings: true,
          sections: [{ title: 'Policy Statement' }, { title: 'Controls' }],
        },
      ],
    });

    const { host, editor } = createEditorHost(fakeDocument);
    setHeadings(fakeDocument, editor, ['Controls']);
    editor.setAttribute('contenteditable', 'false');
    plugin.init.call({}, { editorElement: host });

    expect(plugin.commands.insertMissingDocSchemaSections(undefined, { contentElement: editor })).toBe(false);
    expect(readHeadingTexts(editor)).toEqual(['Controls']);
  });

  it('keeps command context and toolbar active state isolated across editor instances', () => {
    const { fakeDocument } = setupRuntime();
    const { DocSchemaPlugin } = require('./DocSchemaPlugin.native.ts');

    const plugin = DocSchemaPlugin({ enableRealtime: false });

    const { host: hostA, editor: editorA } = createEditorHost(fakeDocument);
    const { host: hostB, editor: editorB } = createEditorHost(fakeDocument);
    const buttonA = appendToolbarToggle(hostA, 'toggleDocSchemaRealtime');
    const buttonB = appendToolbarToggle(hostB, 'toggleDocSchemaRealtime');

    plugin.init.call({}, { editorElement: hostA });
    plugin.init.call({}, { editorElement: hostB });

    expect(buttonA.classList.contains('active')).toBe(false);
    expect(buttonB.classList.contains('active')).toBe(false);

    global.window.__editoraCommandEditorRoot = hostA;
    expect(plugin.commands.toggleDocSchemaRealtime(true)).toBe(true);
    expect(buttonA.classList.contains('active')).toBe(true);
    expect(buttonB.classList.contains('active')).toBe(false);

    global.window.__editoraCommandEditorRoot = hostB;
    expect(plugin.commands.toggleDocSchemaRealtime(true)).toBe(true);
    expect(buttonA.classList.contains('active')).toBe(true);
    expect(buttonB.classList.contains('active')).toBe(true);

    global.window.__editoraCommandEditorRoot = hostA;
    expect(plugin.commands.toggleDocSchemaRealtime(false)).toBe(true);
    expect(buttonA.classList.contains('active')).toBe(false);
    expect(buttonB.classList.contains('active')).toBe(true);

    let stateA = null;
    let stateB = null;
    plugin.commands.getDocSchemaState((state) => {
      stateA = state;
    }, { contentElement: editorA });
    plugin.commands.getDocSchemaState((state) => {
      stateB = state;
    }, { contentElement: editorB });

    expect(stateA.realtimeEnabled).toBe(false);
    expect(stateB.realtimeEnabled).toBe(true);
  });
});
