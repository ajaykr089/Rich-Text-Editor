// Core framework-agnostic editor engine
export * from '@rte-editor/core';

// React integration layer
export * from '@rte-editor/react';

// Re-export commonly used types
export type {
  EditorState,
  Plugin,
  RichTextEditorProps
} from '@rte-editor/core';

// Default export - main React component
export { default } from '@rte-editor/react';