/**
 * Lightweight Code Editor Library
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorCore } from './EditorCore';

// Main exports
export { EditorCore } from './EditorCore';
export { TextModel } from './TextModel';
export { View } from './View';

// Extensions
export * from './extensions';

// Types
export type {
  EditorAPI,
  EditorConfig,
  EditorState,
  EditorEvents,
  EditorExtension,
  Position,
  Range,
  TextChange,
  Cursor,
  SearchResult,
  SearchOptions,
  BracketMatch,
  FoldRange,
  Theme
} from './types';

// Factory function for easy instantiation
export function createEditor(container: HTMLElement, config?: import('./types').EditorConfig) {
  return new EditorCore(container, config);
}

// Default export
export default EditorCore;
