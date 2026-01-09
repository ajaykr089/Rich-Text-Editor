import { EditorState, Transaction } from '../EditorState';

/**
 * Command function type.
 */
export type Command = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: any
) => boolean;

/**
 * Command manager for registering and executing commands.
 */
export class CommandManager {
  private commands = new Map<string, Command>();

  /**
   * Register a command.
   */
  register(name: string, command: Command): void {
    this.commands.set(name, command);
  }

  /**
   * Execute a command by name.
   */
  execute(
    name: string,
    state: EditorState,
    dispatch?: (tr: Transaction) => void,
    view?: any
  ): boolean {
    const command = this.commands.get(name);
    if (!command) {
      console.warn(`Command "${name}" not found`);
      return false;
    }

    try {
      return command(state, dispatch, view);
    } catch (error) {
      console.error(`Error executing command "${name}":`, error);
      return false;
    }
  }

  /**
   * Check if a command exists.
   */
  has(name: string): boolean {
    return this.commands.has(name);
  }

  /**
   * Get all registered command names.
   */
  getCommandNames(): string[] {
    return Array.from(this.commands.keys());
  }

  /**
   * Clear all commands.
   */
  clear(): void {
    this.commands.clear();
  }
}

/**
 * Create a command manager instance.
 */
export function createCommandManager(): CommandManager {
  return new CommandManager();
}