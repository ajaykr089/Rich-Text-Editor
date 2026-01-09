import { EditorState, Transaction } from '../EditorState';
import { Plugin, CommandMap, PluginSpec } from './Plugin';

/**
 * Manages the lifecycle and coordination of editor plugins.
 * Handles plugin registration, command resolution, and event dispatching.
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private commands: Map<string, { plugin: Plugin; command: Function }> = new Map();
  private keyBindings: Map<string, { plugin: Plugin; commandName: string }> = new Map();

  /**
   * Register a plugin with the manager.
   */
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin '${plugin.name}' is already registered`);
    }

    this.plugins.set(plugin.name, plugin);

    // Register commands
    const commands = plugin.getCommands();
    for (const [commandName, command] of Object.entries(commands)) {
      this.commands.set(commandName, { plugin, command });
    }

    // Register key bindings
    const keyBindings = plugin.getKeyBindings();
    for (const [key, commandName] of Object.entries(keyBindings)) {
      this.keyBindings.set(key, { plugin, commandName });
    }

    // Initialize the plugin
    plugin.init({
      schema: null, // Will be set when editor is created
      state: {} as EditorState,
      dispatch: () => {},
      view: null
    });
  }

  /**
   * Unregister a plugin from the manager.
   */
  unregister(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      return;
    }

    // Remove commands
    for (const [commandName, { plugin: cmdPlugin }] of this.commands.entries()) {
      if (cmdPlugin === plugin) {
        this.commands.delete(commandName);
      }
    }

    // Remove key bindings
    for (const [key, { plugin: keyPlugin }] of this.keyBindings.entries()) {
      if (keyPlugin === plugin) {
        this.keyBindings.delete(key);
      }
    }

    // Destroy the plugin
    plugin.destroy({
      schema: null,
      state: {} as EditorState,
      dispatch: () => {},
      view: null
    });

    this.plugins.delete(pluginName);
  }

  /**
   * Get all registered plugins.
   */
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get a plugin by name.
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Execute a command by name.
   */
  executeCommand(commandName: string, state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
    const commandEntry = this.commands.get(commandName);
    if (!commandEntry) {
      return false;
    }

    const { command } = commandEntry;
    return command(state, dispatch) !== false;
  }

  /**
   * Check if a command is available.
   */
  hasCommand(commandName: string): boolean {
    return this.commands.has(commandName);
  }

  /**
   * Get the command function by name.
   */
  getCommand(commandName: string): Function | undefined {
    const entry = this.commands.get(commandName);
    return entry?.command;
  }

  /**
   * Handle a key event and execute the corresponding command if found.
   */
  handleKey(key: string, state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
    const binding = this.keyBindings.get(key);
    if (!binding) {
      return false;
    }

    return this.executeCommand(binding.commandName, state, dispatch);
  }

  /**
   * Get all key bindings.
   */
  getKeyBindings(): Map<string, { plugin: Plugin; commandName: string }> {
    return new Map(this.keyBindings);
  }

  /**
   * Notify all plugins of a transaction.
   */
  onTransaction(tr: Transaction, state: EditorState): void {
    for (const plugin of this.plugins.values()) {
      plugin.onTransaction(tr, {
        schema: state.schema,
        state,
        dispatch: () => {},
        view: null
      });
    }
  }

  /**
   * Notify all plugins of a selection change.
   */
  onSelectionChange(selection: any, state: EditorState): void {
    for (const plugin of this.plugins.values()) {
      plugin.onSelectionChange(selection, {
        schema: state.schema,
        state,
        dispatch: () => {},
        view: null
      });
    }
  }

  /**
   * Notify all plugins of focus event.
   */
  onFocus(state: EditorState): void {
    for (const plugin of this.plugins.values()) {
      plugin.onFocus({
        schema: state.schema,
        state,
        dispatch: () => {},
        view: null
      });
    }
  }

  /**
   * Notify all plugins of blur event.
   */
  onBlur(state: EditorState): void {
    for (const plugin of this.plugins.values()) {
      plugin.onBlur({
        schema: state.schema,
        state,
        dispatch: () => {},
        view: null
      });
    }
  }

  /**
   * Get all schema extensions from plugins.
   */
  getSchemaExtensions(): any[] {
    const extensions: any[] = [];
    for (const plugin of this.plugins.values()) {
      const extension = plugin.getSchemaExtensions();
      if (extension) {
        extensions.push(extension);
      }
    }
    return extensions;
  }

  /**
   * Get all toolbar items from plugins.
   */
  getToolbarItems(): any[] {
    const items: any[] = [];
    for (const plugin of this.plugins.values()) {
      const toolbar = plugin.getToolbarConfig();
      if (toolbar?.items) {
        items.push(...toolbar.items);
      }
    }
    return items;
  }

  /**
   * Get all menu items from plugins.
   */
  getMenuItems(): any[] {
    const items: any[] = [];
    for (const plugin of this.plugins.values()) {
      items.push(...plugin.getMenuItems());
    }
    return items;
  }
}

/**
 * Create a plugin manager instance.
 */
export function createPluginManager(): PluginManager {
  return new PluginManager();
}