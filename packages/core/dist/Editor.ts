import { EditorState, Transaction } from './EditorState';
import { Schema, defaultSchema } from './schema/Schema';
import { Plugin } from './plugins/Plugin';
import { CommandManager } from './commands/CommandManager';
import { Node } from './model/Node';

/**
 * Configuration for creating an editor instance.
 */
export interface EditorConfig {
  /** Initial document content */
  doc?: Node;
  /** Document schema */
  schema?: Schema;
  /** List of plugins */
  plugins?: Plugin[];
  /** Initial content as HTML string */
  content?: string;
  /** Event handlers */
  onUpdate?: (props: { editor: Editor; transaction: Transaction }) => void;
  onSelectionUpdate?: (props: { editor: Editor }) => void;
  onFocus?: (props: { editor: Editor }) => void;
  onBlur?: (props: { editor: Editor }) => void;
}

/**
 * Main editor class that coordinates state, plugins, and commands.
 */
export class Editor {
  private _state: EditorState;
  private commandManager: CommandManager;
  private config: EditorConfig;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: EditorConfig = {}) {
    this.config = config;
    this.commandManager = new CommandManager();

    // Initialize schema
    const schema = config.schema || defaultSchema;

    // Create initial document
    let doc = config.doc;
    if (!doc) {
      if (config.content) {
        // Parse HTML content (simplified)
        doc = this.parseHTML(config.content, schema);
      } else {
        // Create empty document
        doc = schema.nodes.doc.create({}, schema.nodes.paragraph.create());
      }
    }

    // Create initial state
    this._state = EditorState.create({
      doc,
      schema,
      plugins: config.plugins || []
    });

    // Register plugin commands
    this.registerPluginCommands();

    // Initialize plugins
    this.initializePlugins();
  }

  /**
   * Get the current editor state.
   */
  get state(): EditorState {
    return this._state;
  }

  /**
   * Dispatch a transaction to update the editor state.
   */
  dispatch(tr: Transaction): void {
    const newState = this._state.apply(tr);
    const oldState = this._state;
    this._state = newState;

    // Notify plugins
    this.notifyPlugins('onTransaction', tr);

    // Call update handler
    if (this.config.onUpdate) {
      this.config.onUpdate({ editor: this, transaction: tr });
    }

    // Emit update event
    this.emit('update', { editor: this, transaction: tr });
  }

  /**
   * Execute a command by name.
   */
  executeCommand(name: string): boolean {
    return this.commandManager.execute(name, this._state, (tr) => this.dispatch(tr));
  }

  /**
   * Get the document as HTML.
   */
  getHTML(): string {
    return this.serializeToHTML(this._state.doc);
  }

  /**
   * Get the document as JSON.
   */
  getJSON(): any {
    return this._state.doc.toJSON();
  }

  /**
   * Set the content from HTML.
   */
  setContent(html: string): void {
    const doc = this.parseHTML(html, this._state.schema);
    const tr = this._state.tr.setDoc(doc);
    this.dispatch(tr);
  }

  /**
   * Destroy the editor and clean up resources.
   */
  destroy(): void {
    // Notify plugins
    this.notifyPlugins('onDestroy');

    // Clear event listeners
    this.eventListeners.clear();

    // Clear commands
    this.commandManager.clear();
  }

  /**
   * Add an event listener.
   */
  on(event: string, handler: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(handler);
  }

  /**
   * Remove an event listener.
   */
  off(event: string, handler: Function): void {
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event.
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * Register commands from all plugins.
   */
  private registerPluginCommands(): void {
    for (const plugin of this._state.plugins) {
      const commands = plugin.getCommands();
      for (const [name, command] of Object.entries(commands)) {
        this.commandManager.register(name, command);
      }
    }
  }

  /**
   * Initialize all plugins.
   */
  private initializePlugins(): void {
    const context = {
      schema: this._state.schema,
      state: this._state,
      dispatch: (tr: Transaction) => this.dispatch(tr)
    };

    for (const plugin of this._state.plugins) {
      plugin.init(context);
    }
  }

  /**
   * Notify plugins of events.
   */
  private notifyPlugins(method: string, ...args: any[]): void {
    const context = {
      schema: this._state.schema,
      state: this._state,
      dispatch: (tr: Transaction) => this.dispatch(tr)
    };

    for (const plugin of this._state.plugins) {
      if (typeof (plugin as any)[method] === 'function') {
        (plugin as any)[method](...args, context);
      }
    }
  }

  /**
   * Parse HTML content to document nodes (simplified implementation).
   */
  private parseHTML(html: string, schema: Schema): Node {
    // This is a simplified parser - a real implementation would be more robust
    if (!html.trim()) {
      return schema.nodes.doc.create({}, schema.nodes.paragraph.create());
    }

    // For now, create a simple paragraph with the text content
    const textContent = html.replace(/<[^>]*>/g, '');
    const textNode = schema.nodes.text.create({ text: textContent });
    const paragraph = schema.nodes.paragraph.create({}, [textNode]);
    
    return schema.nodes.doc.create({}, [paragraph]);
  }

  /**
   * Serialize document to HTML (simplified implementation).
   */
  private serializeToHTML(doc: Node): string {
    // This is a simplified serializer - a real implementation would be more robust
    return doc.textContent;
  }
}