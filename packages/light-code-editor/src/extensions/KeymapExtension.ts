/**
 * Keymap Extension - Platform-aware configurable keyboard bindings
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore, KeyBinding, Keymap } from '../types';

export class KeymapExtension implements EditorExtension {
  public readonly name = 'keymap';
  private editor: EditorCore | null = null;
  private keymap: Keymap = {};
  private isMac: boolean;

  constructor(keymap?: Keymap) {
    this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    // Set default keymap
    this.keymap = keymap || this.getDefaultKeymap();
  }

  setup(editor: EditorCore): void {
    this.editor = editor;

    // Listen for keyboard events
    editor.on('keydown', (event) => {
      return this.handleKeyDown(event);
    });
  }

  private handleKeyDown(event: KeyboardEvent): boolean | void {
    if (!this.editor) return;

    // Find matching key binding
    const binding = this.findMatchingBinding(event);
    if (binding) {
      // Execute the command
      this.editor.executeCommand(binding.command);
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }

  private findMatchingBinding(event: KeyboardEvent): KeyBinding | null {
    const { key, ctrlKey, altKey, shiftKey, metaKey } = event;

    // Normalize key for cross-platform compatibility
    const normalizedKey = key.toLowerCase();

    // Check if we have bindings for this key
    const bindings = this.keymap[normalizedKey];
    if (!bindings) return null;

    // Find exact match
    for (const binding of bindings) {
      if (
        (binding.ctrlKey === ctrlKey || (!binding.ctrlKey && !ctrlKey)) &&
        (binding.altKey === altKey || (!binding.altKey && !altKey)) &&
        (binding.shiftKey === shiftKey || (!binding.shiftKey && !shiftKey)) &&
        (binding.metaKey === metaKey || (!binding.metaKey && !metaKey))
      ) {
        return binding;
      }
    }

    return null;
  }

  private getDefaultKeymap(): Keymap {
    const keymap: Keymap = {};

    // Search commands
    this.addBinding(keymap, 'f', { ctrlKey: !this.isMac, metaKey: this.isMac }, 'find');
    this.addBinding(keymap, 'h', { ctrlKey: !this.isMac, metaKey: this.isMac }, 'replace');

    // Navigation
    this.addBinding(keymap, 'f3', {}, 'findNext');
    this.addBinding(keymap, 'f3', { shiftKey: true }, 'findPrev');
    this.addBinding(keymap, 'g', { ctrlKey: !this.isMac, metaKey: this.isMac }, 'findNext');

    // Folding
    this.addBinding(keymap, '[', { ctrlKey: !this.isMac, metaKey: this.isMac, shiftKey: true }, 'fold');
    this.addBinding(keymap, ']', { ctrlKey: !this.isMac, metaKey: this.isMac, shiftKey: true }, 'unfold');

    // Editor commands
    this.addBinding(keymap, 's', { ctrlKey: !this.isMac, metaKey: this.isMac }, 'save');
    this.addBinding(keymap, 'z', { ctrlKey: !this.isMac, metaKey: this.isMac }, 'undo');
    this.addBinding(keymap, 'y', { ctrlKey: !this.isMac, metaKey: this.isMac }, 'redo');
    this.addBinding(keymap, 'z', { ctrlKey: !this.isMac, metaKey: this.isMac, shiftKey: true }, 'redo');

    // Theme switching
    this.addBinding(keymap, 't', { ctrlKey: !this.isMac, metaKey: this.isMac, shiftKey: true }, 'toggleTheme');

    return keymap;
  }

  private addBinding(keymap: Keymap, key: string, modifiers: Partial<KeyBinding>, command: string): void {
    const normalizedKey = key.toLowerCase();
    if (!keymap[normalizedKey]) {
      keymap[normalizedKey] = [];
    }

    keymap[normalizedKey].push({
      key: normalizedKey,
      command,
      ...modifiers
    });
  }

  // Public API for customizing keymap
  setKeymap(keymap: Keymap): void {
    this.keymap = { ...keymap };
  }

  addKeyBinding(binding: KeyBinding): void {
    const normalizedKey = binding.key.toLowerCase();
    if (!this.keymap[normalizedKey]) {
      this.keymap[normalizedKey] = [];
    }

    // Remove existing binding for this command if it exists
    this.keymap[normalizedKey] = this.keymap[normalizedKey].filter(b => b.command !== binding.command);

    // Add new binding
    this.keymap[normalizedKey].push({
      ...binding,
      key: normalizedKey
    });
  }

  removeKeyBinding(key: string, command?: string): void {
    const normalizedKey = key.toLowerCase();

    if (command) {
      // Remove specific command binding
      if (this.keymap[normalizedKey]) {
        this.keymap[normalizedKey] = this.keymap[normalizedKey].filter(b => b.command !== command);
        if (this.keymap[normalizedKey].length === 0) {
          delete this.keymap[normalizedKey];
        }
      }
    } else {
      // Remove all bindings for this key
      delete this.keymap[normalizedKey];
    }
  }

  getKeymap(): Keymap {
    return { ...this.keymap };
  }

  getBindingsForCommand(command: string): KeyBinding[] {
    const bindings: KeyBinding[] = [];

    for (const key in this.keymap) {
      for (const binding of this.keymap[key]) {
        if (binding.command === command) {
          bindings.push({ ...binding });
        }
      }
    }

    return bindings;
  }

  getPlatformInfo(): { isMac: boolean; platform: string } {
    return {
      isMac: this.isMac,
      platform: navigator.platform
    };
  }

  destroy(): void {
    this.keymap = {};
    this.editor = null;
  }
}
