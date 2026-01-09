// Main component
export { RichTextEditor, default } from './components/RichTextEditor';

// UI Components
export { Toolbar, ToolbarButton } from './components/Toolbar';
export { EditorContent } from './components/EditorContent';

// Context and provider
export { EditorProvider, useEditorContext } from './context/EditorContext';
export type { EditorContextValue, EditorProviderProps } from './context/EditorContext';

// Hooks
export {
  useEditor,
  useDispatch,
  useSelection,
  useFocused,
  useSchema,
  usePlugins,
  useCommandEnabled,
  useCommand,
  useView
} from './hooks/useEditor';

// Types
export type { RichTextEditorProps } from './components/RichTextEditor';
export type { ToolbarProps } from './components/Toolbar';
export type { EditorContentProps } from './components/EditorContent';