import { EditorState } from './EditorState';
import { PluginManager } from './plugins/Plugin';
import { Node } from './schema/Node';

export class Editor {
  state: EditorState;
  pluginManager: PluginManager;
  commands: Record<string, (state: EditorState) => EditorState | null>;
  listeners: Array<(state: EditorState) => void> = [];

  constructor(pluginManager: PluginManager) {
    this.pluginManager = pluginManager;
    const schema = pluginManager.buildSchema();
    this.state = EditorState.create(schema);
    this.commands = pluginManager.getCommands();
  }

  setState(state: EditorState): void {
    this.state = state;
    this.listeners.forEach(fn => fn(state));
  }

  onChange(fn: (state: EditorState) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  execCommand(name: string): boolean {
    const command = this.commands[name];
    if (!command) return false;
    
    const newState = command(this.state);
    if (newState) {
      this.setState(newState);
      return true;
    }
    return false;
  }

  setContent(doc: Node): void {
    this.setState(this.state.apply(doc));
  }

  getContent(): Node {
    return this.state.doc;
  }
}
