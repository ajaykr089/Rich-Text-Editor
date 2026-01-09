import { useContext, useMemo } from 'react';
import { EditorContext } from '../context/EditorContext';

/**
 * Hook to access the current editor state.
 */
export const useEditor = () => {
  const { state } = useContext(EditorContext)!;
  return state;
};

/**
 * Hook to get the dispatch function for sending transactions.
 */
export const useDispatch = () => {
  const { dispatch } = useContext(EditorContext)!;
  return dispatch;
};

/**
 * Hook to access the current selection.
 */
export const useSelection = () => {
  const { state } = useContext(EditorContext)!;
  return state.selection;
};

/**
 * Hook to check if the editor is in a focused state.
 */
export const useFocused = () => {
  // This would be implemented with focus tracking
  // For now, return a placeholder
  return false;
};

/**
 * Hook to get the current schema.
 */
export const useSchema = () => {
  const { state } = useContext(EditorContext)!;
  return state.schema;
};

/**
 * Hook to get the list of active plugins.
 */
export const usePlugins = () => {
  const { plugins } = useContext(EditorContext)!;
  return plugins;
};

/**
 * Hook to check if a command can be executed.
 */
export const useCommandEnabled = (commandName: string) => {
  const { state } = useContext(EditorContext)!;

  return useMemo(() => {
    // Find the command in plugins
    for (const plugin of state.plugins) {
      const commands = plugin.getCommands();
      if (commands[commandName]) {
        try {
          // Test if command can execute (doesn't dispatch, just checks)
          return commands[commandName](state, undefined) !== false;
        } catch {
          return false;
        }
      }
    }
    return false;
  }, [state, commandName]);
};

/**
 * Hook to execute a command.
 */
export const useCommand = (commandName: string) => {
  const { state, dispatch } = useContext(EditorContext)!;

  return useMemo(() => {
    return () => {
      // Find and execute the command
      for (const plugin of state.plugins) {
        const commands = plugin.getCommands();
        if (commands[commandName]) {
          commands[commandName](state, dispatch);
          break;
        }
      }
    };
  }, [state, dispatch, commandName]);
};

/**
 * Hook to get editor view instance.
 */
export const useView = () => {
  const { view } = useContext(EditorContext)!;
  return view;
};