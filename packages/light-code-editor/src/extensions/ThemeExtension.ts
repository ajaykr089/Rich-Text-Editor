/**
 * Theme Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore } from '../types';

export class ThemeExtension implements EditorExtension {
  public readonly name = 'theme';
  private editor: EditorCore | null = null;
  private currentTheme = 'dark';

  setup(editor: EditorCore): void {
    this.editor = editor;

    // Register theme commands
    editor.registerCommand('setTheme', (theme: string) => {
      this.setTheme(theme);
    });

    editor.registerCommand('toggleTheme', () => {
      this.toggleTheme();
    });

    // Set initial theme
    this.setTheme(this.currentTheme);
  }

  private setTheme(theme: string): void {
    if (!this.editor) return;

    this.currentTheme = theme;
    this.editor.setTheme(theme);
  }

  private toggleTheme(): void {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  destroy(): void {
    this.editor = null;
  }
}
